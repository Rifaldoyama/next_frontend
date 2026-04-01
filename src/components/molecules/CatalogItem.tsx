import { Card } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";

interface CatalogItemCardProps {
  nama: string;
  category: string;
  stok: number;
}

export const CatalogItemCard = ({
  nama,
  category,
  stok,
}: CatalogItemCardProps) => {
  const available = stok > 0;


  return (
    <Card>
      <h3 className="font-semibold">{nama}</h3>
      <p className="text-sm text-gray-500">{category}</p>
      <p className="text-sm">Stok: {stok}</p>

      <Badge color={available ? "green" : "red"} className="mt-3">
        {available ? "Tersedia" : "Habis"}
      </Badge>
    </Card>
  );
};

