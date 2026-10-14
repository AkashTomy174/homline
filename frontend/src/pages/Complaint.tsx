import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Errors, SubmitButton, useSubmit } from '../components/forms';
import { fmtDate, Loading, useApi, useTitle } from '../lib';

const TYPES = ['Complaint', 'Suggestion', 'General Feedback', 'Accessibility Concern', 'Service Issue', 'Appreciation', 'Other'];
const RESPONSES: [string, string][] = [['Call', 'Call'], ['WhatsApp', 'WhatsApp'], ['Email', 'Email'], ['None', 'No response needed']];
const TIMES = ['Anytime', 'Morning', 'Afternoon', 'Evening'];
const req = <span className="text-danger" aria-hidden="true">*</span>;

export function Complaint() {
  useTitle('Feedback, Complaints & Suggestions • HOMline DIGI seva');
  const navigate = useNavigate();
  const summary = useRef<HTMLDivElement>(null);
  const { errors, busy, submit } = useSubmit<{ reference_no: string }>('complaints/', (d) => navigate(`/complaint-suggestion/received/${d.reference_no}`));
  const labels: Record<string, string> = {
    name: 'Full Name', mobile: 'Mobile Number', email: 'Email Address', subject: 'Subject', details: 'Details', consent: 'Declaration',
    acknowledge: 'Acknowledgement', supporting_document: 'Supporting Document', entry_type: 'Type', is_member: 'Member', membership_id: 'Membership ID',
    service_name: 'Service', related_reference: 'Reference Number',
  };
  const keys = Object.keys(errors).filter((k) => errors[k].length);
  useEffect(() => { if (keys.length) summary.current?.focus(); }, [errors]);   // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-2">
          <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">Feedback • Complaints • Suggestions</span>
          <h1 className="display-5 fw-extrabold text-white mb-3">We’re Listening. Your Voice Matters.</h1>
          <p className="lead text-white-50 mx-auto mb-0" style={{ maxWidth: 720 }}>Share a complaint, suggestion, feedback, accessibility concern or appreciation. Your input helps us improve our services and make digital assistance more accessible for everyone.</p>
        </div>
      </section>
      <section className="py-5 bg-soft-mist">
        <div className="container" style={{ maxWidth: 860 }}>
          {keys.length > 0 && (
            <div className="alert alert-danger rounded-4" role="alert" tabIndex={-1} ref={summary}>
              <strong>Please correct the following before submitting:</strong>
              <ul className="mb-0">{keys.flatMap((k) => errors[k].map((e) => <li key={k + e}>{k === '__all__' ? e : `${labels[k] ?? k}: ${e}`}</li>))}</ul>
            </div>
          )}
          <form className="homline-card bg-white p-4 p-md-5 shadow-sm" onSubmit={submit} noValidate>
            <h2 className="h5 fw-bold text-teal">A. Submission Type {req}</h2>
            <div className="mb-4">
              <label htmlFor="entry_type" className="form-label fw-bold text-navy">What would you like to share?</label>
              <select id="entry_type" name="entry_type" className="form-select form-select-lg" defaultValue="Complaint">{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </div>

            <h2 className="h5 fw-bold text-teal">B. Your Details</h2>
            <div className="row g-3 mb-4">
              <div className="col-md-6"><label htmlFor="name" className="form-label fw-bold text-navy">Full Name {req}</label><input id="name" name="name" className="form-control" placeholder="Enter your full name" autoComplete="name" required /></div>
              <div className="col-md-6"><label htmlFor="mobile" className="form-label fw-bold text-navy">Mobile Number {req}</label><input id="mobile" name="mobile" className="form-control" placeholder="Enter your mobile number" inputMode="tel" autoComplete="tel" required /></div>
              <div className="col-md-6"><label htmlFor="email" className="form-label fw-bold text-navy">Email Address</label><input id="email" name="email" type="email" className="form-control" placeholder="Enter your email address (optional)" /></div>
              <div className="col-md-6"><label htmlFor="is_member" className="form-label fw-bold text-navy">HOMline Member?</label><select id="is_member" name="is_member" className="form-select" defaultValue="No"><option>Yes</option><option>No</option><option>Not Sure</option></select></div>
              <div className="col-md-6"><label htmlFor="membership_id" className="form-label fw-bold text-navy">Membership / Customer ID</label><input id="membership_id" name="membership_id" className="form-control" placeholder="Membership / Customer ID, if applicable" /></div>
            </div>

            <h2 className="h5 fw-bold text-teal">C. Related Service</h2>
            <div className="row g-3 mb-4">
              <div className="col-12">
                <fieldset>
                  <legend className="form-label fw-bold text-navy fs-6">Is this related to a HOMline service?</legend>
                  <div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="related_to_service" id="rel_yes" value="True" /><label className="form-check-label" htmlFor="rel_yes">Yes</label></div>
                  <div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="related_to_service" id="rel_no" value="False" defaultChecked /><label className="form-check-label" htmlFor="rel_no">No</label></div>
                </fieldset>
              </div>
              <div className="col-md-6"><label htmlFor="service_name" className="form-label fw-bold text-navy">Service</label><input id="service_name" name="service_name" className="form-control" placeholder="Select / enter service" /></div>
              <div className="col-md-6"><label htmlFor="related_reference" className="form-label fw-bold text-navy">Request / Reference Number</label><input id="related_reference" name="related_reference" className="form-control" placeholder="Request / Reference number, if available" /></div>
            </div>

            <h2 className="h5 fw-bold text-teal">D. Tell Us What Happened / What You Suggest</h2>
            <div className="mb-3"><label htmlFor="subject" className="form-label fw-bold text-navy">Subject {req}</label><input id="subject" name="subject" className="form-control" placeholder="Brief subject / topic" required /></div>
            <div className="mb-4"><label htmlFor="details" className="form-label fw-bold text-navy">Details {req}</label><textarea id="details" name="details" className="form-control" rows={4} placeholder="Tell us what happened or what you suggest, with any information that may help us understand the matter." required /></div>

            <h2 className="h5 fw-bold text-teal">Supporting Information</h2>
            <div className="mb-2">
              <label htmlFor="supporting_document" className="form-label fw-bold text-navy">Supporting Document / Screenshot <small className="text-muted fw-normal">(optional • JPG • PNG • PDF • max 10 MB)</small></label>
              <input id="supporting_document" name="supporting_document" type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className="alert alert-warning small" role="note"><strong>Important:</strong> Do not upload passwords, OTPs, PINs, banking credentials or other unnecessary sensitive information.</div>

            <h2 className="h5 fw-bold text-teal">Preferred Response</h2>
            <div className="row g-3 mb-4">
              <div className="col-md-6"><label htmlFor="preferred_response" className="form-label fw-bold text-navy">Contact me by</label><select id="preferred_response" name="preferred_response" className="form-select" defaultValue="Call">{RESPONSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
              <div className="col-md-6"><label htmlFor="preferred_time" className="form-label fw-bold text-navy">Preferred time</label><select id="preferred_time" name="preferred_time" className="form-select" defaultValue="Anytime">{TIMES.map((t) => <option key={t}>{t}</option>)}</select></div>
            </div>

            <h2 className="h5 fw-bold text-teal">Declaration &amp; Consent</h2>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" name="consent" id="consent" />
              <label className="form-check-label" htmlFor="consent">I confirm that the information provided is accurate to the best of my knowledge and may be used by HOMline to review and respond to this submission. {req}</label>
              <Errors errors={errors} name="consent" />
            </div>
            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" name="acknowledge" id="acknowledge" />
              <label className="form-check-label" htmlFor="acknowledge">I understand that submission of a complaint or feedback does not automatically guarantee a particular outcome. {req}</label>
              <Errors errors={errors} name="acknowledge" />
            </div>

            <SubmitButton busy={busy} className="btn btn-navy btn-lg w-100 fw-bold">SEND TO HOMLINE</SubmitButton>
            <p className="small text-muted mt-3 mb-0">
              <strong>Privacy &amp; Confidentiality:</strong> Information submitted here is used only to review, respond to and improve HOMline services.
              Can’t complete the form? <a href="tel:6282268453">Call 6282268453</a> or <a href="https://wa.me/916282268453">message us on WhatsApp</a>.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

export function ComplaintReceived() {
  useTitle('Thank You • HOMline DIGI seva');
  const { ref } = useParams();
  const { data, error, loading } = useApi<{ reference_no: string; entry_type: string; created_at: string }>(`complaints/received/${ref}/`);
  
  if (loading) return <Loading />;
  if (error || !data) return <div className="container py-5 text-center"><p className="text-muted">This confirmation is only available right after you submit the form.</p><Link to="/complaint-suggestion" className="btn btn-navy">Open the form</Link></div>;

  return (
    <section className="py-5 bg-soft-mist">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="homline-card bg-white p-4 p-md-5 shadow-sm text-center">
          <div className="display-4 text-success" aria-hidden="true"><i className="bi bi-check-circle-fill"></i></div>
          <h1 className="fw-extrabold text-navy mt-2">Thank You for Reaching Out.</h1>
          <p className="text-muted">Your {data.entry_type.toLowerCase()} has been successfully received by the HOMline team.</p>
          <div className="token-id my-2"><span className="token-label">Reference Number</span><span className="token-value font-monospace">{data.reference_no}</span></div>
          <p className="small text-muted">Please save this number. Received {fmtDate(data.created_at, true)}.</p>
          <h2 className="h5 fw-bold text-navy text-start mt-4">What Happens Next?</h2>
          <ol className="text-start list-unstyled">
            <li className="mb-2"><strong>01 · Received</strong> — Your submission has been recorded.</li>
            <li className="mb-2"><strong>02 · Under Review</strong> — The HOMline team reviews the information.</li>
            <li className="mb-2"><strong>03 · Action</strong> — The matter is forwarded for appropriate action where required.</li>
            <li className="mb-2"><strong>04 · Response</strong> — If requested, HOMline contacts you through the selected method.</li>
          </ol>
          <Link to="/" className="btn btn-navy px-4 fw-bold mt-2">Back to Home</Link>
        </div>
      </div>
    </section>
  );
}
