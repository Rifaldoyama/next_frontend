// src/hooks/useSewaDraft.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "@/store/authStore";

interface DraftItem {
  barangId: string;
  nama: string;
  jumlah: number;
  stok: number;
  harga?: number;
  source?: "ITEM" | "PAKET"; // 🔥 Tambahan optional (tidak merusak logic lama)
}

interface DraftState {
  paketId?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  metode_ambil?: "AMBIL_SENDIRI" | "DIANTAR";
  alamat_acara?: string;
  jaminan_tipe?: "DEPOSIT_UANG" | "KTP" | "SIM";
  jaminan_detail?: string;
  nama_rekening_pengembalian?: string;
  bank_pengembalian?: string;
  nomor_rekening_pengembalian?: string;

  items: DraftItem[];

  setMeta: (meta: Partial<DraftState>) => void;
  addItem: (item: DraftItem) => void;
  removeItem: (barangId: string) => void;
  clear: () => void;
}

const getStorageName = () => {
  const user = useAuthStore.getState().user;
  if (!user) return "sewa-draft-storage-guest";
  return `sewa-draft-storage-${user.id}`;
};

export const useSewaDraft = create<DraftState>()(
  persist(
    (set) => ({
      items: [],

      setMeta: (meta) =>
        set((state) => ({
          ...state,
          ...meta,
        })),

      addItem: (newItem) =>
        set((state) => {
          console.log("ADD ITEM KE STORE:", newItem);
          console.log("STATE SEBELUM:", state.items);
          const existingItemIndex = state.items.findIndex(
            (i) => i.barangId === newItem.barangId,
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const targetItem = updatedItems[existingItemIndex];
            const newTotal = targetItem.jumlah + newItem.jumlah;

            if (newTotal > targetItem.stok) {
              updatedItems[existingItemIndex].jumlah = targetItem.stok;
              return { items: updatedItems };
            }

            if (newTotal < 1) {
              updatedItems[existingItemIndex].jumlah = 1;
              return { items: updatedItems };
            }

            updatedItems[existingItemIndex].jumlah = newTotal;
            return { items: updatedItems };
          }
          // Barang baru
          const initialAmount =
            newItem.jumlah > newItem.stok ? newItem.stok : newItem.jumlah;

          return {
            items: [...state.items, { ...newItem, jumlah: initialAmount }],
          };
        }),

      removeItem: (barangId) =>
        set((state) => ({
          items: state.items.filter((i) => i.barangId !== barangId),
        })),

      clear: () =>
        set({
          paketId: undefined,
          items: [],
          tanggal_mulai: undefined,
          tanggal_selesai: undefined,
          metode_ambil: undefined,
          alamat_acara: undefined,
          jaminan_tipe: undefined,
          jaminan_detail: undefined,
          nama_rekening_pengembalian: undefined,
          bank_pengembalian: undefined,
          nomor_rekening_pengembalian: undefined,
        }),
    }),
    {
      name: getStorageName(),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
