import { FormEvent, ReactNode, useState } from 'react';
import { api, ApiError, FieldErrors } from '../api';

export function Errors({ errors, name }: { errors: FieldErrors; name: string }) {
  return <>{(errors[name] ?? []).map((e) => <div key={e} className="text-danger small mt-1">{e}</div>)}</>;
}

/** Shared submit handling: locks the button while sending (cold starts can take a minute) and maps API errors to fields. */
export function useSubmit<T = any>(path: string, onDone: (data: T, form: HTMLFormElement) => void) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    setBusy(true);
    setErrors({});
    try {
      onDone(await api<T>(path, { body: new FormData(form) }), form);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(Object.keys(err.errors).length ? err.errors : { __all__: [err.message] });
      } else {
        setErrors({ __all__: ['Unexpected error.'] });
      }
    } finally {
      setBusy(false);
    }
  };
  return { errors, busy, submit };
}

export function SubmitButton({ busy, children, className = 'btn btn-teal px-4' }: { busy: boolean; children: ReactNode; className?: string }) {
  return (
    <button type="submit" className={className} disabled={busy}>
      {busy ? 'Sending your request… please keep this page open' : children}
    </button>
  );
}

export function FormAlert({ errors }: { errors: FieldErrors }) {
  const all = errors.__all__ ?? [];
  const hasFieldErrors = Object.keys(errors).some((k) => k !== '__all__' && errors[k].length);
  return (
    <>
      {all.map((e) => <div key={e} className="alert alert-danger py-2">{e}</div>)}
      {hasFieldErrors && !all.length && <div className="alert alert-danger py-2">Please correct the highlighted fields and try again.</div>}
    </>
  );
}

export function hideModal(el: HTMLElement | null) {
  const bs = (window as any).bootstrap;
  bs?.Modal?.getInstance(el)?.hide();
}
