"use client";

import { Badge } from "@/components/atoms/Badge";
import { Switch } from "@/components/atoms/Switch";
import { RekeningTujuan } from "@/hooks/admin/useRekeningTujuan";

interface Props {
  rekening: RekeningTujuan;
  onToggleStatus: (id: string) => void;
}

export function RekeningCard({ rekening, onToggleStatus }: Props) {
  return (
    <div
      className={`border rounded-xl p-5 flex justify-between items-center transition-all shadow-sm ${
        !rekening.aktif
          ? "bg-gray-50 border-gray-200 opacity-80"
          : "bg-white border-blue-100"
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg text-gray-800">{rekening.nama}</h3>
          <Badge color={rekening.aktif ? "green" : "gray"}>
            {rekening.aktif ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <div className="text-md font-mono font-medium text-blue-600">
          {rekening.nomor}
        </div>

        <div className="text-sm text-gray-500">
          Atas Nama:{" "}
          <span className="font-semibold text-gray-700">
            {rekening.atas_nama}
          </span>
        </div>

        {!rekening.aktif && (
          <p className="text-[10px] text-red-400 italic mt-1">
            *Rekening ini tidak akan muncul di pilihan pembayaran user
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-col items-center gap-2 px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Status
          </span>
          <Switch
            enabled={rekening.aktif}
            onChange={() => onToggleStatus(rekening.id)}
          />
        </div>
      </div>
    </div>
  );
}
