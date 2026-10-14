import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Membership, TrackedRequest } from '../types';
import { fmtDate, Loading, useApi, useTitle } from '../lib';

// Standalone print layouts (rendered outside the site Layout). Their <style> is removed again on unmount.

const RECEIPT_CSS = `
body { background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #123B5D; }
.receipt-card { max-width: 800px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 2px solid #00A6A6; padding: 40px; position: relative; }
.receipt-header { border-bottom: 2px dashed #00A6A6; padding-bottom: 20px; margin-bottom: 25px; }
.brand-logo-box { width: 50px; height: 50px; background: #123B5D; color: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; }
.stamp-badge { border: 3px double #00A6A6; color: #00A6A6; font-weight: 800; text-transform: uppercase; padding: 6px 16px; border-radius: 8px; transform: rotate(-5deg); display: inline-block; letter-spacing: 1px; }
.barcode-box { font-family: monospace; font-weight: 700; letter-spacing: 3px; background: #f3f8fa; padding: 10px 20px; border-radius: 6px; border: 1px solid #e1ecf0; display: inline-block; }
@media print { body { background: white; } .no-print { display: none !important; } .receipt-card { box-shadow: none; border: 1px solid #123B5D; margin: 0; padding: 20px; } }
`;

const CARD_CSS = `
body { background: #0b1120; font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; color: #f8fafc; }
.membership-card-wrap { max-width: 580px; width: 100%; background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #093437 100%); border-radius: 24px; border: 2px solid rgba(245,158,11,0.4); box-shadow: 0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1); position: relative; overflow: hidden; padding: 32px; }
.card-watermark { position: absolute; right: -30px; bottom: -30px; font-size: 16rem; color: rgba(255,255,255,0.02); pointer-events: none; line-height: 1; }
.card-chip { width: 48px; height: 36px; background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%); border-radius: 6px; box-shadow: inset 0 1px 2px rgba(255,255,255,0.6); position: relative; }
.card-chip::after { content: ""; position: absolute; top: 10px; bottom: 10px; left: 0; right: 0; border-top: 1px solid rgba(0,0,0,0.3); border-bottom: 1px solid rgba(0,0,0,0.3); }
.membership-code-box { font-family: 'Space Grotesk', monospace; font-size: 1.4rem; letter-spacing: 3px; color: #fbbf24; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.stamp-seal { border: 2px dashed #0d9488; border-radius: 50%; width: 74px; height: 74px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.65rem; color: #2dd4bf; text-transform: uppercase; font-weight: 800; transform: rotate(-12deg); letter-spacing: 0.5px; background: rgba(13,148,136,0.08); }
.qr-badge { background: white; padding: 6px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: inline-block; }
@media print { body { background: white !important; padding: 0 !important; color: #0f172a !important; } .no-print { display: none !important; } .membership-card-wrap { border: 2px solid #0f172a !important; box-shadow: none !important; margin: 20px auto !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

export function Receipt() {
  const { requestId } = useParams();
  const { data, error, loading } = useApi<{ request: TrackedRequest; qr_code_url: string }>(`receipt/${requestId}/`);
  useTitle(`HOMline DIGI seva • Official Receipt Slip [${requestId}]`);
  if (loading) return <Loading />;
  if (error || !data) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">{error?.message ?? 'Receipt not found.'}</p>
        <Link to={`/track/${requestId}`} className="btn btn-outline-secondary">← Back to Tracker</Link>
      </div>
    );
  }
  const r = data.request;
  return (
    <>
      <style>{RECEIPT_CSS}</style>
      <div className="container">
        <div className="text-center mt-4 no-print">
          <button onClick={() => window.print()} className="btn btn-primary btn-lg fw-bold me-2" style={{ backgroundColor: '#123B5D', border: 'none' }}><i className="bi bi-printer-fill me-2"></i> Print / Save as PDF Receipt</button>
          <Link to={`/track/${r.request_id}`} className="btn btn-outline-secondary btn-lg">← Back to Tracker</Link>
        </div>
        <div className="receipt-card">
          <div className="receipt-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="brand-logo-box"><i className="bi bi-house-gear-fill"></i></div>
              <div>
                <h3 className="fw-extrabold mb-0" style={{ color: '#123B5D' }}>HOMline <span style={{ color: '#00A6A6' }}>DIGI seva</span></h3>
                <small className="text-muted fw-bold">An Initiative of AMDG Group • Helpline: 6282268453</small>
              </div>
            </div>
            <div className="text-end"><span className="stamp-badge">VERIFIED ACKNOWLEDGEMENT</span></div>
          </div>
          <div className="row align-items-center mb-4">
            <div className="col-md-6"><span className="text-muted small d-block">OFFICIAL REQUEST ID</span><div className="barcode-box text-navy fs-4">{r.request_id}</div></div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0"><span className="text-muted small d-block">DATE &amp; TIME RECORDED</span><strong className="text-dark">{fmtDate(r.created_at, true)}</strong></div>
          </div>
          <table className="table table-bordered mb-4">
            <tbody className="align-middle">
              <tr><th className="bg-light text-navy" style={{ width: '30%' }}>Applicant Name</th><td className="fw-bold">{r.full_name}</td></tr>
              <tr><th className="bg-light text-navy">Mobile Number</th><td className="font-monospace">{r.mobile}</td></tr>
              <tr><th className="bg-light text-navy">Email Address</th><td>{r.email || 'Not Provided'}</td></tr>
              <tr><th className="bg-light text-navy">Requested Service</th><td className="fw-bold text-teal fs-6">{r.service_title}</td></tr>
              <tr><th className="bg-light text-navy">Contact Preference</th><td><span className="badge bg-info text-dark">{r.contact_preference}</span></td></tr>
              <tr><th className="bg-light text-navy">Current Request Status</th><td><span className="badge bg-warning text-dark px-3 py-2 fs-6">{r.status}</span></td></tr>
            </tbody>
          </table>
          <div className="mb-4">
            <h6 className="fw-bold text-navy mb-2"><i className="bi bi-file-text me-1"></i> Submitted Requirement Specification:</h6>
            <div className="p-3 bg-light rounded border text-muted">{r.requirement_details}</div>
          </div>
          <div className="card border-1 mb-4" style={{ borderColor: '#00A6A6' }}>
            <div className="card-header bg-light fw-bold text-navy d-flex justify-content-between align-items-center">
              <span><i className="bi bi-calculator me-1"></i> Service Charge &amp; Official Fee Schedule</span>
              <span className="badge text-white font-monospace" style={{ backgroundColor: '#00A6A6' }}>VERIFIED RATE</span>
            </div>
            <div className="card-body p-3">
              <div className="row align-items-center g-3">
                <div className="col-md-8">
                  <div className="d-flex justify-content-between mb-2 pb-1 border-bottom"><span className="text-muted">HOMline DIGI seva Assistance Fee:</span><strong className="text-navy font-monospace fs-6">{r.service_charge || '₹150'}</strong></div>
                  <div className="d-flex justify-content-between mb-2 pb-1 border-bottom"><span className="text-muted">Official / Government Portal Fee:</span><strong className="font-monospace fs-6" style={{ color: '#00A6A6' }}>{r.portal_fee || 'As per Govt portal'}</strong></div>
                  <small className="font-monospace text-muted d-block" style={{ fontSize: '0.76rem' }}>* Government application fees are charged strictly as per official portal tariffs. Rate set by HOMline operations desk.</small>
                </div>
                <div className="col-md-4 text-center border-start">
                  {data.qr_code_url && (<><img src={data.qr_code_url} alt="Receipt QR Code" width={95} height={95} className="border p-1 bg-white rounded shadow-sm mb-1" /><small className="d-block text-muted font-monospace" style={{ fontSize: '0.68rem' }}>Scan to Verify Online</small></>)}
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded border border-warning bg-light small text-dark mb-4"><strong>Important Disclaimer:</strong> HOMline DIGI seva provides technical application filing &amp; process guidance. Final approval, eligibility, issuance, and decision authority remain exclusively with the respective official government department or institution.</div>
          <div className="d-flex justify-content-between align-items-end pt-3 border-top">
            <div>
              <small className="text-muted d-block">Support Desk: <strong>6282268453</strong></small>
              <small className="text-muted d-block">Email: <strong>homlinedigital@gmail.com</strong></small>
              <small className="text-muted d-block">Website: <strong>www.amdgmedia.co.in</strong></small>
            </div>
            <div className="text-end"><div className="fw-bold text-navy">HOMline DIGI seva</div><small className="text-muted">A Division Of AMDG MEDIA | Powered By AMDG GROUP</small></div>
          </div>
        </div>
      </div>
    </>
  );
}

export function MembershipCard() {
  const { code } = useParams();
  const { data, error, loading } = useApi<Membership>(`membership/card/${code}/`);
  useTitle(`HOMline Official Membership Card • ${code}`);
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap';
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);
  if (loading) return <Loading />;
  if (error || !data) return <div className="container py-5 text-center text-muted">Membership card not found.</div>;
  const m = data;
  return (
    <>
      <style>{CARD_CSS}</style>
      <div className="d-flex flex-wrap gap-2 justify-content-center mb-4 no-print">
        <button onClick={() => window.print()} className="btn btn-warning px-4 py-2 fw-bold shadow"><i className="bi bi-printer-fill me-2"></i> Print / Download Card (PDF)</button>
        <Link to="/membership" className="btn btn-outline-light px-4 py-2"><i className="bi bi-arrow-left me-1"></i> Back to Membership</Link>
      </div>
      <div className="membership-card-wrap">
        <i className="bi bi-shield-check card-watermark"></i>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 46, height: 46, background: '#0d9488', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'white' }}><i className="bi bi-house-gear-fill"></i></div>
            <div>
              <h4 className="fw-extrabold mb-0 text-white" style={{ letterSpacing: '0.5px' }}>HOMline <span style={{ color: '#2dd4bf' }}>DIGI seva</span></h4>
              <small className="text-warning font-monospace" style={{ fontSize: '0.75rem' }}>A Division Of AMDG MEDIA • Powered By AMDG Group</small>
            </div>
          </div>
          <span className="badge text-dark px-3 py-2 rounded-pill font-monospace fw-bold" style={{ backgroundColor: '#f59e0b' }}>{m.plan || 'OFFICIAL MEMBER'}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="card-chip"></div>
          <div className="membership-code-box">{m.membership_code || 'HOM-MBR-2026-PENDING'}</div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-7">
            <small className="text-white-50 text-uppercase d-block" style={{ fontSize: '0.7rem', letterSpacing: 1 }}>Cardholder Name</small>
            <strong className="text-white fs-5 d-block text-truncate">{m.name}</strong>
            <small style={{ fontSize: '0.85rem', color: '#2dd4bf' }}><i className="bi bi-geo-alt-fill me-1"></i>{m.place || 'Kerala, India'}</small>
          </div>
          <div className="col-5 text-end">
            <small className="text-white-50 text-uppercase d-block" style={{ fontSize: '0.7rem', letterSpacing: 1 }}>Membership Plan</small>
            <span className="text-white fw-bold d-block">{m.plan || 'HOMline Member'}</span>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill font-monospace" style={{ fontSize: '0.7rem' }}>{m.status || 'Active'}</span>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end pt-3 border-top border-secondary border-opacity-50">
          <div>
            <div className="d-flex gap-4 mb-2">
              <div><small className="text-white-50 d-block" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Open Date</small><strong className="text-white font-monospace" style={{ fontSize: '0.85rem' }}>{fmtDate(m.open_date) || 'Active'}</strong></div>
              <div><small className="text-white-50 d-block" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Valid Till</small><strong className="text-warning font-monospace" style={{ fontSize: '0.85rem' }}>{fmtDate(m.valid_till) || '1 Year from Issue'}</strong></div>
            </div>
            <small className="text-white-50 d-block" style={{ fontSize: '0.72rem' }}>Helpline: <strong>6282268453</strong> • www.amdgmedia.co.in</small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="stamp-seal"><i className="bi bi-patch-check-fill" style={{ fontSize: '1rem' }}></i><span>HOMline<br />VERIFIED</span></div>
            {m.qr_code_url && <div className="qr-badge"><img src={m.qr_code_url} alt="Membership QR" width={60} height={60} /></div>}
          </div>
        </div>
      </div>
      <p className="text-center text-white-50 small mt-3 no-print font-monospace"><i className="bi bi-shield-lock-fill text-warning me-1"></i> Official Digital Card issued by HOMline DIGI seva • AMDG Group</p>
    </>
  );
}
