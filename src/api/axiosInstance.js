const BASE =
  import.meta.env.VITE_API_BASE ||
  "https://api.techpolarity.com";

export async function apiFetch(path, token, opts = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    const msg =
      err?.detail?.[0]?.msg ||
      err?.detail ||
      err?.message ||
      `Error ${res.status}`;

    throw new Error(msg);
  }

  if (res.status === 204) return null;

  return res.json();
}