"use client";
import { useEffect, useState } from "react";

export default function PrintPage({ params }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/peminjaman/${params.id}/receipt`)
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const dp = data.pembayaran.find(
    (p) => p.tipe === "DP" && p.status === "VERIFIED",
  );
  const pelunasan = data.pembayaran.find(
    (p) => p.tipe === "PELUNASAN" && p.status === "VERIFIED",
  );

  return (
    <div className="p-10">
      <h1>STRUK PEMINJAMAN</h1>

      <p>Nama: {data.user.username}</p>

      <h3>Barang:</h3>
      {data.items.map((item) => (
        <div key={item.id}>
          {item.barang.nama} x {item.jumlah}
        </div>
      ))}

      <div className="border-t pt-2 font-bold flex justify-between">
        <span>Total</span>
        <span>Rp {data.total_biaya}</span>
      </div>

      {dp && <p>DP: {dp.jumlah}</p>}
      {pelunasan && <p>Pelunasan: {pelunasan.jumlah}</p>}

      <p>Status: {data.status_bayar}</p>

      <button onClick={() => window.print()}>Print</button>
    </div>
  );
}
