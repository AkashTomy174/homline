import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Category, Service } from '../types';
import { Linebreaks, Loading, useApi, useTitle, waLink } from '../lib';

const WA_SERVICES = [
  'Ticket Bookings (Train, Flight, Bus)', 'Design Posters', 'Website Designs', 'DTP & Typing Works', 'Laminations', 'Frame Works',
  'PAN Card Application', 'Passport Appointment', 'Voter ID Card', 'Other Custom Service',
];

function ServiceCard({ s }: { s: Service }) {
  const preselect = () => {
    const sel = document.getElementById('rq-service') as HTMLSelectElement | null;
    if (sel) sel.value = String(s.id);
  };
  return (
    <article className="service-directory-card service-card-animated h-100">
      <div className="service-card-top">
        <div className="service-directory-icon"><i className={`bi ${s.icon_class}`}></i></div>
        {s.badge && <span className="badge bg-gold text-dark rounded-pill">{s.badge}</span>}
      </div>
      <span className="service-category-label">{s.category.name}</span>
      <h2 className="h5 fw-bold text-navy mt-2 mb-2">{s.title}</h2>
      <p className="text-muted small service-summary">{s.short_summary}</p>
      <div className="service-card-meta">
        <div><span>HOMline assistance</span><strong>{s.homline_charge}</strong></div>
        <div><span>Official / portal fee</span><strong>{s.third_party_fee}</strong></div>
        <div><span>Estimated processing</span><strong><i className="bi bi-clock me-1"></i>{s.processing_time}</strong></div>
      </div>
      {s.required_documents && (
        <details className="service-documents">
          <summary><i className="bi bi-clipboard-check me-1"></i> What to prepare <i className="bi bi-chevron-down details-chevron"></i></summary>
          <div className="service-documents-content">{s.required_documents.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</div>
        </details>
      )}
      <div className="service-card-actions">
        <Link to={`/services/${s.slug}`} className="btn btn-outline-navy">Details</Link>
        <button type="button" className="btn btn-teal" data-bs-toggle="modal" data-bs-target="#requestModal" onClick={preselect}>
          <i className="bi bi-send me-1"></i> Request help
        </button>
      </div>
    </article>
  );
}

function WhatsAppEnquiry() {
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const notes = String(f.get('notes') ?? '').trim();
    const msg = `Hi HOMline, I have a service enquiry.\n\n*Name:* ${String(f.get('name')).trim()}\n*Phone:* ${String(f.get('phone')).trim()}\n*Service:* ${f.get('service')}\n*Details:* ${notes || 'Need more guidance'}`;
    window.open(waLink(msg), '_blank');
  };
  return (
    <div className="homline-card bg-white p-4 p-md-5 mt-5 shadow-sm border border-teal-subtle rounded-4">
      <div className="row align-items-center g-4">
        <div className="col-lg-5">
          <span className="badge bg-gold text-dark font-monospace fw-bold mb-2">INSTANT ENQUIRY</span>
          <h3 className="fw-bold text-navy mb-2">Can't Find Your Service or Need Immediate Help?</h3>
          <p className="text-muted mb-4">Send your service enquiry directly to our WhatsApp assistance team. We handle custom typing, registrations, ticket booking, poster design, DTP, laminations, and framing.</p>
          <div className="d-flex flex-column gap-2 text-muted small">
            <div><i className="bi bi-check2-circle text-teal me-2"></i> Instant caseworker response on WhatsApp</div>
            <div><i className="bi bi-check2-circle text-teal me-2"></i> Transparent nominal service charges</div>
            <div><i className="bi bi-check2-circle text-teal me-2"></i> Zero travel required from your home</div>
          </div>
        </div>
        <div className="col-lg-7">
          <form className="p-3 bg-soft-mist rounded-4 border" onSubmit={send}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold text-navy small" htmlFor="waName">Your Full Name *</label>
                <input id="waName" name="name" className="form-control" placeholder="Enter full name" required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-navy small" htmlFor="waPhone">WhatsApp Number *</label>
                <input id="waPhone" name="phone" type="tel" className="form-control" placeholder="Mobile / WhatsApp" required />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-navy small" htmlFor="waService">Service Interested In *</label>
                <select id="waService" name="service" className="form-select">{WA_SERVICES.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-navy small" htmlFor="waNotes">Specific Notes / Requirement Details</label>
                <textarea id="waNotes" name="notes" className="form-control" rows={2} placeholder="Briefly describe what you need..." />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-whatsapp btn-lg px-4 fw-bold"><i className="bi bi-whatsapp me-2"></i> Connect to WhatsApp Desk →</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ServicesList() {
  useTitle('Explore Digital Services | HOMline DIGI seva');
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [sort, setSort] = useState('default');
  const input = useRef<HTMLInputElement>(null);
  const { data, loading } = useApi<{ categories: Category[]; services: Service[] }>(
    `services/${category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''}`);

  useEffect(() => setQuery(params.get('q') ?? ''), [params]);

  // "/" focuses search, Escape clears it (as before)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName ?? '';
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) { e.preventDefault(); input.current?.focus(); }
      if (e.key === 'Escape' && document.activeElement === input.current) { setQuery(''); input.current?.blur(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = (data?.services ?? []).filter((s) => !q || `${s.title} ${s.short_summary} ${s.category.name}`.toLowerCase().includes(q));
    if (sort !== 'default') list = [...list].sort((a, b) => a.title.localeCompare(b.title) * (sort === 'name-desc' ? -1 : 1));
    return list;
  }, [data, query, sort]);

  const catLink = (slug: string) => {
    const p = new URLSearchParams();
    if (slug !== 'all') p.set('category', slug);
    if (query) p.set('q', query);
    const s = p.toString();
    return `/services${s ? `?${s}` : ''}`;
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(params);
    if (query) p.set('q', query); else p.delete('q');
    setParams(p);
  };

  return (
    <>
      <section className="services-hero py-5 text-white">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-gold text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-3">Service Directory</span>
              <h1 className="display-5 fw-extrabold text-white mb-3">Find the help you need.</h1>
              <p className="lead text-white-50 mb-0">Search services, compare key details and request assistance when you’re ready.</p>
            </div>
            <div className="col-lg-5">
              <form className="services-search" role="search" onSubmit={submit}>
                <label className="visually-hidden" htmlFor="serviceSearch">Search services</label>
                <i className="bi bi-search" aria-hidden="true"></i>
                <input id="serviceSearch" ref={input} type="search" name="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try PAN, passport or exam…" autoComplete="off" />
                {query && <button type="button" className="services-search-clear border-0 bg-transparent" aria-label="Clear search" onClick={() => setQuery('')}><i className="bi bi-x-circle-fill"></i></button>}
                <button className="btn btn-teal" type="submit">Search</button>
                <span className="services-shortcut" aria-hidden="true">/</span>
              </form>
              <div className="services-suggestions" aria-label="Popular searches">
                <span>Popular:</span>
                {[['PAN', 'PAN'], ['Passport', 'Passport'], ['Exam', 'Exams'], ['MSME', 'MSME']].map(([q, label]) => (
                  <button key={q} type="button" className="service-search-chip" onClick={() => { setQuery(q); input.current?.focus(); }}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-directory py-5">
        <div className="container">
          <div className="services-toolbar">
            <div className="services-categories" aria-label="Filter services by category">
              <Link to={catLink('all')} className={`service-category-filter ${category === 'all' ? 'active' : ''}`}><i className="bi bi-grid-3x3-gap-fill"></i> All services</Link>
              {data?.categories.map((c) => (
                <Link key={c.id} to={catLink(c.slug)} className={`service-category-filter ${category === c.slug ? 'active' : ''}`}><i className={`bi ${c.icon_class}`}></i> {c.name}</Link>
              ))}
            </div>
            <div className="services-controls">
              <span className="services-result-count" aria-live="polite">{shown.length} {shown.length === 1 ? 'service' : 'services'}</span>
              <label htmlFor="serviceSort" className="visually-hidden">Sort services</label>
              <select id="serviceSort" className="form-select form-select-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="default">Sort: Recommended</option>
                <option value="name">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          <div className="services-disclaimer">
            <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
            <p><strong>Good to know:</strong> HOMline provides application guidance and submission support. Eligibility, processing times and final decisions are set by the relevant authority.</p>
          </div>

          {loading && !data ? <Loading /> : (
            <div className="row g-4">
              {shown.map((s) => <div className="col-lg-4 col-md-6 service-result" key={s.id}><ServiceCard s={s} /></div>)}
            </div>
          )}

          <WhatsAppEnquiry />

          {data && shown.length === 0 && (
            <div className="services-empty-state mt-4">
              <i className="bi bi-search-heart"></i>
              <h2 className="h4 fw-bold text-navy">No matches in this view</h2>
              <p className="text-muted">Try a different keyword or clear your search.</p>
              <button type="button" className="btn btn-teal" onClick={() => { setQuery(''); input.current?.focus(); }}>Clear search</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
