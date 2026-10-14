export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  status: number;
  errors: FieldErrors;
  constructor(status: number, message: string, errors: FieldErrors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const csrf = () => document.cookie.split('; ').find((c) => c.startsWith('csrftoken='))?.split('=')[1] ?? '';

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: Record<string, unknown> | FormData } = {},
): Promise<T> {
  const method = opts.method ?? (opts.body ? 'POST' : 'GET');
  const headers: Record<string, string> = { Accept: 'application/json' };
  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) body = opts.body;
  else if (opts.body) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  if (method !== 'GET') headers['X-CSRFToken'] = csrf();
  let res: Response;
  try {
    res = await fetch(`/api/${path}`, { method, headers, body, credentials: 'same-origin' });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.');
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // non-JSON body (for example a plain-text 429)
  }
  if (!res.ok) {
    const msg =
      data.detail ||
      (res.status === 429 ? 'Too many requests. Please try again shortly.' : null) ||
      Object.values<string[]>(data.errors ?? {})[0]?.[0] ||
      'Something went wrong. Please try again.';
    throw new ApiError(res.status, msg, data.errors ?? {});
  }
  return data as T;
}
