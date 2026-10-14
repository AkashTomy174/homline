import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { UpdateItem } from '../types';
import { fmtDate, Linebreaks, Loading, NotFound, useApi, useTitle, waLink } from '../lib';

const TAGS: [string, string][] = [['all', 'All Updates'], ['Service Update', 'Service Updates'], ['Important Notice', 'Important Notices'], ['Service Availability Update', 'Availability Updates']];

export function UpdatesList() {
  useTitle('Latest Updates, Notices & Announcements • HOMline DIGI seva');
  const [params] = useSearchParams();
  const tag = params.get('tag') ?? 'all';
  const { data, loading } = useApi<{ updates: UpdateItem[] }>(`updates/${tag !== 'all' ? `?tag=${encodeURIComponent(tag)}` : ''}`);
  return (
    <>
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-2">
          <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">Announcements &amp; Notices</span>
          <h1 className="display-5 fw-extrabold text-white mb-3">Latest HOMline Updates</h1>
          <p className="lead text-white-50 max-width-700 mx-auto mb-0">Stay informed with service availability updates, new digital services, holiday hours &amp; official notices.</p>
        </div>
      </section>
      <section className="py-5 bg-soft-mist">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            {TAGS.map(([value, label]) => (
              <Link key={value} to={value === 'all' ? '/updates' : `/updates?tag=${encodeURIComponent(value)}`} className={`btn ${tag === value ? 'btn-navy' : 'btn-outline-navy bg-white'} rounded-pill px-4`}>{label}</Link>
            ))}
          </div>
          {loading && !data ? <Loading /> : (
            <div className="row g-4">
              {data?.updates.map((u) => (
                <div className="col-lg-4 col-md-6" key={u.id}>
                  <div className="homline-card bg-white d-flex flex-column justify-content-between h-100">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="update-tag tag-service-update">{u.category_tag}</span>
                        <small className="text-muted font-monospace">{fmtDate(u.published_at)}</small>
                      </div>
                      <h5 className="fw-bold text-navy mb-2">{u.title}</h5>
                      <p className="text-muted small mb-3">{u.summary}</p>
                    </div>
                    <Link to={`/updates/${u.slug}`} className="btn btn-outline-navy btn-sm mt-3">Read Full Notice →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function UpdateDetail() {
  const { slug } = useParams();
  const { data, error, loading } = useApi<{ update: UpdateItem; recent: UpdateItem[] }>(`updates/${slug}/`);
  useTitle(data ? `${data.update.title} • HOMline Updates` : 'HOMline Updates');
  if (loading) return <Loading />;
  if (error || !data) return <NotFound message="Update not found." />;
  const u = data.update;
  return (
    <>
      <section className="py-5 bg-navy text-white">
        <div className="container">
          <div className="max-width-800 mx-auto text-center">
            <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
              <span className="badge bg-gold text-dark px-3 py-1 rounded-pill font-monospace fw-bold">{u.category_tag}</span>
              <span className="text-white-50 font-monospace small"><i className="bi bi-calendar3 me-1"></i> {fmtDate(u.published_at, true)}</span>
            </div>
            <h1 className="display-6 fw-extrabold text-white mb-3">{u.title}</h1>
            <p className="lead text-white-50 mb-0">{u.summary}</p>
          </div>
        </div>
      </section>
      <section className="py-5 bg-soft-mist">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="homline-card bg-white p-4 p-md-5 mb-4">
                <div className="lead text-dark" style={{ fontSize: '1.1rem', lineHeight: 1.8 }}><Linebreaks text={u.content} /></div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Link to="/updates" className="btn btn-outline-navy">← Back to All Updates</Link>
                <a href={waLink(`Hi HOMline, I have a question about: "${u.title}"`)} target="_blank" rel="noreferrer" className="btn btn-whatsapp"><i className="bi bi-whatsapp me-1"></i> Enquire on WhatsApp</a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="homline-card bg-white">
                <h5 className="fw-bold text-navy mb-3">Recent Notices &amp; Updates</h5>
                <div className="d-flex flex-column gap-3">
                  {data.recent.map((r) => (
                    <div className="border-bottom pb-2" key={r.id}>
                      <span className="update-tag tag-service-update mb-1 d-inline-block">{r.category_tag}</span>
                      <h6 className="fw-bold mb-1"><Link to={`/updates/${r.slug}`} className="text-navy text-decoration-none">{r.title}</Link></h6>
                      <small className="text-muted font-monospace d-block">{fmtDate(r.published_at)}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
