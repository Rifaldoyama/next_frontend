import { ShoppingCart, Eye, Package, Sparkles } from "lucide-react";

interface PackageCardProps {
  name: string;
  description: string;
  itemCount: number;
  image: string;
  price: number;
  discount?: number;
  onSelect: () => void;
  onDetail: () => void;
}

export const PackageCard = ({
  name,
  description,
  itemCount,
  image,
  price,
  discount = 0,
  onSelect,
  onDetail,
}: PackageCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            -{discount}%
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Package className="w-3 h-3" />
          <span>{itemCount} item</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Rp {price.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              Rp {(price / (1 - discount / 100)).toLocaleString()}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onDetail}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <Eye className="w-4 h-4" />
            Detail
          </button>
          <button
            onClick={onSelect}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            Sewa
          </button>
        </div>
      </div>
    </div>
  );
};
