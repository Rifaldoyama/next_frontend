export async function submitUserDetail(data: {
  nama_lengkap: string;
  no_hp: string;
  alamat: string;
  foto_ktp?: File | null;
}) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Unauthorized');
  }

  const fd = new FormData();
  fd.append('nama_lengkap', data.nama_lengkap);
  fd.append('no_hp', data.no_hp);
  fd.append('alamat', data.alamat);

  if (data.foto_ktp) {
    fd.append('foto_ktp', data.foto_ktp);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user-detail`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed submit user detail');
  }

  return res.json();
}
