/** Client-side fetch helper with consistent error handling. */
export async function apiFetch<T = Record<string, unknown>>(
  url: string,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        (data as { error?: string }).error ||
        `Request failed (${res.status})`;
      return { ok: false, error: message };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "Network error — check your connection" };
  }
}
