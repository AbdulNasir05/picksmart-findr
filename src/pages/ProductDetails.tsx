import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Star, ExternalLink, Package, Truck, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Product {
  id: string;
  brand: string;
  model: string;
  price: number;
  rating: number;
  image: string;
  specs: Record<string, string>;
  features: string[];
  category: string;
}

interface ProductPrice {
  id: string;
  platform: string;
  platform_url: string;
  price: number;
  shipping_cost: number;
  delivery_days: number;
  rating: number;
  in_stock: boolean;
}

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    if (!productId) return;

    try {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      setProduct(productData as any);

      // Fetch prices
      const { data: pricesData, error: pricesError } = await supabase
        .from('product_prices')
        .select('*')
        .eq('product_id', productId)
        .order('price', { ascending: true })
        .limit(3);

      if (pricesError) throw pricesError;
      setPrices(pricesData || []);

      // Track recently viewed if user is logged in
      if (user) {
        await supabase
          .from('recently_viewed')
          .upsert({
            user_id: user.id,
            product_id: productId,
            viewed_at: new Date().toISOString(),
          }, { onConflict: 'user_id,product_id' });
      }
    } catch (error: any) {
      toast.error('Failed to load product details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Product not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Product Details</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-card rounded-xl p-8 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={`${product.brand} ${product.model}`}
              className="max-w-full h-auto max-h-96 object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{product.model}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsInWishlist(!isInWishlist)}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">·</span>
                <p className="text-lg font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Best Prices Section */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">Best Prices Online</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {prices.map((price, index) => (
              <Card key={price.id} className={`p-6 ${index === 0 ? 'ring-2 ring-primary' : ''}`}>
                {index === 0 && (
                  <Badge className="mb-4 bg-gradient-primary">Best Deal</Badge>
                )}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-foreground mb-2">{price.platform}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      ₹{price.price.toLocaleString('en-IN')}
                    </span>
                    {price.shipping_cost > 0 && (
                      <span className="text-sm text-muted-foreground">
                        + ₹{price.shipping_cost} shipping
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span>Delivery in {price.delivery_days} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{price.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className={price.in_stock ? 'text-green-600' : 'text-red-600'}>
                      {price.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleBuyNow(price.platform_url)}
                  disabled={!price.in_stock}
                  className={`w-full ${index === 0 ? 'bg-gradient-primary' : ''}`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
