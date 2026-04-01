// components/organisms/CatalogSection.tsx
import { CatalogItemCard } from '../molecules/CatalogItem';

interface CatalogSectionProps {
   items: Array<{
    id: string
    nama: string;
    stok: number;
    kategori: {
      nama: string;
    };
  }>;
}

export const CatalogSection = ({ items }: CatalogSectionProps) => {
  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Katalog Barang</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          Filter
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
        {items.map((item) => (
          <CatalogItemCard
            key={item.id}
            nama={item.nama}
            category={item.kategori.nama} 
            stok={item.stok}
          />
        ))}
      </div>
    </section>
  );
};