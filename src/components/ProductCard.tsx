import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BarChart3, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  brand: string;
  model: string;
  price: number;
  rating: number;
  image: string;
  specs: string[];
  bestseller?: boolean;
  recommended?: boolean;
}

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  isInCompare: boolean;
  onToggleWishlist: (id: number) => void;
  onToggleCompare: (id: number) => void;
}

const ProductCard = ({ 
  product, 
  isInWishlist, 
  isInCompare, 
  onToggleWishlist, 
  onToggleCompare 
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square bg-muted">
        <img 
          src={product.image} 
          alt={product.model}
          className="w-full h-full object-cover"
        />
        {product.bestseller && (
          <Badge className="absolute top-3 left-3 bg-accent">
            Bestseller
          </Badge>
        )}
        {product.recommended && (
          <Badge className="absolute top-3 left-3 bg-secondary">
            Recommended
          </Badge>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant={isInWishlist ? "default" : "secondary"}
            onClick={() => onToggleWishlist(product.id)}
            className={isInWishlist ? "bg-red-500 hover:bg-red-600" : ""}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant={isInCompare ? "default" : "secondary"}
            onClick={() => onToggleCompare(product.id)}
            className={isInCompare ? "bg-accent" : ""}
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h3 className="font-semibold text-foreground">{product.model}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.specs.map((spec, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price}
          </span>
          <Button size="sm" className="bg-gradient-primary">
            Buy Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
