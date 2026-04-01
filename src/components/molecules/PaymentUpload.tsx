"use client";

import { useState } from "react";
import { Button } from "../atoms/Buttons";

interface Props {
  peminjamanId: string;
  tipe: "DP" | "LUNAS";
  uploading: boolean;
  uploadBukti: (id: string, file: File, tipe: "DP" | "LUNAS") => Promise<void>;
}

export function PaymentUpload({
  peminjamanId,
  tipe,
  uploading,
  uploadBukti,
}: Props) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    await uploadBukti(peminjamanId, file, tipe);
    setFile(null);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload Bukti"}
      </Button>
    </div>
  );
}
