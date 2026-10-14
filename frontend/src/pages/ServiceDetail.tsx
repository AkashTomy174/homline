import { Link, useParams } from 'react-router-dom';
import type { Service } from '../types';
import { Linebreaks, Loading, NotFound, truncate, useApi, useTitle, waLink } from '../lib';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data, error, loading } = useApi<{ service: Service; related: Service[] }>(`services/${slug}/`);
  useTitle(data ? `${data.service.title} — HOMline DIGI seva Assistance` : 'HOMline DIGI seva');
  if (loading) return <Loading />;
  if (error || !data) return <NotFound message="Service not found." />;
  const s = data.service;
  const reqLink = `/request?service_id=${s.id}`;
  return (
    <>
      <section className="service-detail-hero">
        <div className="container py-4 py-lg-5">
          <nav className="service-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><i className="bi bi-chevron-right" aria-hidden="true"></i>
            <Link to="/services">Services</Link><i className="bi bi-chevron-right" aria-hidden="true"></i>
            <span aria-current="page">{s.title}</span>
          </nav>
          <div className="row align-items-end g-4 mt-2">
            <div className="col-lg-8">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="service-detail-category"><i className="bi bi-grid-1x2-fill me-1" aria-hidden="true"></i>{s.category.name}</span>
                {s.badge && <span className="service-detail-badge">{s.badge}</span>}
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="service-detail-icon" aria-hidden="true"><i className={`bi ${s.icon_class}`}></i></div>
                <div>
                  <h1 className="service-detail-title">{s.title}</h1>
                  <p className="service-detail-summary mb-0">{s.short_summary}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to={reqLink} className="btn btn-gold btn-lg fw-bold shadow-sm service-detail-cta"><i className="bi bi-pencil-square me-2" aria-hidden="true"></i>Request this service</Link>
              <div className="service-cta-note"><i className="bi bi-clock me-1" aria-hidden="true"></i>We’ll guide you through the next steps</div>
            </div>
          </div>
        </div>
      </section>

      <section className="service-detail-body py-5">
        <div className="container">
          <div className="row g-4 g-xl-5 align-items-start">
            <div className="col-lg-7">
              <article className="service-content-card mb-4">
                <div className="service-section-heading">
                  <span className="service-section-icon"><i className="bi bi-info-circle-fill" aria-hidden="true"></i></span>
                  <div><span className="service-section-kicker">THE SERVICE</span><h2>Overview</h2></div>
                </div>
                <div className="service-description"><Linebreaks text={s.description} /></div>
              </article>

              <article className="service-content-card mb-4">
                <div className="service-section-heading">
                  <span className="service-section-icon"><i className="bi bi-folder2-open" aria-hidden="true"></i></span>
                  <div><span className="service-section-kicker">BEFORE YOU START</span><h2>Documents to prepare</h2></div>
                </div>
                <p className="service-section-intro">Have these ready before you contact us. Clear scans or photos help us guide you faster.</p>
                <div className="service-document-list"><Linebreaks text={s.required_documents} /></div>
              </article>

              <div className="service-disclaimer mb-4">
                <i className="bi bi-shield-exclamation" aria-hidden="true"></i>
                <div><strong>Service note</strong><p>HOMline provides assistance for supported online services. Availability, processing time, eligibility, approval and final decisions are determined by the relevant authority, institution or third-party provider.</p></div>
              </div>

              {data.related.length > 0 && (
                <section className="related-services" aria-labelledby="relatedServicesTitle">
                  <div className="d-flex justify-content-between align-items-end gap-3 mb-3">
                    <div><span className="service-section-kicker">KEEP EXPLORING</span><h2 id="relatedServicesTitle">Related services</h2></div>
                    <Link className="related-all-link" to="/services">All services <i className="bi bi-arrow-right" aria-hidden="true"></i></Link>
                  </div>
                  <div className="row g-3">
                    {data.related.map((rel) => (
                      <div className="col-md-4" key={rel.id}>
                        <Link className="related-service-card" to={`/services/${rel.slug}`}>
                          <span className="related-service-icon"><i className={`bi ${rel.icon_class}`} aria-hidden="true"></i></span>
                          <strong>{rel.title}</strong>
                          <span>{truncate(rel.short_summary, 76)}</span>
                          <i className="bi bi-arrow-up-right related-card-arrow" aria-hidden="true"></i>
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="col-lg-5" aria-label="Service cost and contact details">
              <div className="service-detail-sidebar">
                <section className="service-cost-card mb-4" aria-labelledby="costHeading">
                  <div className="service-cost-heading"><span className="service-cost-icon"><i className="bi bi-receipt-cutoff" aria-hidden="true"></i></span><div><span className="service-section-kicker">COST &amp; TIMING</span><h2 id="costHeading">At a glance</h2></div></div>
                  <div className="service-price-row">
                    <div><span className="service-price-label">HOMline assistance charge</span><span className="service-price-value">{s.homline_charge}</span></div>
                    <i className="bi bi-person-workspace" aria-hidden="true"></i>
                  </div>
                  <div className="service-fee-row"><span><i className="bi bi-building me-2" aria-hidden="true"></i>Government / portal fee</span><strong>{s.third_party_fee}</strong></div>
                  <p className="service-fee-note">Third-party fees are paid directly or according to the portal’s rules.</p>
                  <div className="service-time-row"><i className="bi bi-hourglass-split" aria-hidden="true"></i><span><small>Estimated processing time</small><strong>{s.processing_time}</strong></span></div>
                  <div className="service-cost-actions">
                    <Link to={reqLink} className="btn btn-teal btn-lg w-100"><i className="bi bi-send me-2" aria-hidden="true"></i>Request assistance</Link>
                    <a href={waLink(`Hi HOMline, I want to ask about ${s.title}`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success w-100"><i className="bi bi-whatsapp me-2" aria-hidden="true"></i>Ask on WhatsApp</a>
                    <a href="tel:6282268453" className="service-phone-link"><i className="bi bi-telephone me-1" aria-hidden="true"></i>Call 6282268453</a>
                  </div>
                </section>

                <section className="service-steps-card" aria-labelledby="stepsHeading">
                  <h2 id="stepsHeading"><i className="bi bi-signpost-split me-2" aria-hidden="true"></i>What happens next</h2>
                  <ol>
                    <li><span>1</span><div><strong>Contact our team</strong><small>Tell us what you need help with.</small></div></li>
                    <li><span>2</span><div><strong>Share the details</strong><small>We’ll confirm the required documents.</small></div></li>
                    <li><span>3</span><div><strong>Get guided support</strong><small>Follow progress and receive updates.</small></div></li>
                  </ol>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
