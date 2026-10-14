import { Link, useParams } from 'react-router-dom';
import { useTitle } from '../lib';

// Static, trusted copy (moved from the old Django view).
const POLICIES: Record<string, { title: string; html: string }> = {
  terms: {
    title: 'Terms & Conditions',
    html: `<h3>1. Introduction</h3>
<p>Welcome to HOMline DIGI seva ("HOMline"). By accessing or using our services, website, and support channels (Call, WhatsApp, Email), you agree to comply with and be bound by these Terms & Conditions.</p>
<h3>2. Nature of Service</h3>
<p>HOMline DIGI seva is an independent digital service assistance platform that guides and assists users with online form submissions, portal registrations, documentation, and digital application processes. <strong>HOMline is NOT a government agency or official department.</strong></p>
<h3>3. Service Disclaimer & Decision Authority</h3>
<p>HOMline provides technical and operational assistance for supported online applications. Final approval, eligibility determination, issuance, timelines, and legal validity of any document or service remain exclusively with the respective official government authority, educational institution, or third-party service provider.</p>`,
  },
  privacy: {
    title: 'Privacy Policy',
    html: `<h3>1. Data Collection</h3>
<p>HOMline DIGI seva collects personal details such as name, contact number, email address, and uploaded documents strictly for fulfilling your requested online service.</p>
<h3>2. Data Confidentiality</h3>
<p>We treat all customer documents and sensitive information with high confidentiality and appropriate security measures.</p>`,
  },
  refund: {
    title: 'Refund Policy',
    html: `<h3>1. Service Charge Refund</h3>
<p>HOMline service fees cover assistance and processing work. If a request is cancelled before processing has initiated, a refund may be granted.</p>`,
  },
  cancellation: {
    title: 'Cancellation Policy',
    html: `<h3>1. Request Cancellation</h3>
<p>Customers can request cancellation by calling 6282268453 or via WhatsApp before application submission.</p>`,
  },
  'data-protection': {
    title: 'Data Protection & Confidentiality',
    html: `<h3>1. Security Practices</h3>
<p>HOMline employs encrypted digital transmission and verified support staff for identity protection.</p>`,
  },
  disclaimer: {
    title: 'Service Disclaimer',
    html: `<div class="alert alert-warning p-4 rounded-3">
<h5 class="fw-bold mb-2"><i class="bi bi-exclamation-triangle-fill me-2"></i>Official Notice & Disclaimer</h5>
<p class="mb-0">HOMline DIGI seva provides digital assistance and guidance for supported online services. Availability, processing time, eligibility, approval and final decisions are determined solely by the respective government authority, board, institution or third-party service provider.</p>
</div>`,
  },
};

export default function Policy() {
  const { name = 'disclaimer' } = useParams();
  const p = POLICIES[name] ?? POLICIES.disclaimer;
  useTitle(`${p.title} • HOMline DIGI seva Policies`);
  return (
    <>
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-2">
          <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">Legal &amp; Governance</span>
          <h1 className="display-5 fw-extrabold text-white mb-3">{p.title}</h1>
          <p className="lead text-white-50 max-width-700 mx-auto mb-0">HOMline DIGI seva operates under clear transparency, data confidentiality, and customer policy guidelines.</p>
        </div>
      </section>
      <section className="py-5 bg-soft-mist">
        <div className="container">
          <div className="max-width-800 mx-auto">
            <div className="homline-card bg-white p-4 p-md-5 shadow-sm mb-4">
              <div className="policy-content" dangerouslySetInnerHTML={{ __html: p.html }} />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/" className="btn btn-outline-navy">← Return to Home</Link>
              <a href="tel:6282268453" className="btn btn-navy">Contact HOMline Policy Support</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
