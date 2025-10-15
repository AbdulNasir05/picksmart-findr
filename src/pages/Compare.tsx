import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Compare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productIds = location.state?.productIds || [];

  // Mock data - would fetch based on productIds
  const products = [
    {
      id: 1,
      brand: "Apple",
      model: "iPhone 15 Pro",
      image: "/placeholder.svg",
      specs: {
        processor: "A17 Pro",
        storage: "128GB",
        display: "6.1\" OLED",
        battery: "3,274 mAh",
        camera: "48MP Main"
      },
      platforms: [
        { name: "Amazon", price: 999, rating: 4.8, delivery: "2 days", inStock: true },
        { name: "Best Buy", price: 1049, rating: 4.7, delivery: "1 day", inStock: true },
        { name: "Apple", price: 999, rating: 4.9, delivery: "3 days", inStock: true }
      ]
    },
    {
      id: 2,
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
      image: "/placeholder.svg",
      specs: {
        processor: "Snapdragon 8 Gen 3",
        storage: "256GB",
        display: "6.8\" AMOLED",
        battery: "5,000 mAh",
        camera: "200MP Main"
      },
      platforms: [
        { name: "Amazon", price: 1199, rating: 4.7, delivery: "2 days", inStock: true },
        { name: "Best Buy", price: 1199, rating: 4.8, delivery: "1 day", inStock: false },
        { name: "Samsung", price: 1149, rating: 4.9, delivery: "4 days", inStock: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Compare Products</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="overflow-x-auto">
          <div className="inline-flex gap-6 min-w-full">
            {products.map((product) => (
              <Card key={product.id} className="flex-1 min-w-[300px] max-w-[400px]">
                <div className="aspect-square bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.model}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="text-xl font-bold text-foreground">{product.model}</h3>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Specifications</h4>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="font-semibold text-sm">Available at:</h4>
                    {product.platforms.map((platform, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg bg-muted/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{platform.name}</span>
                          <Badge variant={platform.inStock ? "default" : "secondary"}>
                            {platform.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            ${platform.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ⭐ {platform.rating}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Delivery: {platform.delivery}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-gradient-primary">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bell className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compare;
