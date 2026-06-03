export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  const explicitBase = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (explicitBase) {
    return explicitBase;
  }

  if (process.env.VERCEL_URL) {
    return `https://zar-one.vercel.app`;
  }

  const port = process.env.PORT || '3000';
  return `http://localhost:${port}`;
}

function resolveUrl(path: string): string {
  if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) {
    return path;
  }

  return `${getApiBaseUrl()}${path}`;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(resolveUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    next: { revalidate: 60 },
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error || 'API request failed');
  }

  return payload.data;
}

export async function apiPost<T, B>(path: string, body: B, init?: RequestInit): Promise<T> {
  const response = await fetch(resolveUrl(path), {
    method: 'POST',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error || 'API request failed');
  }

  return payload.data;
}
