import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { api, ApiError, FieldErrors } from '../api';
import { useApp } from '../app';
import { Errors } from '../components/forms';
import { fmtDate, Loading, useApi, useTitle, waLink } from '../lib';
import type { Membership, TrackedRequest, User } from '../types';

type Tab = 'requests' | 'membership' | 'link' | 'settings';
const HASH: Record<string, Tab> = {
  '#requests': 'requests', '#my-requests': 'requests', '#membership': 'membership', '#my-membership': 'membership',
  '#link': 'link', '#link-request': 'link', '#settings': 'settings', '#account-settings': 'settings', '#profile': 'settings',
};

interface DashboardData {
  requests: TrackedRequest[]; memberships: Membership[]; active_membership: Membership | null;
  counts: { total: number; pending: number; processing: number; completed: number };
}

const STATUS: Record<string, [string, string]> = {
  Pending: ['warning', 'bi-hourglass-split'], Processing: ['primary', 'bi-arrow-repeat'], Completed: ['success', 'bi-check-circle-fill'], Rejected: ['danger', 'bi-x-circle-fill'],
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS[status];
  if (!s) return <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill fw-bold">{status}</span>;
  return (
    <span className={`badge bg-${s[0]}-subtle text-${s[0]} border border-${s[0]}-subtle px-3 py-2 rounded-pill fw-bold`}>
      <i className={`bi ${s[1]} me-1`}></i> {status === 'Processing' ? 'In Processing' : status}
    </span>
  );
}

function CopyId({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="btn btn-sm btn-link text-muted p-0" title="Copy Request ID" onClick={() => { navigator.clipboard?.writeText(id); setDone(true); setTimeout(() => setDone(false), 2000); }}>
      <i className={done ? 'bi bi-check text-success' : 'bi bi-copy'}></i>
    </button>
  );
}

/** Small JSON form helper: posts the form fields, reports field errors. */
function useJsonForm(path: string, method: string, onOk: (d: any, form: HTMLFormElement) => void) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const body: Record<string, unknown> = {};
    new FormData(form).forEach((v, k) => { body[k] = v; });
    setBusy(true);
    setErrors({});
    try {
      onOk(await api(path, { method, body }), form);
    } catch (err) {
      setErrors(err instanceof ApiError ? (Object.keys(err.errors).length ? err.errors : { __all__: [err.message] }) : { __all__: ['Unexpected error.'] });
    } finally {
      setBusy(false);
    }
  };
  return { errors, busy, submit };
}

function Stat({ title, icon, tone, value, sub, small }: { title: string; icon: string; tone: string[]; value: string | number; sub: string; small?: boolean }) {
  return (
    <div className="col-6 col-lg-3">
      <div className={`card border-0 shadow-sm rounded-4 h-100 stat-metric-card stat-card-${tone[0]}`}>
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted small fw-bold text-uppercase">{title}</span>
            <div className={`stat-icon-circle ${tone[1]}`}><i className={`bi ${icon}`}></i></div>
          </div>
          {small ? <h4 className="fw-bold mb-0 text-navy text-truncate">{value}</h4> : <h3 className="fw-bold mb-0 text-navy">{value}</h3>}
          <small className="text-muted">{sub}</small>
        </div>
      </div>
    </div>
  );
}

