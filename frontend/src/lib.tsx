import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, ApiError } from './api';

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

/** GET helper with loading / error state. Re-fetches when `path` changes. */
export function useApi<T = any>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(!!path);
  useEffect(() => {
    if (!path) return;
    let live = true;
    setLoading(true);
    setError(null);
    api<T>(path)
      .then((d) => live && setData(d))
      .catch((e) => live && setError(e))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [path]);
  return { data, error, loading };
}

export function Loading() {
  return (
    <div className="container py-5 text-center text-muted">
      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading…</span></div>
    </div>
  );
}

export function NotFound({ message = 'Page not found.' }: { message?: string }) {
  return (
    <div className="container py-5 text-center">
      <h1 className="h3 fw-bold text-navy">{message}</h1>
      <a href="/" className="btn btn-teal mt-3">Return to Home</a>
    </div>
  );
}

/** Django `linebreaks`: blank line = paragraph, single newline = <br>. */
export function Linebreaks({ text }: { text: string }) {
  const paras = text.replace(/\r\n/g, '\n').split(/\n{2,}/).filter((p) => p.trim());
  return (
    <>
      {paras.map((p, i) => (
        <p key={i}>
          {p.split('\n').map((line, j, arr) => (
            <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
          ))}
        </p>
      ))}
    </>
  );
}

export const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function fmtDate(iso: string | null | undefined, withTime = false) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const date = `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  if (!withTime) return date;
  let h = d.getHours();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${date}, ${String(h).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${ap}`;
}

/** Scroll to #hash after route changes (react-router does not do this by itself). */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export const waLink = (text: string) => `https://wa.me/916282268453?text=${encodeURIComponent(text)}`;

/** Value that settles `ms` after the last change (live search without a request per keystroke). */
export function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
