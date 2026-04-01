"use client";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";

export const KategoriTable = ({ data, onEdit, onDelete, onToggle }: any) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Info Kategori</th>
            <th className="p-4 text-xs font-semibold uppercase text-gray-500 text-center">Status</th>
            <th className="p-4 text-xs font-semibold uppercase text-gray-500 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item: any) => (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.gambar}`}
                    className="h-12 w-12 rounded-lg object-cover bg-gray-100"
                    alt={item.nama}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.nama}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-col items-center gap-1">
                  Visible / Hidden
                  <button
                    onClick={() => onToggle(item.id, item.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      item.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {item.isActive ? "Visible" : "Hidden"}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};