import { Link } from 'react-router-dom';
import { useTitle } from '../lib';

export default function HowItWorks() {
  useTitle('How HOMline Works • 4-Step Animated Customer Flow');
  return (
    <>
<section className="py-5 bg-navy text-white text-center">
  <div className="container py-3">
    <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">Customer Journey</span>
    <h1 className="display-5 fw-extrabold text-white mb-3">
      How <span className="text-gradient-teal">HOMline Works</span>
    </h1>
    <p className="lead text-white-50 max-width-700 mx-auto mb-0">
      Simple, guided, and convenient 4-step digital flow. No travel, no crowded cyber cafe queues, zero frustration.
    </p>
  </div>
</section>

<section className="py-5 bg-white">
  <div className="container">
    
    <div className="how-steps-timeline mb-5">
      
      <div className="how-step-card service-card-animated">
        <div className="how-step-number-badge">01</div>
        <div className="brand-icon-box bg-navy text-white mb-3" style={{ width: "52px", height: "52px", fontSize: "1.4rem" }}>
          <i className="bi bi-ui-checks-grid text-cyan"></i>
        </div>
        <h4 className="fw-bold text-navy mb-2">Choose Your Service</h4>
        <p className="text-muted small flex-grow-1">
          Browse our catalog of 14+ services including PAN Card, Passport appointments, Voter ID, Exam forms, Ticket Bookings, Poster Designs, Website Creation, DTP, or Laminations.
        </p>
        <div className="pt-2 border-top">
          <span className="badge bg-light text-navy border font-monospace small"><i className="bi bi-eye me-1"></i> Transparent Fees</span>
        </div>
      </div>

      <div className="how-flow-arrow">
        <i className="bi bi-arrow-right"></i>
      </div>

      
      <div className="how-step-card service-card-animated">
        <div className="how-step-number-badge" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>02</div>
        <div className="brand-icon-box bg-success text-white mb-3" style={{ width: "52px", height: "52px", fontSize: "1.4rem" }}>
          <i className="bi bi-whatsapp"></i>
        </div>
        <h4 className="fw-bold text-navy mb-2">Connect with Caseworker</h4>
        <p className="text-muted small flex-grow-1">
          Call HOMline helpline at <strong>6282268453</strong> or send a message on WhatsApp. Senior citizens and PwD applicants can request dedicated voice guidance or doorstep desk support.
        </p>
        <div className="pt-2 border-top">
          <span className="badge bg-success-subtle text-success border border-success-subtle font-monospace small"><i className="bi bi-lightning-charge me-1"></i> Rapid Response</span>
        </div>
      </div>

      <div className="how-flow-arrow">
        <i className="bi bi-arrow-right"></i>
      </div>

      
      <div className="how-step-card service-card-animated">
        <div className="how-step-number-badge" style={{ background: "linear-gradient(135deg, #06b6d4, #0284c7)" }}>03</div>
        <div className="brand-icon-box bg-teal text-white mb-3" style={{ width: "52px", height: "52px", fontSize: "1.4rem" }}>
          <i className="bi bi-shield-check"></i>
        </div>
        <h4 className="fw-bold text-navy mb-2">Submit & Verification</h4>
        <p className="text-muted small flex-grow-1">
          Send your basic details or document photos securely. Our team verifies eligibility, formats photos/signatures to exact portal KB specifications, and prevents application rejection.
        </p>
        <div className="pt-2 border-top">
          <span className="badge bg-info-subtle text-info-emphasis border font-monospace small"><i className="bi bi-lock-fill me-1"></i> Strict Privacy</span>
        </div>
      </div>

      <div className="how-flow-arrow">
        <i className="bi bi-arrow-right"></i>
      </div>

      
      <div className="how-step-card service-card-animated">
        <div className="how-step-number-badge" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>04</div>
        <div className="brand-icon-box bg-gold text-dark mb-3" style={{ width: "52px", height: "52px", fontSize: "1.4rem" }}>
          <i className="bi bi-qr-code-scan"></i>
        </div>
        <h4 className="fw-bold text-navy mb-2">Track & Delivery</h4>
        <p className="text-muted small flex-grow-1">
          Get your instant Reference ID with QR Code. Track progress in real-time, download your official acknowledgement receipt, and receive confirmation updates directly to your WhatsApp.
        </p>
        <div className="pt-2 border-top">
          <span className="badge bg-warning-subtle text-dark border font-monospace small"><i className="bi bi-file-earmark-pdf me-1"></i> PDF Receipt</span>
        </div>
      </div>
    </div>

    
    <div className="homline-card bg-soft-mist p-4 p-md-5 mb-5 border-start border-4 border-indigo">
      <div className="row align-items-center g-4">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-indigo text-white font-monospace" style={{ backgroundColor: "#6366f1 !important" }}>SPECIAL ASSISTANCE</span>
            <strong className="text-navy">Disability & Senior Citizen Priority Flow</strong>
          </div>
          <p className="text-muted mb-0">
            Cannot travel to government offices or have difficulty reading portal forms? HOMline offers tailored support including audio calls, caregiver guidance, and doorstep representative visits across our serviceable zones.
          </p>
        </div>
        <div className="col-lg-4 text-lg-end">
          <button type="button" className="btn btn-navy" data-bs-toggle="modal" data-bs-target="#pwdModal">
            <i className="bi bi-universal-access me-1"></i> Open PwD Desk
          </button>
        </div>
      </div>
    </div>

    
    <div className="homline-card bg-navy text-white p-4 p-md-5 rounded-4 shadow-lg text-center">
      <div className="max-width-700 mx-auto">
        <h3 className="fw-extrabold text-white mb-2">Ready to Start Your Digital Service?</h3>
        <p className="text-white-50 mb-4">
          Connect with our operations caseworkers right now. No appointment needed.
        </p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <a href="https://wa.me/916282268453?text=Hi%20HOMline,%20I%20want%20to%20start%20a%20service." target="_blank" className="btn btn-whatsapp btn-lg px-4">
            <i className="bi bi-whatsapp me-2"></i> WhatsApp 6282268453
          </a>
          <a href="tel:6282268453" className="btn btn-outline-light btn-lg px-4">
            <i className="bi bi-telephone-fill me-2"></i> Call Support
          </a>
          <Link to="/services" className="btn btn-teal btn-lg px-4">
            <i className="bi bi-grid-fill me-2"></i> Browse Directory
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
    </>
  );
}
