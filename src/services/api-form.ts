export async function apiFetchForm(endpoint: string, formData: FormData) {
  const token = localStorage.getItem("token"); // Ambil token auth

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      // PENTING: Jangan isi Content-Type. 
      // Biarkan browser mengisinya otomatis dengan boundary.
      Authorization: token ? `Bearer ${token}` : "",
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