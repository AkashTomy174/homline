import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTitle } from '../lib';

function printArea(id: string, title: string) {
  const html = document.getElementById(id)?.innerHTML ?? '';
  const w = window.open('', '', 'height=750,width=950');
  if (!w) return;
  w.document.write(`<html><head><title>${title}</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"><style>body{padding:30px; font-family:system-ui, sans-serif;} @media print{body{padding:0;}}</style></head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
}

export default function About() {
  useTitle('About HOMline • DIGI seva • Purpose, Vision & Ventures');
  useEffect(() => {
    const details = document.getElementById('amdgGroupDetails');
    const btn = document.getElementById('amdgToggleBtn');
    if (!details || !btn) return;
    const more = () => { btn.innerHTML = '<i class="bi bi-chevron-up me-1"></i> View Less'; };
    const less = () => { btn.innerHTML = '<i class="bi bi-chevron-down me-1"></i> View More'; };
    details.addEventListener('show.bs.collapse', more);
    details.addEventListener('hide.bs.collapse', less);
    return () => { details.removeEventListener('show.bs.collapse', more); details.removeEventListener('hide.bs.collapse', less); };
  }, []);
  return (
    <>
<section id="intro" className="about-hero bg-navy text-white text-center position-relative overflow-hidden">
  <div className="position-absolute top-0 start-0 w-100 h-100 bg-radial-glow opacity-20 pointer-events-none"></div>
  <div className="container py-4 position-relative z-1">
    <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 px-3 py-1 rounded-pill mb-3">
      <span className="badge bg-gold text-dark font-monospace text-uppercase fw-bold">About Us</span>
      <span className="small text-white-75">AMDG MEDIA Initiative</span>
    </div>

    
    <h1 className="display-3 fw-extrabold text-white mb-2 tracking-tight">
      <span className="title-letter-animated">H</span><span className="title-letter-animated">O</span><span className="title-letter-animated">M</span><span className="title-letter-animated text-teal">line</span>
    </h1>

    
    <div className="d-inline-flex flex-wrap align-items-center justify-content-center gap-2 gap-md-3 bg-teal bg-opacity-25 border border-teal text-teal-light px-4 py-2 rounded-pill mb-4 shadow-sm">
      <span className="fw-bold text-white"><i className="bi bi-shield-check text-gold me-1"></i> DIGI seva</span>
      <span className="opacity-50">•</span>
      <span>Digital Services at Doorstep</span>
      <span className="opacity-50">•</span>
      <span className="text-white-50">Powered by AMDG Group</span>
    </div>

    <p className="lead text-white-75 max-width-800 mx-auto mb-4 fs-5">
      "All Internet Service at your fingertip, Designed to Easy Access and Reduce Travel."
    </p>

    
    <div className="d-flex flex-wrap justify-content-center gap-3">
      <button className="btn btn-gold text-dark fw-bold px-4 rounded-pill shadow-sm" data-bs-toggle="modal" data-bs-target="#eBrochureModal">
        <i className="bi bi-file-earmark-pdf-fill me-2 text-danger"></i> View e-Service Brochure (PDF)
      </button>
      <button className="btn btn-outline-light px-4 rounded-pill" data-bs-toggle="modal" data-bs-target="#founderStoryModal">
        <i className="bi bi-person-heart me-2 text-teal"></i> Founder’s Story & Motivation
      </button>
      <a href="#futurePlansSection" className="btn btn-outline-light px-4 rounded-pill">
        <i className="bi bi-compass-fill me-2"></i> Future Plans (Kerala & India)
      </a>
      <Link to="/services" className="btn btn-teal text-white px-4 rounded-pill">
        <i className="bi bi-grid-fill me-2"></i> Explore Services
      </Link>
    </div>
  </div>
</section>



<nav className="page-jump" aria-label="On this page">
  <div className="container">
    <ul>
      <li><a href="#intro">What is HOMline</a></li>
      <li><a href="#social-innovation">Social innovation</a></li>
      <li><a href="#beneficiaries">Who benefits</a></li>
      <li><a href="#vision-mission">Vision & mission</a></li>
      <li><a href="#futurePlansSection">Future plans</a></li>
      <li><a href="#founderMotivationSection">Founder</a></li>
      <li><a href="#amdg">AMDG Group</a></li>
    </ul>
  </div>
</nav>


<section id="social-innovation" className="py-5 bg-white">
  <div className="container py-3">
    
    <div className="row align-items-center g-5 mb-5 pb-4 border-bottom">
      <div className="col-lg-6">
        <span className="badge bg-teal text-white px-3 py-1 rounded-pill font-monospace mb-2">Introduction</span>
        <h2 className="display-6 fw-extrabold text-navy mb-3">What is HOMline?</h2>
        <p className="text-secondary lead fs-6 mb-3">
          <strong>HOMline</strong> is a digital assistance initiative focused on making eligible online services more accessible, convenient and human-centred.
        </p>
        <p className="text-muted mb-3">
          Inspired by the principles of social inclusion, dignity and accessibility, HOMline seeks to bridge the gap between people and increasingly digital service systems by providing convenient assistance from wherever they are. Beginning as an online-first initiative, HOMline aims to grow into a network of accessible service points across Kerala and eventually expand its reach across India.
        </p>
        <p className="text-muted mb-4">
          Whether it is applying for revenue certificates, registering for public service commission exams, updating Aadhaar/Voter IDs, booking travel tickets, or creating creative print media & DTP documents, HOMline acts as your personal digital assistant. You submit your requirements from home via WhatsApp or phone, and our dedicated team completes the process with verified receipts and instant live tracking.
        </p>
        <div className="p-3 bg-soft-mist rounded-4 border-start border-4 border-teal shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <div className="brand-icon-box bg-teal text-white flex-shrink-0" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-universal-access fs-4"></i>
            </div>
            <div>
              <h6 className="fw-bold text-navy mb-1">Disability-Friendly Tag & Guarantee</h6>
              <p className="text-muted small mb-0">“Accessible digital empowerment for all abilities — no travel required.” Dedicated door-desk and voice support for Persons with Disabilities (PwD) and elderly citizens.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="homline-card bg-navy text-white p-4 p-md-5 position-relative overflow-hidden shadow-lg rounded-4">
          <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold mb-3">The Core Idea</span>
          <h3 className="fw-bold text-white mb-3">HOMline e-Service Hub</h3>
          <p className="text-white-75 mb-4">
            <em>"A service is truly accessible only when people can realistically reach, understand and use it."</em>
          </p>
          <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
            <li className="d-flex align-items-start gap-3">
              <i className="bi bi-check-circle-fill text-gold fs-5 mt-1"></i>
              <div>
                <strong>Zero Unnecessary Travel:</strong>
                <p className="text-white-75 small mb-0">Say goodbye to standing in hot queues at distant centers. We handle the submission for you.</p>
              </div>
            </li>
            <li className="d-flex align-items-start gap-3">
              <i className="bi bi-check-circle-fill text-teal fs-5 mt-1"></i>
              <div>
                <strong>Separate & Transparent Pricing:</strong>
                <p className="text-white-75 small mb-0">Clear breakdown between official government portal fees and our modest doorstep service charge.</p>
              </div>
            </li>
            <li className="d-flex align-items-start gap-3">
              <i className="bi bi-check-circle-fill text-gold fs-5 mt-1"></i>
              <div>
                <strong>Strict Privacy & Document Safety:</strong>
                <p className="text-white-75 small mb-0">Identity documents and personal records are encrypted and protected under strict operational standards.</p>
              </div>
            </li>
            <li className="d-flex align-items-start gap-3">
              <i className="bi bi-check-circle-fill text-teal fs-5 mt-1"></i>
              <div>
                <strong>Live QR Receipts & Status Tracking:</strong>
                <p className="text-white-75 small mb-0">Instant printable receipts with scannable verification QR codes for every completed request.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    
    <div className="my-5">
      <div className="text-center max-width-800 mx-auto mb-5">
        <span className="badge bg-navy text-white px-3 py-1 rounded-pill font-monospace mb-2">Pain Points Solved</span>
        <h2 className="display-6 fw-extrabold text-navy">Why to Choose HOMline?</h2>
        <p className="text-muted fs-6">
          While government and online services are expanding rapidly, millions of people continue to face everyday hurdles when trying to access them:
        </p>
      </div>

      
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-danger text-danger mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-signpost-split fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">1. Distance & Travel Barrier</h6>
            <p className="text-muted small mb-0">Citizens in villages and semi-urban communities must travel kilometers just to find an operational internet cafe or facilitation kiosk.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-gold text-dark mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-hourglass-split fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">2. Long Waiting Times & Queues</h6>
            <p className="text-muted small mb-0">Hours lost in crowded waiting rooms and queues, often with server failures or printer issues after waiting all day.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-teal text-teal mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-file-earmark-break fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">3. Unclear Requirements</h6>
            <p className="text-muted small mb-0">Missing photocopies or incorrect certificate types force people to make multiple exhausting trips back and forth.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-navy text-navy mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-laptop-fill fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">4. Complex Portal Procedures</h6>
            <p className="text-muted small mb-0">Multi-step online workflows, tricky document compression guidelines, and time-sensitive captcha screens cause confusion.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-info text-info mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-translate fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">5. Language & Digital Literacy Barriers</h6>
            <p className="text-muted small mb-0">Many portals lack clear local language guidance, making self-application stressful for seniors and non-technical citizens.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-danger text-danger mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">6. Fear of Costly Mistakes</h6>
            <p className="text-muted small mb-0">A spelling error in a name or wrong category selection can lead to rejected exam applications or cancelled government grants.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-gold text-dark mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-cash-stack fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">7. Unpredictable or Hidden Charges</h6>
            <p className="text-muted small mb-0">Local kiosks often inflate pricing arbitrarily without providing receipts or clarifying actual government portal fees.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-teal text-teal mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-person-wheelchair fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">8. Difficulties for PwDs & Elderly</h6>
            <p className="text-muted small mb-0">Citizens with reduced mobility or health conditions suffer immensely when forced to climb steep staircases to reach cafes.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="homline-card p-4 h-100 border border-light-subtle bg-white shadow-sm hover-elevate rounded-4">
            <div className="brand-icon-box bg-soft-navy text-navy mb-3" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-briefcase-fill fs-5"></i>
            </div>
            <h6 className="fw-bold text-navy mb-2">9. Loss of Working Hours & Wages</h6>
            <p className="text-muted small mb-0">Daily-wage earners and busy professionals lose valuable income just to take a day off to complete an essential online form.</p>
          </div>
        </div>
      </div>

      
      <div className="p-4 p-md-5 bg-navy text-white rounded-4 shadow-sm text-center">
        <h4 className="fw-bold text-gold mb-2">The HOMline Solution</h4>
        <p className="lead text-white-75 max-width-700 mx-auto mb-3 fs-6">
          HOMline bridges every one of these hurdles by bringing reliable digital assistance, document guidance, and verified execution right to your home via WhatsApp, Phone, and door-desk support.
        </p>
        <span className="badge bg-teal text-white px-3 py-2 rounded-pill font-monospace">From digital services to human assistance - bringing services closer to people.</span>
      </div>
    </div>
  </div>
</section>


<section className="py-5 bg-soft-mist">
  <div className="container py-3">
    <div className="text-center max-width-800 mx-auto mb-5">
      <span className="badge bg-teal text-white px-3 py-1 rounded-pill font-monospace mb-2">Brochure Section</span>
      <h2 className="display-6 fw-extrabold text-navy">The Social Innovation Behind HOMline</h2>
      <p className="text-muted">HOMline combines Social Work, Technology, Creativity and Accessibility into 7 core pillars:</p>
    </div>

    <div className="row g-4">
      <div className="col-md-6 col-lg-4">
        <div className="homline-card p-4 h-100 bg-white border rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon-box bg-teal text-white" style={{ width: "42px", height: "42px" }}><i className="bi bi-globe"></i></div>
            <h6 className="fw-bold text-navy mb-0">1. Accessible Digital Governance</h6>
          </div>
          <p className="text-muted small mb-0">Bridges the gap between ordinary citizens and complex government portals by providing reliable guidance from home.</p>
        </div>
      </div>

      <div className="col-md-6 col-lg-4">
        <div className="homline-card p-4 h-100 bg-white border rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon-box bg-navy text-white" style={{ width: "42px", height: "42px" }}><i className="bi bi-universal-access"></i></div>
            <h6 className="fw-bold text-navy mb-0">2. Inclusion for Vulnerable Groups</h6>
          </div>
          <p className="text-muted small mb-0">Dedicated support for Persons with Disabilities (PwD), senior citizens, and bedridden individuals who cannot travel.</p>
        </div>
      </div>

      <div className="col-md-6 col-lg-4">
        <div className="homline-card p-4 h-100 bg-white border rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon-box bg-gold text-dark" style={{ width: "42px", height: "42px" }}><i className="bi bi-piggy-bank-fill"></i></div>
            <h6 className="fw-bold text-navy mb-0">3. Time & Cost Savings</h6>
          </div>
          <p className="text-muted small mb-0">Eliminates travel expenses, bus fares, auto fares, and loss of daily wages by managing digital applications remotely.</p>
        </div>
      </div>

      <div className="col-md-6 col-lg-4">
        <div className="homline-card p-4 h-100 bg-white border rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon-box bg-teal text-white" style={{ width: "42px", height: "42px" }}><i className="bi bi-shield-check"></i></div>
            <h6 className="fw-bold text-navy mb-0">4. Error Prevention</h6>
          </div>
          <p className="text-muted small mb-0">Trained team carefully checks document requirements, photo sizes, and fields to prevent application rejections.</p>
        </div>
      </div>

      <div className="col-md-6 col-lg-4">
        <div className="homline-card p-4 h-100 bg-white border rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon-box bg-navy text-white" style={{ width: "42px", height: "42px" }}><i className="bi bi-heart-fill"></i></div>
            <h6 className="fw-bold text-navy mb-0">5. Dignity and Comfort</h6>
          </div>
          <p className="text-muted small mb-0">Ensures people access their entitled public rights and services with dignity, without waiting in long, stressful queues.</p>
        </div>
      </div>

      <div className="col-md-6 col-lg-4">
        <div className="homline-card p-4 h-100 bg-white border rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon-box bg-gold text-dark" style={{ width: "42px", height: "42px" }}><i className="bi bi-receipt-cutoff"></i></div>
            <h6 className="fw-bold text-navy mb-0">6. High Trust & Transparency</h6>
          </div>
          <p className="text-muted small mb-0">Clear itemized breakdown between official portal fees and our modest service charge, accompanied by live QR verification.</p>
        </div>
      </div>

      <div className="col-md-12">
        <div className="homline-card p-4 bg-navy text-white border rounded-4 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="brand-icon-box bg-gold text-dark flex-shrink-0" style={{ width: "48px", height: "48px" }}><i className="bi bi-collection-play-fill fs-5"></i></div>
            <div>
              <h6 className="fw-bold text-gold mb-1">7. Comprehensive Support Ecosystem</h6>
              <p className="text-white-75 small mb-0">Combines citizen applications with ticket bookings (bus, rail, air), creative media (poster design, website designs), DTP typing, laminations, and framing under AMDG Media.</p>
            </div>
          </div>
          <Link to="/services" className="btn btn-teal text-white rounded-pill px-4 flex-shrink-0">Explore All Services →</Link>
        </div>
      </div>
    </div>
  </div>
</section>


<section id="beneficiaries" className="py-5 bg-white">
  <div className="container py-3">
    <div className="text-center max-width-800 mx-auto mb-5">
      <span className="badge bg-teal text-white px-3 py-1 rounded-pill font-monospace mb-2">Audience Breakdown</span>
      <h2 className="display-6 fw-extrabold text-navy">Who Can Benefit from HOMline?</h2>
      <p className="text-muted">Featured in the official HOMline Digital e-Service Brochure for diverse community segments:</p>
    </div>

    <div className="row g-4">
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate">
          <div className="brand-icon-box bg-teal text-white mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-person-arms-up"></i></div>
          <h5 className="fw-bold text-navy mb-2">1. Senior Citizens</h5>
          <p className="text-muted small mb-0">Elderly individuals who face travel difficulties, mobility issues, or struggle with smartphone and computer screens can easily complete pension life certificates and health services.</p>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate border-teal">
          <div className="brand-icon-box bg-navy text-white mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-universal-access"></i></div>
          <h5 className="fw-bold text-navy mb-2">2. Persons with Disabilities (PwDs)</h5>
          <p className="text-muted small mb-0">Doorstep and remote digital assistance specifically designed to eliminate the physical challenge of accessing distant internet centers and stairs.</p>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate">
          <div className="brand-icon-box bg-gold text-dark mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-mortarboard-fill"></i></div>
          <h5 className="fw-bold text-navy mb-2">3. Students & Aspirants</h5>
          <p className="text-muted small mb-0">Assistance with exam applications (PSC, SSC, UPSC), university admissions, scholarship registrations, and hall ticket downloads without last-minute deadline anxiety.</p>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate">
          <div className="brand-icon-box bg-teal text-white mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-clock-history"></i></div>
          <h5 className="fw-bold text-navy mb-2">4. Daily Wage Earners & Workers</h5>
          <p className="text-muted small mb-0">Citizens who would otherwise have to sacrifice a day’s wages and travel costs just to submit a single official application in town.</p>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate">
          <div className="brand-icon-box bg-navy text-white mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-house-heart-fill"></i></div>
          <h5 className="fw-bold text-navy mb-2">5. Homemakers & Families</h5>
          <p className="text-muted small mb-0">Families managing home responsibilities can conveniently apply for certificates, ration card corrections, and utility bill updates from home.</p>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate">
          <div className="brand-icon-box bg-gold text-dark mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-geo-alt-fill"></i></div>
          <h5 className="fw-bold text-navy mb-2">6. Rural & Remote Communities</h5>
          <p className="text-muted small mb-0">People residing in remote areas where internet cafes, digital print facilities, or trained technical assistance are not readily available.</p>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate">
          <div className="brand-icon-box bg-teal text-white mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-shop"></i></div>
          <h5 className="fw-bold text-navy mb-2">7. Small Business Owners</h5>
          <p className="text-muted small mb-0">Shopkeepers and small entrepreneurs needing commercial licenses, GST filings, promotional event posters, DTP documentation, and business framing.</p>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate">
          <div className="brand-icon-box bg-navy text-white mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-airplane-fill"></i></div>
          <h5 className="fw-bold text-navy mb-2">8. Non-Resident Keralites (NRKs)</h5>
          <p className="text-muted small mb-0">Overseas Keralites needing reliable support to process applications, certificates, property documents, or travel bookings for their elderly parents at home.</p>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4">
        <div className="p-4 rounded-4 border bg-soft-mist h-100 hover-elevate">
          <div className="brand-icon-box bg-gold text-dark mb-3" style={{ width: "46px", height: "46px" }}><i className="bi bi-shield-check"></i></div>
          <h5 className="fw-bold text-navy mb-2">9. Anyone Seeking Hassle-Free Support</h5>
          <p className="text-muted small mb-0">Individuals who prefer to save valuable time and avoid long queues by letting trained digital professionals handle the formalities accurately.</p>
        </div>
      </div>
    </div>
  </div>
</section>


<section id="vision-mission" className="py-5 bg-navy text-white">
  <div className="container py-3">
    <div className="row g-5 align-items-center mb-5">
      <div className="col-lg-6">
        <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold mb-2">Vision for Kerala</span>
        <h3 className="display-6 fw-bold text-white mb-3">Our Vision & Mission</h3>
        <p className="text-white-75 lead fs-6 mb-3">
          To build an accessible and compassionate bridge between everyday citizens and digital governance — transforming Kerala into a state where no one is excluded from public services due to physical distance or technical unfamiliarity.
        </p>
        <div className="p-3 bg-white bg-opacity-10 border border-white border-opacity-15 rounded-4 mb-4">
          <h6 className="text-gold fw-bold mb-1"><i className="bi bi-quote fs-5 align-middle me-1"></i> Core Purpose</h6>
          <p className="text-white-75 small mb-0">
            HOMline is not just about completing forms. It is about making the digital world easier to access.
          </p>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-15">
          <h5 className="fw-bold text-teal mb-3"><i className="bi bi-list-check me-2"></i> 10 Mission Objectives:</h5>
          <div className="row g-2 small text-white-75">
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>1. Eliminate physical travel barriers to essential public and commercial services</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>2. Provide dedicated priority assistance for PwD and senior citizens</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>3. Maintain absolute fee transparency with itemized receipts</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>4. Safeguard citizen data and privacy with secure practices</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>5. Enable hassle-free WhatsApp & phone-based service dispatch</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>6. Bridge digital literacy barriers with empathetic human guidance</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>7. Support students and job seekers with error-free application processing</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>8. Integrate creative media, ticketing, and print solutions under one banner</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>9. Expand accessible service hubs from local communities across Kerala</span>
            </div>
            <div className="col-12 d-flex align-items-start gap-2">
              <i className="bi bi-check2 text-gold mt-1"></i> <span>10. Build a national Digital Assistance Ecosystem connecting people to digital rights</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div className="pt-4 border-top border-white border-opacity-15">
      <div className="text-center mb-4">
        <h4 className="fw-bold text-white mb-1">HOMline's 5-Step Assisted Approach</h4>
        <p className="text-white-50 small">A transparent and reliable flow from request to verified receipt</p>
      </div>

      <div className="row g-3">
        <div className="col-md">
          <div className="p-3 bg-white bg-opacity-10 border border-white border-opacity-15 rounded-3 text-center h-100">
            <span className="badge bg-gold text-dark mb-2">Step 1</span>
            <h6 className="fw-bold text-white mb-1">Need Identified</h6>
            <p className="text-white-50 small mb-0">Customer reaches out via WhatsApp, phone, or web form with their requirement.</p>
          </div>
        </div>
        <div className="col-md">
          <div className="p-3 bg-white bg-opacity-10 border border-white border-opacity-15 rounded-3 text-center h-100">
            <span className="badge bg-teal text-white mb-2">Step 2</span>
            <h6 className="fw-bold text-white mb-1">Clear Guidance</h6>
            <p className="text-white-50 small mb-0">Team explains exact checklist, eligible categories, and itemized fees upfront.</p>
          </div>
        </div>
        <div className="col-md">
          <div className="p-3 bg-white bg-opacity-10 border border-white border-opacity-15 rounded-3 text-center h-100">
            <span className="badge bg-gold text-dark mb-2">Step 3</span>
            <h6 className="fw-bold text-white mb-1">Document Collection</h6>
            <p className="text-white-50 small mb-0">Safe digital submission via WhatsApp or doorstep pickup for PwD / elders.</p>
          </div>
        </div>
        <div className="col-md">
          <div className="p-3 bg-white bg-opacity-10 border border-white border-opacity-15 rounded-3 text-center h-100">
            <span className="badge bg-teal text-white mb-2">Step 4</span>
            <h6 className="fw-bold text-white mb-1">Accurate Processing</h6>
            <p className="text-white-50 small mb-0">Trained operator verifies data and executes submission on official portals.</p>
          </div>
        </div>
        <div className="col-md">
          <div className="p-3 bg-white bg-opacity-10 border border-white border-opacity-15 rounded-3 text-center h-100">
            <span className="badge bg-gold text-dark mb-2">Step 5</span>
            <h6 className="fw-bold text-white mb-1">Receipt & QR Status</h6>
            <p className="text-white-50 small mb-0">Instant delivery of acknowledgment slips, receipts, and live QR tracking code.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="py-5 bg-white" id="futurePlansSection">
  <div className="container py-3">
    <div className="text-center max-width-800 mx-auto mb-5">
      <div className="d-inline-flex align-items-center gap-2 mb-2">
        <span className="badge bg-teal text-white px-3 py-1 rounded-pill font-monospace">Strategic Roadmap</span>
        <span className="badge bg-soft-gold text-dark border small fw-bold">Official Brochure Blueprint</span>
      </div>
      <h2 className="display-6 fw-extrabold text-navy">FUTURE PLANS</h2>
      <p className="text-muted">A clear, phased progression designed to scale from local doorstep assistance to a nationwide digital support network.</p>
    </div>

    <div className="row g-4 mb-5">
      
      <div className="col-lg-6">
        <div className="homline-card p-4 p-md-5 h-100 border border-teal rounded-4 shadow-sm bg-white position-relative overflow-hidden">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="badge bg-teal text-white px-3 py-1 rounded-pill font-monospace fw-bold">PHASE 1</span>
            <span className="badge bg-soft-teal text-teal border border-teal small"><i className="bi bi-check-circle-fill me-1"></i> Active Now</span>
          </div>
          <h4 className="fw-bold text-navy mb-3"><i className="bi bi-phone-fill text-teal me-2"></i> DIGITAL HOMLINE</h4>
          <p className="text-muted mb-3">
            The foundation of the project begins as an <strong>online-first assisted platform</strong> where customers can request services remotely through accessible digital channels.
          </p>
          <div className="p-3 bg-soft-mist rounded-3 mb-3">
            <h6 className="fw-bold text-navy small mb-2">Phase 1 Key Features:</h6>
            <ul className="text-muted small mb-0 ps-3">
              <li>Assistance coordinated via WhatsApp, phone and online communication</li>
              <li>Customer requests received, verified and processed remotely</li>
              <li>Status tracking and updates delivered directly to the customer</li>
              <li>Focus on building trust, refining workflows and expanding service capabilities</li>
            </ul>
          </div>
          <div className="badge bg-soft-teal text-teal p-2 rounded-2 w-100 text-center small font-monospace">
            Online-First • WhatsApp Desk • Remote Coordination • Instant QR
          </div>
        </div>
      </div>

      
      <div className="col-lg-6">
        <div className="homline-card p-4 p-md-5 h-100 border border-gold rounded-4 shadow-sm bg-white position-relative overflow-hidden">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold">PHASE 2</span>
            <span className="badge bg-soft-gold text-dark border small fw-bold"><i className="bi bi-clock-history me-1"></i> Upcoming</span>
          </div>
          <h4 className="fw-bold text-navy mb-3"><i className="bi bi-geo-alt-fill text-gold me-2"></i> LOCAL HOMLINE SERVICE POINTS</h4>
          <p className="text-muted mb-3">
            To serve individuals who prefer in-person interaction or require direct document assistance, HOMline plans to introduce <strong>physical community touchpoints</strong>.
          </p>
          <div className="p-3 bg-soft-mist rounded-3 mb-3">
            <h6 className="fw-bold text-navy small mb-2">Phase 2 Key Features:</h6>
            <ul className="text-muted small mb-0 ps-3">
              <li>Accessible service counters operating in local neighborhoods</li>
              <li>Assistance for senior citizens, PwDs, and non-technical customers</li>
              <li>Document scanning, verification and submission guidance</li>
              <li>A hybrid model combining online convenience with physical accessibility</li>
            </ul>
          </div>
          <div className="badge bg-soft-gold text-dark p-2 rounded-2 w-100 text-center small font-monospace">
            Physical Touchpoints • Neighborhood Counters • Document Desks
          </div>
        </div>
      </div>

      
      <div className="col-lg-6">
        <div className="homline-card p-4 p-md-5 h-100 border border-navy rounded-4 shadow-sm bg-white position-relative overflow-hidden">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="badge bg-navy text-white px-3 py-1 rounded-pill font-monospace fw-bold">PHASE 3</span>
            <span className="badge bg-soft-navy text-navy border small fw-bold"><i className="bi bi-map-fill me-1"></i> Kerala Roadmap</span>
          </div>
          <h4 className="fw-bold text-navy mb-3"><i className="bi bi-diagram-3-fill text-navy me-2"></i> HOMLINE ACROSS KERALA</h4>
          <p className="text-muted mb-3">
            The long-term Kerala vision is to establish a network of HOMline service points across different districts and communities.
          </p>
          
          
          <div className="p-3 bg-navy text-white rounded-3 mb-3 shadow-sm">
            <div className="small text-gold fw-bold mb-1">Gradual Expansion Pathway:</div>
            <div className="d-flex flex-wrap align-items-center gap-1 font-monospace small fw-bold">
              <span className="badge bg-white text-navy">Local Community</span>
              <span className="text-gold">→</span>
              <span className="badge bg-white text-navy">Panchayat</span>
              <span className="text-gold">→</span>
              <span className="badge bg-white text-navy">Municipality</span>
              <span className="text-gold">→</span>
              <span className="badge bg-white text-navy">District</span>
              <span className="text-gold">→</span>
              <span className="badge bg-gold text-dark">Kerala</span>
            </div>
          </div>

          <p className="text-muted small mb-0">
            <strong>The objective:</strong> Not simply to create more offices, but to create a consistent and trusted HOMline service experience wherever a customer accesses the network.
          </p>
        </div>
      </div>

      
      <div className="col-lg-6">
        <div className="homline-card p-4 p-md-5 h-100 border border-primary rounded-4 shadow-sm bg-white position-relative overflow-hidden">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="badge bg-primary text-white px-3 py-1 rounded-pill font-monospace fw-bold">PHASE 4</span>
            <span className="badge bg-soft-primary text-primary border small fw-bold"><i className="bi bi-globe-americas me-1"></i> National Ambition</span>
          </div>
          <h4 className="fw-bold text-navy mb-3"><i className="bi bi-flag-fill text-primary me-2"></i> EXPANSION ACROSS INDIA</h4>
          <p className="text-muted mb-3">
            Once the Kerala model is established, HOMline can explore expansion beyond Kerala.
          </p>

          
          <div className="p-3 bg-soft-primary rounded-3 mb-3 border border-primary border-opacity-25">
            <div className="small text-primary fw-bold mb-1">Long-Term National Roadmap:</div>
            <div className="d-flex align-items-center gap-2 font-monospace fs-6 fw-bold">
              <span className="badge bg-teal text-white">Kerala</span>
              <span className="text-primary">→</span>
              <span className="badge bg-navy text-white">South India</span>
              <span className="text-primary">→</span>
              <span className="badge bg-primary text-white">India</span>
            </div>
          </div>

          <p className="text-muted small mb-2">
            This expansion will adapt the model to different states, languages, portals, regulations, and local service requirements.
          </p>
          <div className="alert alert-light border small text-navy fw-semibold mb-0">
            <i className="bi bi-stars text-gold me-1"></i> <strong>The ultimate ambition:</strong> Develop HOMline into a national digital assistance network that connects people with eligible digital services wherever they are.
          </div>
        </div>
      </div>
    </div>

    
    <div className="p-4 p-md-5 bg-navy text-white rounded-4 shadow-lg border border-teal">
      <div className="row align-items-center g-4">
        <div className="col-lg-5">
          <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold mb-2">Ecosystem Model</span>
          <h3 className="display-6 fw-extrabold text-white mb-3">THE BIGGER VISION</h3>
          <p className="lead text-white-75 fs-6 mb-3">
            HOMline can eventually grow beyond individual online applications into a broader <strong>Digital Assistance Ecosystem</strong>.
          </p>
          <div className="p-3 bg-white bg-opacity-10 border border-teal rounded-3 mb-3">
            <p className="fst-italic text-gold mb-1 small">
              "HOMline is not just about completing forms. It is about making the digital world easier to access."
            </p>
            <small className="text-white-50">— The Larger Purpose</small>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="row g-3">
            
            <div className="col-sm-6">
              <div className="p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-person-badge-fill text-gold"></i>
                  <h6 className="text-white fw-bold mb-0">Citizen Digital Assistance</h6>
                </div>
                <p className="text-white-50 small mb-0">Online applications • registrations • certificates • public-service assistance</p>
              </div>
            </div>

            
            <div className="col-sm-6">
              <div className="p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-universal-access text-teal"></i>
                  <h6 className="text-white fw-bold mb-0">Accessibility Support</h6>
                </div>
                <p className="text-white-50 small mb-0">Remote assistance • senior citizen support • disability-friendly service delivery</p>
              </div>
            </div>

            
            <div className="col-sm-6">
              <div className="p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-mortarboard-fill text-gold"></i>
                  <h6 className="text-white fw-bold mb-0">Education Assistance</h6>
                </div>
                <p className="text-white-50 small mb-0">Student applications • admissions • examinations • scholarships</p>
              </div>
            </div>

            
            <div className="col-sm-6">
              <div className="p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-briefcase-fill text-teal"></i>
                  <h6 className="text-white fw-bold mb-0">Business Assistance</h6>
                </div>
                <p className="text-white-50 small mb-0">Digital registrations • documentation • online procedures</p>
              </div>
            </div>

            
            <div className="col-sm-6">
              <div className="p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-laptop text-gold"></i>
                  <h6 className="text-white fw-bold mb-0">Digital Literacy</h6>
                </div>
                <p className="text-white-50 small mb-0">Helping people understand and confidently use digital services</p>
              </div>
            </div>

            
            <div className="col-sm-6">
              <div className="p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-pin-map-fill text-teal"></i>
                  <h6 className="text-white fw-bold mb-0">Local Service Network</h6>
                </div>
                <p className="text-white-50 small mb-0">HOMline-branded service points operated through trained personnel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="py-5 bg-soft-mist" id="founderMotivationSection">
  <div className="container py-3">
    <div className="text-center max-width-800 mx-auto mb-5">
      <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold mb-2">Social Origin</span>
      <h2 className="display-6 fw-extrabold text-navy">FOUNDER’S MOTIVATION</h2>
      <p className="text-muted">How Social Work, AMDG Group, and YUVA Manass inspired the creation of HOMline.</p>
    </div>

    <div className="row g-5 align-items-center">
      
      <div className="col-lg-5">
        <div className="founder-photo-card p-3 bg-white rounded-4 shadow-lg border border-gold border-opacity-50 text-center position-relative">
          <div className="founder-image-wrapper rounded-4 overflow-hidden mb-3 bg-navy position-relative" style={{ minHeight: "420px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            <img src="/static/images/founder.jpg" alt="HOMline Founder" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/static/images/founder-placeholder.svg"; }} className="img-fluid rounded-4 w-100 h-100 object-fit-cover shadow-sm" style={{ maxHeight: "440px" }} />
            <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white text-start">
              <span className="badge bg-gold text-dark fw-bold mb-1">Founder & Social Innovator</span>
              <h5 className="fw-bold mb-0 d-inline-flex align-items-center gap-2">
                Founder of HOMline
                <i className="bi bi-patch-check-fill text-info" style={{ color: "#38bdf8 !important", fontSize: "1.15rem" }} title="Verified Profile"></i>
              </h5>
              <small className="text-white-75">AMDG Group • AMDG Media • YUVA Manass</small>
            </div>
          </div>

          <div className="p-2">
            <span className="badge bg-soft-teal text-teal border border-teal small px-3 py-1 rounded-pill font-monospace">
              Social Work + Technology + Creativity + Accessibility
            </span>
            <p className="text-navy small fw-semibold mt-2 mb-0">
              <i className="bi bi-patch-check-fill text-gold me-1"></i> Dedicated to Doorstep Dignity, Citizen Inclusion & Social Innovation.
            </p>
          </div>
        </div>
      </div>

      
      <div className="col-lg-7">
        <div className="p-4 p-md-5 bg-white rounded-4 border shadow-sm">
          <div className="d-inline-flex align-items-center gap-2 mb-3">
            <span className="badge bg-navy text-white px-3 py-1 rounded-pill font-monospace">Academic & Field Foundation</span>
            <span className="badge bg-soft-teal text-teal border small">Social Work Discipline</span>
          </div>

          <h3 className="fw-bold text-navy mb-3">Bridging Human Needs and Technology</h3>

          <p className="text-muted lead fs-6 mb-3">
            <strong>Social work emphasizes understanding people, identifying barriers, promoting inclusion and working towards greater dignity and participation.</strong>
          </p>

          <div className="p-3 bg-soft-mist rounded-4 border-start border-4 border-gold mb-3">
            <p className="fw-bold text-navy mb-0">
              <em>Those principles helped shape the central idea behind HOMline:</em><br />
              <span className="text-teal fs-5">“A service is truly accessible only when people can realistically reach, understand and use it.”</span>
            </p>
          </div>

          <p className="text-muted mb-3">
            The founder's experience in building <strong>AMDG Group / AMDG Media</strong> has further contributed a foundation in technology, creativity and digital communication, while involvement in social initiatives such as <strong>YUVA Manass</strong> has strengthened the belief that meaningful innovation begins by understanding real human needs.
          </p>

          <div className="p-3 bg-navy text-white rounded-4 mb-3">
            <div className="text-center font-monospace fw-bold text-gold fs-6 mb-1">HOMline therefore represents an effort to bring these areas together:</div>
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 text-white small font-monospace">
              <span className="badge bg-teal">Social Work</span>
              <span>+</span>
              <span className="badge bg-gold text-dark">Technology</span>
              <span>+</span>
              <span className="badge bg-teal">Creativity</span>
              <span>+</span>
              <span className="badge bg-gold text-dark">Accessibility</span>
            </div>
          </div>

          <p className="text-muted small mb-4">
            The founder's background in social work, particularly the learning and experiences gained through academic education, field practicum, community interaction, volunteering and social initiatives, provides an important foundation for HOMline.
          </p>

          <button className="btn btn-navy px-4 rounded-pill shadow-sm" data-bs-toggle="modal" data-bs-target="#founderStoryModal">
            <i className="bi bi-book-half me-2 text-gold"></i> Read Full Founder's Story & Motivation PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</section>


<section id="amdg" className="py-5 bg-navy text-white text-center position-relative overflow-hidden">
  <div className="container py-4 position-relative z-1">
    <div className="max-width-900 mx-auto">
      <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold mb-3">Core Belief & Creed</span>
      <h2 className="display-5 fw-extrabold text-white mb-4">WHAT HOMLINE ULTIMATELY STANDS FOR</h2>

      <p className="lead text-white-75 mb-4 fs-5">
        HOMline stands for the belief that <strong>technology can become a tool for inclusion rather than exclusion</strong>.
      </p>

      
      <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3 mb-5">
        <span className="badge bg-white bg-opacity-10 border border-teal text-teal-light px-3 py-2 rounded-pill fs-6">Easier.</span>
        <span className="badge bg-white bg-opacity-10 border border-gold text-gold px-3 py-2 rounded-pill fs-6">Closer.</span>
        <span className="badge bg-white bg-opacity-10 border border-teal text-teal-light px-3 py-2 rounded-pill fs-6">More convenient.</span>
        <span className="badge bg-white bg-opacity-10 border border-gold text-gold px-3 py-2 rounded-pill fs-6">More understandable.</span>
        <span className="badge bg-white bg-opacity-10 border border-teal text-teal-light px-3 py-2 rounded-pill fs-6">More accessible.</span>
        <span className="badge bg-white bg-opacity-10 border border-gold text-gold px-3 py-2 rounded-pill fs-6">More human.</span>
      </div>

      
      <div className="p-4 p-md-5 bg-white bg-opacity-10 border border-gold rounded-4 shadow-lg mb-5 text-center">
        <i className="bi bi-quote text-gold fs-1 d-block mb-2"></i>
        <h4 className="fw-bold text-white mb-3" style={{ lineHeight: "1.5" }}>
          “No one should be left behind simply because they cannot physically reach a service or navigate technology on their own.”
        </h4>
        <p className="text-white-75 small max-width-700 mx-auto mb-0">
          HOMline is a digital assistance initiative focused on making eligible online services more accessible, convenient and human-centred. Inspired by the principles of social inclusion, dignity and accessibility, HOMline seeks to bridge the gap between people and increasingly digital service systems by providing convenient assistance from wherever they are. Beginning as an online-first initiative, HOMline aims to grow into a network of accessible service points across Kerala and eventually expand its reach across India.
        </p>
      </div>

      <div className="d-inline-flex flex-column align-items-center">
        <h3 className="fw-extrabold text-gold mb-1">HOMline e-Service Hub</h3>
        <h5 className="text-teal mb-2">Connecting Convenience.</h5>
        <p className="text-white-50 mb-0">From digital services to human assistance - bringing services closer to people.</p>
      </div>
    </div>
  </div>
</section>


<section className="py-5 bg-white">
  <div className="container py-3">
    <div className="homline-card bg-navy text-white border border-secondary border-opacity-25 p-4 p-md-5 rounded-4 shadow-lg position-relative">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-white border-opacity-10">
        <div className="d-flex align-items-center gap-3">
          <div className="brand-icon-box bg-gold text-dark flex-shrink-0" style={{ width: "56px", height: "56px", fontSize: "1.8rem" }}>
            <i className="bi bi-building"></i>
          </div>
          <div>
            <span className="badge bg-white text-navy font-monospace fw-bold text-uppercase mb-1">Parent Enterprise</span>
            <h3 className="fw-extrabold text-white mb-0">Brief About AMDG Group</h3>
          </div>
        </div>

        
        <button className="btn btn-outline-gold rounded-pill px-4" type="button" data-bs-toggle="collapse" data-bs-target="#amdgGroupDetails" aria-expanded="false" aria-controls="amdgGroupDetails" id="amdgToggleBtn">
          <i className="bi bi-chevron-down me-1" id="amdgToggleIcon"></i> View More
        </button>
      </div>

      <p className="text-white-75 lead fs-6 mb-3">
        <strong>AMDG Group</strong> is a multidisciplinary organization dedicated to community advancement, digital innovation, media creativity, and premier hospitality experiences. Operating under values of integrity, service excellence, and accessibility, AMDG Group powers HOMline as part of its social-impact digital footprint.
      </p>

      
      <div className="collapse" id="amdgGroupDetails">
        <div className="pt-4 mt-3 border-top border-white border-opacity-10">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-10 h-100">
                <h5 className="fw-bold text-gold mb-2"><i className="bi bi-compass-fill me-2"></i> Our Organizational Vision</h5>
                <p className="text-white-75 small mb-0">
                  To deliver human-centered solutions across communications, tourism, event aesthetics, and digital public governance — ensuring technology and lifestyle services are accessible, transparent, and dignified for every citizen.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-10 h-100">
                <h5 className="fw-bold text-teal me-2"><i className="bi bi-award-fill me-2"></i> Quality Standard</h5>
                <p className="text-white-75 small mb-0">
                  Every project under AMDG Group adheres to strict ethical standards, timely execution, and customer-first support desks equipped with trained professional staff.
                </p>
              </div>
            </div>
          </div>

          
          <h4 className="fw-bold text-white mb-3">Our Ventures:</h4>
          <div className="row g-4">
            
            <div className="col-md-6">
              <div className="p-4 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-20 h-100 transition-hover">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="brand-icon-box bg-teal text-white flex-shrink-0" style={{ width: "48px", height: "48px" }}>
                    <i className="bi bi-brush-fill fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold text-white mb-0">AMDG Media & Designs</h5>
                    <span className="badge bg-gold text-dark small fw-bold">Creative & Branding Wing</span>
                  </div>
                </div>
                <p className="text-white-75 small mb-3">
                  Full-service creative design and multimedia production house providing cutting-edge visual solutions:
                </p>
                <ul className="text-white-75 small mb-3 ps-3">
                  <li>Custom Poster & Banner Design for events and promotions</li>
                  <li>Modern, responsive Website Design & UI development</li>
                  <li>DTP (Desktop Publishing) in Malayalam & English</li>
                  <li>Photo framing, certificate lamination, and print curation</li>
                  <li>Brand identity kits, logos, and digital brochures</li>
                </ul>
                <div className="d-flex gap-2 flex-wrap">
                  <a href="https://www.amdgmedia.co.in/homline" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-gold text-dark fw-bold rounded-pill">
                    <i className="bi bi-box-arrow-up-right me-1"></i> AMDG MEDIA - HOMLINE
                  </a>
                  <a href="https://wa.me/917907077678?text=Hello%20AMDG%20Media%20%26%20Designs,%20I%20would%20like%20to%20enquire%20about%20creative%20services." target="_blank" className="btn btn-sm btn-teal text-white rounded-pill">
                    <i className="bi bi-whatsapp me-1"></i> Connect on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            
            <div className="col-md-6">
              <div className="p-4 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-20 h-100 transition-hover">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="brand-icon-box bg-gold text-dark flex-shrink-0" style={{ width: "48px", height: "48px" }}>
                    <i className="bi bi-stars fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold text-white mb-0">EVARA Tours & Decorations</h5>
                    <span className="badge bg-teal text-white small fw-bold">Hospitality & Event Styling</span>
                  </div>
                </div>
                <p className="text-white-75 small mb-3">
                  Bespoke celebration design and tailor-made travel itineraries crafted for memorable life experiences:
                </p>
                <ul className="text-white-75 small mb-3 ps-3">
                  <li>Stage decor & thematic wedding/party arrangements</li>
                  <li>Floral styling, entrance arches, and ceremonial backdrops</li>
                  <li>Tailored domestic tour packages & pilgrimage expeditions</li>
                  <li>Family getaways, flight & rail bookings with travel desk guidance</li>
                  <li>Corporate event setups and audiovisual management</li>
                </ul>
                <a href="https://wa.me/917907077678?text=Hello%20EVARA%20Tours%20%26%20Decorations,%20I%20would%20like%20to%20enquire%20about%20tours/decorations." target="_blank" className="btn btn-sm btn-gold text-dark fw-bold rounded-pill">
                  <i className="bi bi-whatsapp me-1"></i> Connect with EVARA
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<div className="modal fade" id="eBrochureModal" tabIndex={-1} aria-labelledby="eBrochureModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-xl modal-dialog-scrollable">
    <div className="modal-content border-0 shadow-lg rounded-4">
      <div className="modal-header bg-navy text-white p-4">
        <div className="d-flex align-items-center gap-3">
          <div className="brand-icon-box bg-gold text-dark flex-shrink-0" style={{ width: "44px", height: "44px" }}>
            <i className="bi bi-file-earmark-pdf-fill fs-4 text-danger"></i>
          </div>
          <div>
            <h5 className="modal-title font-brand text-white mb-0" id="eBrochureModalLabel">HOMline Digital e-Service Brochure</h5>
            <small className="text-white-50">Official 5-Page Publication • AMDG Media Division • Connecting Convenience</small>
          </div>
        </div>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      
      <div className="bg-light px-4 pt-3 border-bottom">
        <ul className="nav nav-pills" id="brochureTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active rounded-pill px-4" id="brochure-images-tab" data-bs-toggle="pill" data-bs-target="#brochureImagesPane" type="button" role="tab">
              <i className="bi bi-images me-1"></i> Official Brochure Pages (1 to 5)
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link rounded-pill px-4" id="brochure-text-tab" data-bs-toggle="pill" data-bs-target="#brochureTextPane" type="button" role="tab">
              <i className="bi bi-file-text me-1"></i> Structured Text & Printable PDF
            </button>
          </li>
        </ul>
      </div>

      <div className="modal-body p-4 bg-white">
        <div className="tab-content" id="brochureTabContent">
          
          <div className="tab-pane fade show active" id="brochureImagesPane" role="tabpanel">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
              <span className="small text-muted">Showing 5 High-Resolution Pages of the HOMline Brochure:</span>
              <div className="btn-group btn-group-sm">
                <a href="#brochurePage1" className="btn btn-outline-navy">Page 1</a>
                <a href="#brochurePage2" className="btn btn-outline-navy">Page 2</a>
                <a href="#brochurePage3" className="btn btn-outline-navy">Page 3</a>
                <a href="#brochurePage4" className="btn btn-outline-navy">Page 4</a>
                <a href="#brochurePage5" className="btn btn-outline-navy">Page 5</a>
              </div>
            </div>

            <div className="d-flex flex-column gap-4">
              
              <div className="border rounded-4 p-2 shadow-sm bg-light text-center" id="brochurePage1">
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                  <span className="badge bg-navy text-white">Page 1: Title & Overview</span>
                  <small className="text-muted">HOMline e-Service Hub</small>
                </div>
                <img src="/static/images/brochure/page-1.png" alt="Brochure Page 1" className="img-fluid rounded-3 w-100 shadow-sm" style={{ maxHeight: "850px", objectFit: "contain" }} />
              </div>

              
              <div className="border rounded-4 p-2 shadow-sm bg-light text-center" id="brochurePage2">
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                  <span className="badge bg-navy text-white">Page 2: The Idea & 9 Hurdles</span>
                  <small className="text-muted">Social Innovation Behind HOMline</small>
                </div>
                <img src="/static/images/brochure/page-2.png" alt="Brochure Page 2" className="img-fluid rounded-3 w-100 shadow-sm" style={{ maxHeight: "850px", objectFit: "contain" }} />
              </div>

              
              <div className="border rounded-4 p-2 shadow-sm bg-light text-center" id="brochurePage3">
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                  <span className="badge bg-navy text-white">Page 3: Beneficiaries & Vision / Mission</span>
                  <small className="text-muted">Who Can Benefit & 5-Step Approach</small>
                </div>
                <img src="/static/images/brochure/page-3.png" alt="Brochure Page 3" className="img-fluid rounded-3 w-100 shadow-sm" style={{ maxHeight: "850px", objectFit: "contain" }} />
              </div>

              
              <div className="border rounded-4 p-2 shadow-sm bg-light text-center" id="brochurePage4">
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                  <span className="badge bg-navy text-white">Page 4: Future Plans (Phase 1 to 4)</span>
                  <small className="text-muted">Kerala & India Expansion • Digital Ecosystem</small>
                </div>
                <img src="/static/images/brochure/page-4.png" alt="Brochure Page 4" className="img-fluid rounded-3 w-100 shadow-sm" style={{ maxHeight: "850px", objectFit: "contain" }} />
              </div>

              
              <div className="border rounded-4 p-2 shadow-sm bg-light text-center" id="brochurePage5">
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                  <span className="badge bg-navy text-white">Page 5: Founder's Motivation & Creed</span>
                  <small className="text-muted">Social Work + Tech + Creativity • What HOMline Stands For</small>
                </div>
                <img src="/static/images/brochure/page-5.png" alt="Brochure Page 5" className="img-fluid rounded-3 w-100 shadow-sm" style={{ maxHeight: "850px", objectFit: "contain" }} />
              </div>
            </div>
          </div>

          
          <div className="tab-pane fade" id="brochureTextPane" role="tabpanel">
            <div id="brochurePrintArea" className="p-3 p-md-4">
              <div className="text-center pb-4 mb-4 border-bottom">
                <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold mb-2">Official Brochure</span>
                <h2 className="fw-extrabold text-navy mb-1">HOMline e-Service Hub</h2>
                <p className="text-teal fw-bold mb-1">Connecting Convenience • A Division Of AMDG MEDIA | Powered By AMDG GROUP</p>
                <p className="text-muted small mb-0">"All Internet Service at your fingertip, Designed to Easy Access and Reduce Travel."</p>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold text-navy border-bottom pb-2">1. The Idea Behind The Initiative & The 9 Hurdles</h5>
                <p className="text-muted small">
                  While online government portals are widespread, citizens face: Distance & Travel, Long Queues, Unclear Requirements, Complex Procedures, Language Barriers, Fear of Costly Mistakes, Unpredictable Fees, Mobility Restrictions for PwDs & Elders, and Lost Working Hours. HOMline brings the counter into your home.
                </p>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold text-navy border-bottom pb-2">2. Who Benefits from HOMline?</h5>
                <ul className="text-muted small">
                  <li><strong>Senior Citizens:</strong> Comfortable doorstep assistance for pensions, certificates, and healthcare.</li>
                  <li><strong>Persons with Disabilities (PwDs):</strong> Free priority door-desk assistance to prevent arduous travel.</li>
                  <li><strong>Students & Aspirants:</strong> Error-free submissions for PSC, SSC, UPSC, and hall tickets.</li>
                  <li><strong>Daily Wage Earners & Workers:</strong> Zero loss of daily wages for simple form filling.</li>
                  <li><strong>Homemakers & Families:</strong> Ration card updates, revenue certificates from home.</li>
                  <li><strong>Rural & Remote Communities:</strong> Overcoming geographic isolation from town internet centers.</li>
                  <li><strong>Small Business Owners:</strong> GST, licenses, promotional design posters, DTP, and laminations.</li>
                  <li><strong>Non-Resident Keralites (NRKs):</strong> Supporting elderly parents back home in Kerala.</li>
                </ul>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold text-navy border-bottom pb-2">3. Future Plans: Phased Expansion</h5>
                <ul className="text-muted small">
                  <li><strong>Phase 1: Digital HOMline:</strong> Online-first platform via WhatsApp, Phone, Online comms, status tracking.</li>
                  <li><strong>Phase 2: Local HOMline Service Points:</strong> Physical community touchpoints & neighborhood desks.</li>
                  <li><strong>Phase 3: HOMline Across Kerala:</strong> Local Community → Panchayat → Municipality → District → Kerala.</li>
                  <li><strong>Phase 4: Expansion Across India:</strong> Kerala → South India → India. National digital assistance network.</li>
                </ul>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold text-navy border-bottom pb-2">4. The Bigger Vision: Digital Assistance Ecosystem</h5>
                <p className="text-muted small">
                  Citizen Digital Assistance • Accessibility Support • Education Assistance • Business Assistance • Digital Literacy • Local Service Network.<br />
                  <em>"HOMline is not just about completing forms. It is about making the digital world easier to access."</em>
                </p>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold text-navy border-bottom pb-2">5. Founder's Motivation & Social Work Foundation</h5>
                <p className="text-muted small">
                  Social Work + Technology + Creativity + Accessibility. Inspired by academic education, field practicum, community interaction, volunteering, AMDG Group, and YUVA Manass.<br />
                  <em>“No one should be left behind simply because they cannot physically reach a service or navigate technology on their own.”</em>
                </p>
              </div>

              <div className="p-3 bg-soft-mist rounded-3 text-center border">
                <small className="text-navy d-block fw-bold">HOMline Operations Desk • AMDG MEDIA</small>
                <small className="text-muted d-block">Website: <a href="https://www.amdgmedia.co.in/homline">www.amdgmedia.co.in/homline</a> | Email: homelinedigital@gmail.com | Helpline: +91 62822 68453</small>
                <small className="text-muted">A Division Of AMDG MEDIA | Powered By AMDG GROUP</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer bg-light p-3">
        <button type="button" className="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
        <button onClick={() => printArea("brochurePrintArea", "HOMline e-Service Brochure")} type="button" className="btn btn-navy rounded-pill px-4">
          <i className="bi bi-printer me-1"></i> Print / Save Structured PDF
        </button>
      </div>
    </div>
  </div>
</div>


<div className="modal fade" id="founderStoryModal" tabIndex={-1} aria-labelledby="founderStoryModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg modal-dialog-scrollable">
    <div className="modal-content border-0 shadow-lg rounded-4">
      <div className="modal-header bg-navy text-white p-4">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-book-half text-gold fs-4"></i>
          <div>
            <h5 className="modal-title font-brand mb-0" id="founderStoryModalLabel">HOMline Founder's Story & Motivation</h5>
            <small className="text-white-50">Social Work Foundation • AMDG Group • YUVA Manass</small>
          </div>
        </div>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body p-4 p-md-5 bg-white" id="storyPrintArea">
        <div className="text-center pb-4 mb-4 border-bottom">
          <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold mb-2">Founder’s Motivation</span>
          <h2 className="fw-extrabold text-navy mb-1">FOUNDER’S MOTIVATION</h2>
          <p className="text-teal fw-bold mb-1">Social Work + Technology + Creativity + Accessibility</p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold text-navy mb-2">The Catalyst & Core Philosophy</h5>
          <p className="text-muted">
            Social work emphasizes understanding people, identifying barriers, promoting inclusion and working towards greater dignity and participation.
          </p>
          <div className="p-3 bg-soft-mist rounded-3 border-start border-4 border-teal mb-3">
            <p className="fw-bold text-navy mb-0">
              Those principles helped shape the central idea behind HOMline:<br />
              <span className="text-teal">“A service is truly accessible only when people can realistically reach, understand and use it.”</span>
            </p>
          </div>
          <p className="text-muted">
            The founder's experience in building <strong>AMDG Group / AMDG Media</strong> has further contributed a foundation in technology, creativity and digital communication, while involvement in social initiatives such as <strong>YUVA Manass</strong> has strengthened the belief that meaningful innovation begins by understanding real human needs.
          </p>
          <p className="text-muted">
            HOMline therefore represents an effort to bring these areas together:<br />
            <strong>Social Work + Technology + Creativity + Accessibility</strong>
          </p>
          <p className="text-muted">
            The founder's background in social work, particularly the learning and experiences gained through academic education, field practicum, community interaction, volunteering and social initiatives, provides an important foundation for HOMline.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold text-navy mb-2">WHAT HOMLINE ULTIMATELY STANDS FOR</h5>
          <p className="text-muted">
            HOMline stands for the belief that technology can become a tool for inclusion rather than exclusion.<br />
            It seeks to make the experience of accessing digital services:
          </p>
          <ul className="text-muted">
            <li><strong>Easier.</strong></li>
            <li><strong>Closer.</strong></li>
            <li><strong>More convenient.</strong></li>
            <li><strong>More understandable.</strong></li>
            <li><strong>More accessible.</strong></li>
            <li><strong>More human.</strong></li>
          </ul>
          <div className="p-3 bg-navy text-white rounded-3">
            <h6 className="text-gold fw-bold mb-1">“No one should be left behind simply because they cannot physically reach a service or navigate technology on their own.”</h6>
            <small className="text-white-75 d-block mt-2">
              HOMline is a digital assistance initiative focused on making eligible online services more accessible, convenient and human-centred. Inspired by the principles of social inclusion, dignity and accessibility, HOMline seeks to bridge the gap between people and increasingly digital service systems by providing convenient assistance from wherever they are. Beginning as an online-first initiative, HOMline aims to grow into a network of accessible service points across Kerala and eventually expand its reach across India.
            </small>
            <div className="mt-3 pt-2 border-top border-white border-opacity-15 small text-teal">
              HOMline e-Service Hub • Connecting Convenience • From digital services to human assistance - bringing services closer to people.
            </div>
          </div>
        </div>

        <div className="p-3 bg-soft-mist rounded-3 text-center border">
          <small className="text-muted d-block fw-bold">HOMline Operations Desk • AMDG MEDIA</small>
          <small className="text-muted">[AMDG MEDIA - HOMLINE] (https://www.amdgmedia.co.in/homline) • homelinedigital@gmail.com</small>
          <small className="text-muted d-block mt-1">A Division Of AMDG MEDIA | Powered By AMDG GROUP</small>
        </div>
      </div>
      <div className="modal-footer bg-light p-3">
        <button type="button" className="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
        <button onClick={() => printArea("storyPrintArea", "HOMline Founder Story & Motivation")} type="button" className="btn btn-navy rounded-pill px-4">
          <i className="bi bi-printer me-1"></i> Print / Save Document
        </button>
      </div>
    </div>
  </div>
</div>
    </>
  );
}
