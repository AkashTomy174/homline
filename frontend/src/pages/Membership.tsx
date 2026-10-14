import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, ApiError } from '../api';
import { useApp } from '../app';
import { Errors, FormAlert, hideModal, SubmitButton, useSubmit } from '../components/forms';
import { fmtDate, useApi, useTitle } from '../lib';
import type { Membership as MembershipT, Plan } from '../types';

const lines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);

function CheckBox() {
  const [params, setParams] = useSearchParams();
  const code = params.get('check_code') ?? '';
  const [input, setInput] = useState(code);
  const [result, setResult] = useState<MembershipT | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setInput(code);
    setResult(null);
    setError('');
    if (!code) return;
    let live = true;
    api<MembershipT>(`membership/?code=${encodeURIComponent(code)}`)
      .then((d) => live && setResult(d))
      .catch((e: ApiError) => live && setError(e.message));
    return () => { live = false; };
  }, [code]);
  const submit = (e: FormEvent) => { e.preventDefault(); setParams({ check_code: input.trim() }); };

  return (
    <section className="py-4 bg-white border-bottom" id="check-membership">
      <div className="container">
        <div className="homline-card bg-soft-mist p-4 rounded-4 max-width-800 mx-auto shadow-sm border border-teal-subtle">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon-box bg-navy text-white" style={{ width: 44, height: 44, fontSize: '1.3rem' }}><i className="bi bi-person-badge-fill text-gold"></i></div>
            <div>
              <h4 className="fw-bold text-navy mb-0">Check Your Membership Status</h4>
              <small className="text-muted">Enter the Membership Code sent to your WhatsApp (e.g. HOM-MBR-2026-A1B2C3D4E5)</small>
            </div>
          </div>
          <form className="row g-2 align-items-center" onSubmit={submit}>
            <div className="col-md-9"><input value={input} onChange={(e) => setInput(e.target.value)} className="form-control form-control-lg font-monospace fw-bold" placeholder="HOM-MBR-2026-XXXXXXXXXX" aria-label="Membership code" autoComplete="off" required /></div>
            <div className="col-md-3"><button type="submit" className="btn btn-navy btn-lg w-100 fw-bold"><i className="bi bi-search me-1"></i> Verify</button></div>
          </form>
          {error && <div className="alert alert-warning mt-3 mb-0 rounded-3 small"><i className="bi bi-exclamation-triangle-fill me-1"></i> {error}</div>}
          {result && (
            <div className="mt-4 p-4 bg-white rounded-4 border border-success shadow-sm">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pb-3 mb-3 border-bottom gap-2">
                <div>
                  <span className="badge bg-success-subtle text-success font-monospace px-3 py-1 rounded-pill fw-bold"><i className="bi bi-patch-check-fill me-1"></i> {result.status}</span>
                  <h4 className="fw-extrabold text-navy mt-2 mb-0">{result.name}</h4>
                  <small className="text-teal font-monospace"><i className="bi bi-geo-alt-fill me-1"></i>{result.place || 'Kerala, India'}</small>
                </div>
                <div className="text-sm-end">
                  <span className="small text-muted d-block font-monospace">MEMBERSHIP CODE</span>
                  <strong className="font-monospace fs-5 text-primary">{result.membership_code || 'Code Pending Admin Approval'}</strong>
                </div>
              </div>
              <div className="row g-3 mb-3 text-muted small">
                <div className="col-6 col-md-3"><span className="d-block text-muted">Selected Plan:</span><strong className="text-navy fs-6">{result.plan || 'HOMline Member'}</strong></div>
                <div className="col-6 col-md-3"><span className="d-block text-muted">Phone Number:</span><strong className="text-navy font-monospace">{result.masked_mobile}</strong></div>
                <div className="col-6 col-md-3"><span className="d-block text-muted">Open Date:</span><strong className="text-navy font-monospace">{fmtDate(result.open_date) || 'Recently Joined'}</strong></div>
                <div className="col-6 col-md-3"><span className="d-block text-muted">Valid Till:</span><strong className="text-warning font-monospace">{fmtDate(result.valid_till) || 'Active 1 Year'}</strong></div>
              </div>
              {result.membership_code ? (
                <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center pt-3 border-top">
                  <span className="text-muted small"><i className="bi bi-shield-check text-success me-1"></i> Verified HOMline Official Member</span>
                  <Link to={`/membership/card/${result.membership_code}`} target="_blank" className="btn btn-teal fw-bold px-4"><i className="bi bi-printer-fill me-2"></i> Download Membership Card (PDF)</Link>
                </div>
              ) : (
                <div className="alert alert-info mb-0 small"><i className="bi bi-info-circle-fill me-1"></i> Your membership is currently under review by the admin team. Once approved, your unique code will be activated and sent to your WhatsApp.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const STEPS: [string, string, string][] = [
  ['01', 'Apply', 'Fill your details & choose a plan below'], ['02', 'Submit', 'Instant recording in operations database'],
  ['03', 'Admin Verify', 'Admin verifies thru Dashboard or phone call'], ['04', 'Approval', 'Admin Panel gives verified approval'],
  ['05', 'Unique Code', 'Auto-generated Member ID sent to WhatsApp'], ['06', 'Card PDF', 'Download & print your official Membership Card'],
];

function EnquiryModal({ plans }: { plans: Plan[] }) {
  const { notify, user } = useApp();
  const el = useRef<HTMLDivElement>(null);
  const { errors, busy, submit } = useSubmit<{ message: string }>('membership/', (d, form) => {
    hideModal(el.current);
    form.reset();
    notify(d.message);
  });
  return (
    <div className="modal fade" id="membershipEnquiryModal" tabIndex={-1} aria-labelledby="membershipModalLabel" aria-hidden="true" ref={el}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header bg-navy text-white p-4">
            <div className="d-flex align-items-center gap-2">
              <div className="brand-icon-box" style={{ width: 36, height: 36, fontSize: '1.1rem' }}><i className="bi bi-person-badge-fill"></i></div>
              <div>
                <h5 className="modal-title font-brand text-white mb-0" id="membershipModalLabel">Apply for HOMline Membership</h5>
                <small className="text-white-50">Admin will verify and send your Member ID to WhatsApp</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form className="p-4" onSubmit={submit}>
            <FormAlert errors={errors} />
            <div className="mb-3">
              <label className="form-label fw-bold text-navy" htmlFor="mm-name">Full Name <span className="text-danger">*</span></label>
              <input id="mm-name" name="name" className="form-control form-control-lg" placeholder="Enter your full name" defaultValue={user?.first_name ?? ''} required />
              <Errors errors={errors} name="name" />
            </div>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label fw-bold text-navy" htmlFor="mm-mobile">Mobile Number <span className="text-danger">*</span></label>
                <input id="mm-mobile" name="mobile" type="tel" className="form-control form-control-lg" placeholder="Mobile / WhatsApp" required />
                <Errors errors={errors} name="mobile" />
              </div>
              <div className="col-6">
                <label className="form-label fw-bold text-navy" htmlFor="mm-place">Place / Location <span className="text-danger">*</span></label>
                <input id="mm-place" name="place" className="form-control form-control-lg" placeholder="Village / Town / District" required />
                <Errors errors={errors} name="place" />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-navy" htmlFor="mm-email">Email Address (Optional)</label>
              <input id="mm-email" name="email" type="email" className="form-control" placeholder="name@example.com" defaultValue={user?.email ?? ''} />
              <Errors errors={errors} name="email" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-navy" htmlFor="mm-plan">Preferred Plan <span className="text-danger">*</span></label>
              <select id="mm-plan" name="preferred_plan" className="form-select form-select-lg">
                {plans.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.price})</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-navy" htmlFor="mm-notes">Additional Notes / Requirements</label>
              <textarea id="mm-notes" name="notes" className="form-control" rows={2} placeholder="Mention if you require special assistance, family member details, or business setup..." />
            </div>
            <div className="alert alert-light border border-teal rounded-3 p-3 small text-muted"><i className="bi bi-whatsapp text-success me-1"></i> Once approved in Admin Panel, our team sends your Unique Membership Code directly to your WhatsApp.</div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
              <SubmitButton busy={busy} className="btn btn-teal px-4 fw-bold">Submit Application <i className="bi bi-arrow-right ms-1"></i></SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Membership() {
  useTitle('Membership Plans, Card PDF & Verification • HOMline DIGI seva');
  const { data } = useApi<{ plans: Plan[] }>('plans/');
  const plans = data?.plans ?? [];
  const preselect = (id: number) => () => {
    const sel = document.getElementById('mm-plan') as HTMLSelectElement | null;
    if (sel) sel.value = String(id);
  };
  return (
    <>
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-3">
          <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">Privilege Club</span>
          <h1 className="display-5 fw-extrabold text-white mb-3">HOMline <span className="text-gradient-teal">Membership</span></h1>
          <p className="lead text-white-50 max-width-700 mx-auto mb-0">Priority assistance, exclusive service discounts, welcome credit vouchers, and your personalized digital membership card.</p>
        </div>
      </section>

      <CheckBox />

      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center max-width-700 mx-auto mb-4">
            <span className="badge bg-teal text-white px-3 py-1 rounded-pill font-monospace small">HOW IT WORKS</span>
            <h3 className="fw-bold text-navy mt-2">Membership Application &amp; Verification Flow</h3>
          </div>
          <div className="row g-3 text-center">
            {STEPS.map(([n, t, d]) => (
              <div className="col-lg-2 col-md-4 col-6" key={n}>
                <div className="p-3 bg-soft-mist rounded-3 h-100 border">
                  <div className="fw-extrabold text-teal fs-4 mb-1">{n}</div>
                  <h6 className="fw-bold text-navy mb-1">{t}</h6>
                  <small className="text-muted">{d}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-soft-mist">
        <div className="container">
          <div className="row g-4 mb-5">
            {plans.map((p) => (
              <div className="col-lg-4 col-md-6" key={p.id}>
                <div className={`homline-card membership-card service-card-animated ${p.is_popular ? 'popular bg-white shadow-lg' : 'bg-white'} d-flex flex-column justify-content-between p-4 h-100`}>
                  {p.is_popular && <div className="popular-badge">Most Popular</div>}
                  <div>
                    <span className="badge bg-light text-navy border mb-2 font-monospace">{p.name}</span>
                    <h3 className="fw-extrabold text-navy mb-1">{p.price}</h3>
                    <p className="text-muted small mb-4">{p.tagline}</p>
                    <div className="border-top border-bottom py-3 mb-4">
                      <h6 className="fw-bold text-navy mb-2"><i className="bi bi-star-fill text-gold me-1"></i> Membership Benefits:</h6>
                      <ul className="list-unstyled text-muted small mb-0">
                        {lines(p.features).map((f) => <li key={f} className="mb-2 d-flex align-items-start gap-2"><i className="bi bi-check-circle-fill text-teal flex-shrink-0 mt-1"></i><span>{f}</span></li>)}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h6 className="fw-bold text-teal mb-2"><i className="bi bi-gift-fill me-1"></i> Welcome Benefits:</h6>
                      <ul className="list-unstyled text-muted small mb-0">
                        {lines(p.welcome_benefits).map((b) => <li key={b} className="mb-2 d-flex align-items-start gap-2"><i className="bi bi-patch-check-fill text-gold flex-shrink-0 mt-1"></i><span>{b}</span></li>)}
                      </ul>
                    </div>
                  </div>
                  <button type="button" className={`btn ${p.is_popular ? 'btn-teal' : 'btn-navy'} w-100 fw-bold py-2 mt-3`} data-bs-toggle="modal" data-bs-target="#membershipEnquiryModal" onClick={preselect(p.id)}>Apply for {p.name} →</button>
                </div>
              </div>
            ))}
          </div>
          <div className="homline-card bg-white p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h4 className="fw-bold text-navy mb-2"><i className="bi bi-info-circle-fill text-teal me-2"></i> Note on Membership &amp; Service Charges</h4>
                <p className="text-muted mb-0">HOMline membership discounts apply strictly to the HOMline Service Charge. Official third-party/application fees paid to government bodies or external institutions are separate and subject to respective provider rates.</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <button type="button" className="btn btn-outline-navy" data-bs-toggle="modal" data-bs-target="#membershipEnquiryModal">Submit Membership Enquiry</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EnquiryModal plans={plans} />
    </>
  );
}