function RequestsTab({ data, goLink }: { data: DashboardData; goLink: () => void }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-header bg-transparent py-3 px-4 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <h5 className="fw-bold mb-0 text-navy"><i className="bi bi-list-stars text-teal me-2"></i>My Service Requests</h5>
          <small className="text-muted">Track the progress of your government &amp; digital application requests in real-time</small>
        </div>
        <Link to="/services" className="btn btn-sm btn-outline-primary rounded-pill fw-bold"><i className="bi bi-plus-lg me-1"></i> Book New Service</Link>
      </div>
      <div className="card-body p-0">
        {data.requests.length ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 dashboard-table">
              <thead className="table-light">
                <tr><th className="ps-4">Request ID</th><th>Service Details</th><th>Applied On</th><th>Fee Details</th><th>Current Status</th><th className="text-end pe-4">Actions</th></tr>
              </thead>
              <tbody>
                {data.requests.map((r) => (
                  <tr key={r.request_id}>
                    <td className="ps-4"><div className="d-flex align-items-center gap-2"><span className="font-monospace fw-bold text-navy request-id-badge">{r.request_id}</span><CopyId id={r.request_id} /></div></td>
                    <td>
                      <div className="fw-bold text-dark">{r.service_title}</div>
                      <small className="text-muted">{r.category ? <><i className="bi bi-folder2 text-teal me-1"></i>{r.category}</> : <><i className="bi bi-shield text-muted me-1"></i>Direct Request</>}</small>
                    </td>
                    <td><div className="text-dark small">{fmtDate(r.created_at)}</div><small className="text-muted">{fmtDate(r.created_at, true).split(', ')[1]}</small></td>
                    <td><div className="small fw-semibold text-dark">Fee: {r.service_charge || '₹150'}</div><small className="text-muted">Govt: {r.portal_fee || 'Direct'}</small></td>
                    <td><StatusPill status={r.status} /></td>
                    <td className="text-end pe-4">
                      <div className="btn-group btn-group-sm">
                        <Link to={`/track/${r.request_id}`} className="btn btn-outline-primary rounded-pill px-3 fw-bold me-1" title="Track Live Status"><i className="bi bi-geo-alt-fill me-1"></i> Track</Link>
                        <Link to={`/receipt/${r.request_id}`} className="btn btn-outline-secondary rounded-pill px-2" title="View Acknowledgement Receipt"><i className="bi bi-receipt"></i></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5 px-3">
            <div className="empty-state-icon mb-3"><i className="bi bi-folder-x text-muted opacity-50" style={{ fontSize: '3.5rem' }}></i></div>
            <h5 className="fw-bold text-navy mb-1">No Applications Yet</h5>
            <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: 450 }}>You have not submitted any service requests under this account. Explore our online service directory or submit your application now.</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link to="/services" className="btn btn-primary rounded-pill px-4 fw-bold"><i className="bi bi-grid-fill me-1"></i> Browse Services</Link>
              <button type="button" className="btn btn-outline-secondary rounded-pill px-3 fw-bold" onClick={goLink}><i className="bi bi-link-45deg me-1"></i> Link Existing Request ID</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const PRIVILEGES: [string, string, string, string][] = [
  ['bi-speedometer2', 'bg-teal-subtle text-teal', 'VIP Priority Processing Desk', 'Applications are prioritized at the top of our daily submission queue for rapid turnaround.'],
  ['bi-house-door-fill', 'bg-primary-subtle text-primary', 'Doorstep Document Assistance', 'Senior citizens, families, and PwD members can request in-person home guidance across service areas.'],
  ['bi-whatsapp', 'bg-success-subtle text-success', 'Dedicated 24/7 WhatsApp Hotline', 'Instant direct updates, PDF delivery, and application receipts sent directly to your phone.'],
  ['bi-percent', 'bg-gold-subtle text-gold', 'Zero Service Fee Surcharges', 'Substantial discounts across all state and central government seva applications.'],
];

function MembershipTab({ m }: { m: Membership | null }) {
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
          <div className="card-header bg-transparent py-3 px-4 border-bottom"><h5 className="fw-bold mb-0 text-navy"><i className="bi bi-person-badge-fill text-gold me-2"></i>Virtual Membership Card</h5></div>
          <div className="card-body p-4">
            {m ? (
              <>
                <div className="membership-virtual-card p-4 rounded-4 mb-4 text-white shadow position-relative overflow-hidden">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div><span className="badge bg-gold text-dark fw-bold px-3 py-1 rounded-pill mb-2">HOMline DIGITAL CARD</span><h4 className="fw-bold mb-0 text-white">{m.plan || 'HOMline Member'}</h4></div>
                    <div className="text-end"><i className="bi bi-shield-fill-check text-gold" style={{ fontSize: '2.2rem' }}></i></div>
                  </div>
                  <div className="mb-4"><small className="text-white-50 d-block text-uppercase font-monospace">Member Name</small><h5 className="fw-bold text-white mb-0">{m.name}</h5></div>
                  <div className="row align-items-end">
                    <div className="col-8"><small className="text-white-50 d-block text-uppercase font-monospace">Membership ID</small><h5 className="font-monospace fw-bold text-gold mb-0 letter-spacing-1">{m.membership_code}</h5></div>
                    <div className="col-4 text-end"><span className="badge bg-success-subtle text-success px-2 py-1 rounded-pill small fw-bold">Active</span></div>
                  </div>
                </div>
                {m.membership_code && (
                  <div className="d-flex flex-wrap gap-2">
                    <Link to={`/membership/card/${m.membership_code}`} className="btn btn-primary rounded-pill px-4 fw-bold"><i className="bi bi-qr-code me-1"></i> Open &amp; Print Digital Card</Link>
                    <Link to={`/membership?check_code=${m.membership_code}#check-membership`} className="btn btn-outline-secondary rounded-pill px-3"><i className="bi bi-shield-check me-1"></i> Verify Card Online</Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-3"><i className="bi bi-person-badge text-gold opacity-50" style={{ fontSize: '3.5rem' }}></i></div>
                <h5 className="fw-bold text-navy mb-2">Join HOMline Family Membership</h5>
                <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: 420 }}>Enjoy unlimited free priority consultations, doorstep document collection, and zero platform service fee surcharges with an annual membership card.</p>
                <Link to="/membership" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"><i className="bi bi-star-fill text-gold me-1"></i> Explore Plans &amp; Apply Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent py-3 px-4 border-bottom"><h5 className="fw-bold mb-0 text-navy"><i className="bi bi-gift-fill text-teal me-2"></i>Membership Privileges</h5></div>
          <div className="card-body p-4">
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
              {PRIVILEGES.map(([icon, tone, title, text]) => (
                <li className="d-flex align-items-start gap-3" key={title}>
                  <div className={`stat-icon-circle ${tone} flex-shrink-0`}><i className={`bi ${icon}`}></i></div>
                  <div><h6 className="fw-bold mb-1 text-navy">{title}</h6><p className="text-muted small mb-0">{text}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkTab({ reload }: { reload: () => void }) {
  const { notify } = useApp();
  const { errors, busy, submit } = useJsonForm('me/link-request/', 'POST', (d, form) => {
    form.reset();
    notify(d.message);
    reload();
  });
  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-transparent py-3 px-4 border-bottom">
            <h5 className="fw-bold mb-0 text-navy"><i className="bi bi-link-45deg text-primary me-2"></i>Link an Existing Request ID</h5>
            <small className="text-muted">Did you book an application over the phone, at our counter, or before registering an account? Link it here to monitor it from your dashboard.</small>
          </div>
          <div className="card-body p-4 p-md-5">
            <form onSubmit={submit}>
              {errors.__all__ && <div className="alert alert-danger py-2 small">{errors.__all__[0]}</div>}
              <div className="mb-4">
                <label className="form-label fw-bold text-navy" htmlFor="linkId">Request Reference Number</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-hash"></i></span>
                  <input id="linkId" name="request_id" className="form-control text-uppercase font-monospace fw-bold" placeholder="Enter Request ID (e.g. HOM-2026-X8F9)" required />
                </div>
                <Errors errors={errors} name="request_id" />
                <div className="form-text mt-2">Example: <code>HOM-2026-X8F9</code>. Found on your SMS acknowledgement, WhatsApp confirmation, or printed slip.</div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={busy}><i className="bi bi-check2-circle me-1"></i> Link Application to Account</button>
                <Link to="/track" className="btn btn-link text-decoration-none text-muted"><i className="bi bi-search me-1"></i> Track without linking</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ user }: { user: User }) {
  const { setUser, notify } = useApp();
  const profile = useJsonForm('auth/me/', 'PATCH', (d) => { setUser(d.user); notify('Your profile information has been updated successfully.'); });
  const pw = useJsonForm('auth/password/', 'POST', (_d, form) => { form.reset(); notify('Your password has been changed successfully.'); });
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent py-3 px-4 border-bottom">
            <h5 className="fw-bold mb-0 text-navy"><i className="bi bi-person-gear text-teal me-2"></i>Profile Information</h5>
            <small className="text-muted">Update your public name and primary contact email</small>
          </div>
          <div className="card-body p-4">
            <form onSubmit={profile.submit}>
              <div className="mb-3"><label className="form-label fw-bold text-navy small" htmlFor="pUser">Username</label><input id="pUser" className="form-control bg-light" value={user.username} disabled /><div className="form-text small">Usernames are fixed and cannot be changed.</div></div>
              <div className="mb-3"><label className="form-label fw-bold text-navy small" htmlFor="pName">Full Name</label><input id="pName" name="first_name" className="form-control" defaultValue={user.first_name} required /><Errors errors={profile.errors} name="first_name" /></div>
              <div className="mb-4"><label className="form-label fw-bold text-navy small" htmlFor="pEmail">Email Address</label><input id="pEmail" name="email" type="email" className="form-control" defaultValue={user.email} required /><Errors errors={profile.errors} name="email" /></div>
              <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={profile.busy}><i className="bi bi-save me-1"></i> Save Profile Details</button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent py-3 px-4 border-bottom">
            <h5 className="fw-bold mb-0 text-navy"><i className="bi bi-shield-lock-fill text-gold me-2"></i>Change Password</h5>
            <small className="text-muted">Ensure your account remains secure with a strong password</small>
          </div>
          <div className="card-body p-4">
            <form onSubmit={pw.submit}>
              <Errors errors={pw.errors} name="__all__" />
              <div className="mb-3"><label className="form-label fw-bold text-navy small" htmlFor="pwOld">Current Password</label><input id="pwOld" type="password" name="old_password" className="form-control" placeholder="Enter current password" autoComplete="current-password" required /><Errors errors={pw.errors} name="old_password" /></div>
              <div className="mb-3"><label className="form-label fw-bold text-navy small" htmlFor="pwNew">New Password</label><input id="pwNew" type="password" name="new_password1" className="form-control" placeholder="Enter new password" autoComplete="new-password" required /><Errors errors={pw.errors} name="new_password1" /></div>
              <div className="mb-4"><label className="form-label fw-bold text-navy small" htmlFor="pwNew2">Confirm New Password</label><input id="pwNew2" type="password" name="new_password2" className="form-control" placeholder="Re-enter new password" autoComplete="new-password" required /><Errors errors={pw.errors} name="new_password2" /></div>
              <button type="submit" className="btn btn-outline-danger rounded-pill px-4 fw-bold" disabled={pw.busy}><i className="bi bi-key-fill me-1"></i> Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  useTitle('User Dashboard - HOMline DIGI seva');
  const { user, ready } = useApp();
  const { hash } = useLocation();
  const [tab, setTab] = useState<Tab>(HASH[hash] ?? 'requests');
  const [version, setVersion] = useState(0);
  const { data, loading } = useApi<DashboardData>(user ? `me/dashboard/?v=${version}` : null);
  useEffect(() => { if (HASH[hash]) setTab(HASH[hash]); }, [hash]);

  if (ready && !user) return <Navigate to="/login?next=/dashboard" replace />;
  if (!user || (loading && !data) || !data) return <Loading />;

  const active = data.active_membership;
  const tabs: [Tab, string, string, number?][] = [
    ['requests', 'bi-card-checklist', 'My Service Requests', data.counts.total], ['membership', 'bi-person-badge', 'My Membership'],
    ['link', 'bi-link-45deg', 'Link Request ID'], ['settings', 'bi-gear-fill', 'Account Settings'],
  ];
  return (
    <section className="py-4 py-lg-5 bg-dashboard-wrapper">
      <div className="container">
        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden dashboard-hero-card">
          <div className="card-body p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <div className="d-flex align-items-center gap-3">
                  <div className="dashboard-avatar-circle"><i className="bi bi-person-fill"></i></div>
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <h2 className="fw-bold mb-0 text-navy">{user.first_name || user.username}</h2>
                      {active ? (
                        <span className="badge bg-gold-gradient text-dark px-3 py-1 rounded-pill fw-bold"><i className="bi bi-star-fill me-1"></i> {active.plan || 'HOMline Member'}</span>
                      ) : (
                        <span className="badge bg-teal-subtle text-teal px-3 py-1 rounded-pill fw-semibold"><i className="bi bi-person-check-fill me-1"></i> Verified Account</span>
                      )}
                    </div>
                    <div className="text-muted small d-flex flex-wrap align-items-center gap-3">
                      <span><i className="bi bi-person-badge text-gold me-1"></i> @{user.username}</span>
                      <span><i className="bi bi-envelope text-teal me-1"></i> {user.email || 'No email registered'}</span>
                      <span><i className="bi bi-calendar-check text-info me-1"></i> Member since {fmtDate(user.date_joined).slice(3)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end">
                <div className="d-flex flex-wrap justify-content-lg-end gap-2">
                  <Link to="/services" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"><i className="bi bi-plus-circle me-1"></i> Apply for Service</Link>
                  <a href={waLink(`Hi HOMline Support, I am logged in as ${user.username} and need assistance.`)} target="_blank" rel="noreferrer" className="btn btn-outline-success rounded-pill px-3 fw-bold"><i className="bi bi-whatsapp me-1"></i> Help Desk</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 g-md-4 mb-4">
          <Stat title="Total Requests" icon="bi-folder2-open" tone={['blue', 'bg-primary-subtle text-primary']} value={data.counts.total} sub="Applications submitted" />
          <Stat title="In Processing" icon="bi-clock-history" tone={['amber', 'bg-warning-subtle text-warning']} value={data.counts.processing + data.counts.pending} sub="Active in verification" />
          <Stat title="Completed" icon="bi-check2-circle" tone={['green', 'bg-success-subtle text-success']} value={data.counts.completed} sub="Delivered & verified" />
          <Stat title="Membership" icon="bi-shield-check" tone={['gold', 'bg-gold-subtle text-gold']} small value={active ? active.plan || 'Active' : 'Free Citizen'} sub={active ? `Code: ${active.membership_code}` : 'Standard Tier'} />
        </div>

        <ul className="nav nav-pills dashboard-nav-tabs mb-4 gap-2" role="tablist">
          {tabs.map(([key, icon, label, count]) => (
            <li className="nav-item" role="presentation" key={key}>
              <button className={`nav-link rounded-pill px-4 fw-bold ${tab === key ? 'active' : ''}`} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>
                <i className={`bi ${icon} me-1`}></i> {label}{count !== undefined && <span className="badge bg-secondary ms-1 rounded-pill">{count}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {tab === 'requests' && <RequestsTab data={data} goLink={() => setTab('link')} />}
          {tab === 'membership' && <MembershipTab m={active} />}
          {tab === 'link' && <LinkTab reload={() => setVersion((v) => v + 1)} />}
          {tab === 'settings' && <SettingsTab user={user} />}
        </div>
      </div>
    </section>
  );
}
