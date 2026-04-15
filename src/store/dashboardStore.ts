import { create } from "zustand";

export interface CatalogItem {
  id: string;
  nama: string;
  deskripsi: string;
  harga_sewa: number;
  stok_tersedia: number;
  stok_dipesan?: number;
  gambar?: string;
  kategori: {
    nama: string;
  };
}

export interface Paket {
  id: string;
  nama: string;
  deskripsi: string;
  gambar?: string;

  total_paket: number;
  harga_final: number;
  diskon_persen: number;

  items: Array<{
    id: string;
    paketId: string;
    barangId: string;
    jumlah: number;
    harga_saat_itu?: number;

    barang: {
      nama: string;
      gambar: string | null;
      stok_tersedia: number;
      harga_sewa: number;
    };
  }>;
}

export interface Kategori {
  id: string;
  nama: string;
  gambar?: string;
}

interface DashboardState {
  catalogItems: CatalogItem[];
  paketList: Paket[];

  activeKategori: Kategori | null;

  kategoriItems: CatalogItem[];

  loading: boolean;
  error: string | null;

  kategoriList: Kategori[];
  fetchKategoriList: () => Promise<void>;

  fetchDashboard: () => Promise<void>;
  fetchBarangByKategori: (kategoriId: string) => Promise<void>;
  fetchKategoriById: (id: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  catalogItems: [],
  paketList: [],
  activeKategori: null,

  kategoriItems: [],

  loading: false,
  error: null,

  kategoriList: [],

  fetchKategoriList: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/kategori`,
      );

      if (!res.ok) {
        throw new Error("Gagal fetch kategori");
      }

      const data = await res.json();

      set({ kategoriList: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchDashboard: async () => {
    try {
      set({ loading: true, error: null });

      const [barangRes, paketRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/barang`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/paket`),
      ]);

      if (!barangRes.ok || !paketRes.ok) {
        throw new Error("Gagal fetch dashboard");
      }

      const barang = await barangRes.json();
      const paket = await paketRes.json();

      set({
        catalogItems: barang,
        paketList: paket,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message ?? "Unknown error",
        loading: false,
      });
    }
  },

  fetchBarangByKategori: async (kategoriId: string) => {
    try {
      set({ loading: true, error: null, kategoriItems: [] });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/barang?kategoriId=${kategoriId}`,
      );

      if (!res.ok) {
        throw new Error("Gagal fetch barang kategori");
      }

      const data = await res.json();

      // 4. Update state kategoriItems, BUKAN catalogItems
      set({ kategoriItems: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchKategoriById: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/kategori/${id}`,
      );

      if (!res.ok) {
        throw new Error("Kategori tidak ditemukan");
      }

      const data = await res.json();

      set({ activeKategori: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
