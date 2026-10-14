import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api, ApiError, FieldErrors } from '../api';
import { useApp } from '../app';
import { Errors } from '../components/forms';
import { useTitle } from '../lib';
import type { User } from '../types';

function useAuthForm(path: string, onUser: (u: User) => void) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    f.forEach((v, k) => { body[k] = v; });
    if (e.currentTarget.querySelector('[name=remember_me]')) body.remember_me = f.has('remember_me');
    setBusy(true);
    setErrors({});
    try {
      onUser((await api<{ user: User }>(path, { body })).user);
    } catch (err) {
      setErrors(err instanceof ApiError ? err.errors : { __all__: ['Unexpected error.'] });
    } finally {
      setBusy(false);
    }
  };
  return { errors, busy, submit };
}

const Shell = ({ badge, title, sub, children, footer }: { badge: string; title: string; sub: string; children: React.ReactNode; footer: React.ReactNode }) => (
  <section className="py-5 bg-soft-mist" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-6 col-xl-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
            <div className="p-4 bg-navy text-white text-center position-relative">
              <div className="mb-2"><span className="badge bg-gold text-dark font-monospace small px-3 py-1 rounded-pill fw-bold">{badge}</span></div>
              <h1 className="h4 fw-extrabold text-white mb-1">{title}</h1>
              <p className="text-white-75 small mb-0">{sub}</p>
            </div>
            <div className="p-4">
              {children}
              <div className="text-center mt-4 pt-3 border-top">{footer}</div>
            </div>
          </div>
          <div className="text-center mt-3"><Link to="/" className="small text-muted text-decoration-none"><i className="bi bi-arrow-left me-1"></i> Back to Homepage</Link></div>
        </div>
      </div>
    </div>
  </section>
);

const Field = ({ name, label, icon, type = 'text', placeholder, errors, auto }: { name: string; label: string; icon: string; type?: string; placeholder: string; errors: FieldErrors; auto?: string }) => (
  <div className="mb-3">
    <label htmlFor={`f-${name}`} className="form-label fw-bold text-navy small">{label}</label>
    <div className="input-group">
      <span className="input-group-text bg-light text-muted border-end-0"><i className={`bi ${icon}`}></i></span>
      <input id={`f-${name}`} name={name} type={type} className="form-control form-control-lg" placeholder={placeholder} autoComplete={auto} required />
    </div>
    <Errors errors={errors} name={name} />
  </div>
);

export function Login() {
  useTitle('Sign In • HOMline DIGI seva');
  const { user, setUser, notify } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');
  const { errors, busy, submit } = useAuthForm('auth/login/', (u) => {
    setUser(u);
    notify(`Welcome back, ${u.first_name || u.username}!`);
    navigate(next && next.startsWith('/') && !next.startsWith('//') ? next : u.is_staff ? '/panel' : '/dashboard');
  });
  if (user) return <Navigate to={user.is_staff ? '/panel' : '/dashboard'} replace />;
  return (
    <Shell badge="CLIENT PORTAL" title="Sign In to HOMline" sub="Track applications, view membership, & manage requests"
      footer={<p className="small text-muted mb-0">Don't have an account yet? <Link to="/signup" className="fw-bold text-teal text-decoration-none">Sign Up Free →</Link></p>}>
      {errors.__all__ && <div className="alert alert-danger rounded-3 py-2 small mb-3"><i className="bi bi-exclamation-circle-fill me-1"></i> {errors.__all__[0]}</div>}
      <form onSubmit={submit}>
        <Field name="username" label="Username or Email" icon="bi-person" placeholder="Enter username or email" errors={errors} auto="username" />
        <Field name="password" label="Password" icon="bi-key" type="password" placeholder="Enter password" errors={errors} auto="current-password" />
        <div className="mb-3 form-check">
          <input className="form-check-input" type="checkbox" name="remember_me" id="f-remember" defaultChecked />
          <label className="form-check-label small text-muted ms-1" htmlFor="f-remember">Keep me signed in on this device</label>
        </div>
        <button type="submit" className="btn btn-teal btn-lg w-100 fw-bold shadow-sm mt-2" disabled={busy}><i className="bi bi-box-arrow-in-right me-1"></i> {busy ? 'Signing in…' : 'Sign In'}</button>
      </form>
    </Shell>
  );
}

export function Signup() {
  useTitle('Create Account • HOMline DIGI seva');
  const { user, setUser, notify } = useApp();
  const navigate = useNavigate();
  const { errors, busy, submit } = useAuthForm('auth/signup/', (u) => {
    setUser(u);
    notify(`Welcome to HOMline, ${u.first_name || u.username}! Your account has been created.`);
    navigate('/dashboard');
  });
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <Shell badge="JOIN HOMLINE" title="Create Your Account" sub="Free access to all assisted online services across Kerala"
      footer={<p className="small text-muted mb-0">Already have an account? <Link to="/login" className="fw-bold text-teal text-decoration-none">Sign In →</Link></p>}>
      {Object.keys(errors).length > 0 && <div className="alert alert-danger rounded-3 py-2 small mb-3"><i className="bi bi-exclamation-circle-fill me-1"></i> Please correct the highlighted errors below.</div>}
      <form onSubmit={submit}>
        <Field name="full_name" label="Full Name" icon="bi-person-badge" placeholder="Full Name" errors={errors} auto="name" />
        <Field name="username" label="Username" icon="bi-at" placeholder="Choose a Username" errors={errors} auto="username" />
        <Field name="email" label="Email Address" icon="bi-envelope" type="email" placeholder="Email Address" errors={errors} auto="email" />
        <Field name="password" label="Password" icon="bi-key" type="password" placeholder="Create password (8+ characters)" errors={errors} auto="new-password" />
        <Field name="confirm_password" label="Confirm Password" icon="bi-shield-check" type="password" placeholder="Confirm Password" errors={errors} auto="new-password" />
        <div className="form-text text-muted small mb-3"><i className="bi bi-shield-lock-fill text-teal me-1"></i> Your personal data is encrypted and protected under AMDG Media data guidelines.</div>
        <button type="submit" className="btn btn-teal btn-lg w-100 fw-bold shadow-sm" disabled={busy}><i className="bi bi-person-plus-fill me-1"></i> {busy ? 'Creating account…' : 'Create Free Account'}</button>
      </form>
    </Shell>
  );
}
