export async function apiFetchForm(
  endpoint: string,
  formData: FormData,
  options?: RequestInit,
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: options?.method || "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...(options?.headers || {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal mengunggah file");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
