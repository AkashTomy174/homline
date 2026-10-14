import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Faq } from '../types';
import { useApi, useDebounced, useTitle, waLink } from '../lib';

export default function Faqs() {
  useTitle('Frequently Asked Questions (FAQs) • HOMline DIGI seva');
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') ?? 'all';
  const q = params.get('q') ?? '';
  const [text, setText] = useState(q);
  const typed = useDebounced(text.trim());
  useEffect(() => {
    if (typed === q) return;
    const p = new URLSearchParams(params);
    if (typed) p.set('q', typed); else p.delete('q');
    setParams(p, { replace: true });
  }, [typed]);   // eslint-disable-line react-hooks/exhaustive-deps
  const qs = new URLSearchParams();
  if (cat !== 'all') qs.set('cat', cat);
  if (q) qs.set('q', q);
  const { data } = useApi<{ faqs: Faq[]; categories: string[] }>(`faqs/${qs.toString() ? `?${qs}` : ''}`);

  const pill = (active: boolean) => `btn ${active ? 'btn-navy' : 'btn-outline-navy bg-white'} rounded-pill px-4`;

  return (
    <>
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-2">
          <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">Help Center</span>
          <h1 className="display-5 fw-extrabold text-white mb-3">Frequently Asked Questions</h1>
          <p className="lead text-white-50 max-width-700 mx-auto mb-4">Common questions regarding service fees, portal processing, guarantees, cancellations, and document safety.</p>
          <div className="max-width-700 mx-auto">
            <div className="input-group input-group-lg shadow-sm">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input type="search" value={text} onChange={(e) => setText(e.target.value)} className="form-control" placeholder="Search questions (fees, approval, safety)..." aria-label="Search FAQs" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-soft-mist">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            <Link to="/faqs" className={pill(cat === 'all')}>All Questions</Link>
            {data?.categories.map((c) => <Link key={c} to={`/faqs?cat=${encodeURIComponent(c)}`} className={pill(cat === c)}>{c}</Link>)}
          </div>
          <div className="max-width-800 mx-auto">
            {data && data.faqs.length > 0 ? (
              <div className="accordion accordion-custom" id="faqsPageAccordion">
                {data.faqs.map((f) => (
                  <div className="accordion-item mb-3 border-0 rounded-4 shadow-sm overflow-hidden bg-white" key={f.id}>
                    <h2 className="accordion-header" id={`faqHeading${f.id}`}>
                      <button className="accordion-button collapsed fw-bold text-navy py-3" type="button" data-bs-toggle="collapse" data-bs-target={`#faqCollapse${f.id}`} aria-expanded="false" aria-controls={`faqCollapse${f.id}`}>
                        <span className="badge bg-teal text-white me-2 font-monospace" style={{ fontSize: '0.72rem' }}>{f.category}</span>
                        {f.question}
                      </button>
                    </h2>
                    <div id={`faqCollapse${f.id}`} className="accordion-collapse collapse" aria-labelledby={`faqHeading${f.id}`} data-bs-parent="#faqsPageAccordion">
                      <div className="accordion-body text-muted lead bg-white" style={{ fontSize: '1rem' }}>{f.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data ? (
              <div className="text-center py-5">
                <i className="bi bi-question-diamond text-muted display-1"></i>
                <h4 className="text-navy fw-bold mt-3">No Question Matches Found</h4>
                <p className="text-muted">Have a specific question not listed here? Speak directly with our support team.</p>
                <a href={waLink('Hi HOMline, I have a question...')} target="_blank" rel="noreferrer" className="btn btn-whatsapp mt-2">Ask Us on WhatsApp 6282268453</a>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
