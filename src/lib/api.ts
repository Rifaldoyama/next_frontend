export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  path: string,
  options: RequestInit & { isBlob?: boolean } = {},
) {
  const { isBlob, ...fetchOptions } = options;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(fetchOptions.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...fetchOptions.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    let errorMessage = "API Error";

    try {
      const data = await res.json();
      errorMessage = data.message || errorMessage;
    } catch {
      const text = await res.text();
      if (text) errorMessage = text;
    }

    throw new Error(errorMessage);
  }

  // 🔥 Kalau minta Blob
  if (isBlob) {
    return await res.blob();
  }

  // 🔥 Default JSON
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
