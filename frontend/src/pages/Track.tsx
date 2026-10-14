import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../api';
import type { TrackedRequest } from '../types';
import { fmtDate, Loading, useTitle, waLink } from '../lib';

const STEPS = ['Pending', 'Under Review', 'Processing', 'Completed'];

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'Completed' ? 'bg-success' : status === 'Processing' ? 'bg-info text-dark' : status === 'Under Review' ? 'bg-warning text-dark' : 'bg-secondary';
  return <span className={`badge ${cls} px-4 py-2 rounded-pill fs-6`}>{status}</span>;
}

function Progress({ status }: { status: string }) {
  const idx = STEPS.indexOf(status);
  const [width, cls] = idx === 0 ? [25, 'bg-secondary'] : idx === 1 ? [50, 'bg-warning'] : idx === 2 ? [75, 'bg-info'] : idx === 3 ? [100, 'bg-success'] : [100, 'bg-danger'];
  return (
    <div className="mb-4">
      <div className="track-steps text-muted mb-2" aria-hidden="true">
        {STEPS.map((s) => <span key={s} className={s === status ? 'is-current' : ''}>{s}</span>)}
      </div>
      <div className="progress" style={{ height: 10 }} role="progressbar" aria-label={`Request progress: ${status}`}>
        <div className={`progress-bar ${cls}`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}

export default function Track() {
  useTitle('Track Service Request Status • HOMline DIGI seva');
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(requestId ?? '');
  const [data, setData] = useState<{ request: TrackedRequest; qr_code_url: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInput(requestId ?? '');
    setData(null);
    setError('');
    if (!requestId) return;
    let live = true;
    setLoading(true);
    api<{ request: TrackedRequest; qr_code_url: string }>(`track/${encodeURIComponent(requestId)}/`)
      .then((d) => live && setData(d))
      .catch((e: ApiError) => live && setError(e.message))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [requestId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = input.trim();
    if (id) navigate(`/track/${encodeURIComponent(id)}`);
  };

  const r = data?.request;
  return (
    <>
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-2">
          <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">Service Tracker</span>
          <h1 className="display-5 fw-extrabold text-white mb-3">Track Your Request Status</h1>
          <p className="lead text-white-50 max-width-700 mx-auto mb-0">Check the latest request status and download your receipt using your private reference number.</p>
        </div>
      </section>

      <section className="py-5 bg-soft-mist">
        <div className="container">
          <div className="max-width-800 mx-auto">
            <div className="homline-card bg-white p-4 p-md-5 mb-4 shadow-sm">
              <form className="mb-2" onSubmit={submit}>
                <label className="form-label fw-bold text-navy fs-5" htmlFor="trackId">Enter Request ID / Reference Number</label>
                <div className="input-group input-group-lg">
                  <input id="trackId" value={input} onChange={(e) => setInput(e.target.value)} className="form-control font-monospace fw-bold text-uppercase" placeholder="Enter Reference ID (e.g. HOM-2026-XXXXXX)" required />
                  <button type="submit" className="btn btn-navy px-4"><i className="bi bi-search me-1"></i> Track Status</button>
                </div>
                <span className="form-text text-muted small mt-2 d-block"><i className="bi bi-info-circle me-1 text-teal"></i> Enter the unique Reference ID provided upon application submission.</span>
              </form>
            </div>

            {loading && <Loading />}
            {error && (
              <div className="alert alert-danger rounded-4 p-4 shadow-sm">
                <h5 className="fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i> Request Not Found</h5>
                <p className="mb-0">{error}</p>
              </div>
            )}

            {r && (
              <div className="homline-card bg-white p-4 p-md-5 shadow-lg border-0 overflow-hidden">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 border-bottom pb-3 gap-3">
                  <div className="token-id">
                    <span className="token-label">Request Reference ID</span>
                    <span className="token-value font-monospace">{r.request_id}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <StatusBadge status={r.status} />
                    <Link to={`/receipt/${r.request_id}`} target="_blank" className="btn btn-outline-navy btn-sm fw-bold"><i className="bi bi-printer-fill me-1"></i> Receipt PDF</Link>
                  </div>
                </div>

                <Progress status={r.status} />

                <div className="row g-3 mb-4">
                  <div className="col-md-6"><span className="text-muted small d-block">Requested Service:</span><strong className="text-navy fs-6">{r.service_title}</strong></div>
                  <div className="col-md-6"><span className="text-muted small d-block">Applicant Name:</span><strong className="text-navy fs-6">{r.full_name}</strong></div>
                  <div className="col-md-6"><span className="text-muted small d-block">Contact Preference:</span><span className="badge bg-light text-navy border font-monospace">{r.contact_preference}</span></div>
                  <div className="col-md-6"><span className="text-muted small d-block">Last Updated:</span><strong className="text-navy fs-6">{fmtDate(r.updated_at, true)}</strong></div>
                </div>

                <div className="card border-1 mb-4 shadow-sm" style={{ borderColor: '#0d9488', background: '#f8fafc' }}>
                  <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <strong className="text-navy"><i className="bi bi-receipt-cutoff text-teal me-2"></i> Verified Service Rates &amp; Fee Structure</strong>
                    <span className="badge bg-teal text-white font-monospace">Official Notice</span>
                  </div>
                  <div className="card-body p-4">
                    <div className="row align-items-center g-3">
                      <div className="col-md-8">
                        <div className="d-flex justify-content-between pb-2 mb-2 border-bottom"><span className="text-muted">HOMline Assistance &amp; Process Fee:</span><strong className="text-navy font-monospace fs-6">{r.service_charge || '₹150'}</strong></div>
                        <div className="d-flex justify-content-between pb-2 mb-2 border-bottom"><span className="text-muted">Third-Party / Government Portal Fee:</span><strong className="text-teal font-monospace fs-6">{r.portal_fee || 'As per Govt portal'}</strong></div>
                        <small className="text-muted d-block font-monospace" style={{ fontSize: '0.76rem' }}>* Government &amp; third-party fees are charged strictly as per official portal tariffs. Rate set by HOMline operations desk.</small>
                      </div>
                      <div className="col-md-4 text-center border-start border-md ps-md-3">
                        {data?.qr_code_url && (
                          <>
                            <img src={data.qr_code_url} alt="Verification QR Code" width={110} height={110} className="rounded border p-1 bg-white shadow-sm mb-1" />
                            <small className="text-muted d-block font-monospace" style={{ fontSize: '0.7rem' }}>Scan to Verify Request</small>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {r.timeline.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold text-navy mb-3"><i className="bi bi-clock-history text-teal me-1"></i> Activity Timeline History</h6>
                    <div className="border-start border-2 border-teal ps-3 ms-2">
                      {r.timeline.map((l, i) => (
                        <div className="mb-3 position-relative" key={i}>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-teal text-white font-monospace" style={{ fontSize: '0.72rem' }}>{l.status}</span>
                            <span className="text-muted font-monospace ms-auto" style={{ fontSize: '0.75rem' }}>{fmtDate(l.created_at, true)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="d-flex flex-wrap justify-content-between align-items-center text-muted small border-top pt-3 gap-2">
                  <span>Submitted: {fmtDate(r.created_at, true)}</span>
                  <div className="d-flex gap-2">
                    <Link to={`/receipt/${r.request_id}`} target="_blank" className="btn btn-sm btn-navy"><i className="bi bi-file-earmark-pdf-fill me-1"></i> Download Receipt</Link>
                    <a href={waLink(`Hi HOMline, I am following up on Request ID ${r.request_id}`)} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm"><i className="bi bi-whatsapp me-1"></i> WhatsApp Query</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
