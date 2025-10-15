import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Wishlist = () => {
  const navigate = useNavigate();

  // Mock wishlist data
  const wishlistItems = [
    {
      id: 1,
      brand: "Apple",
      model: "iPhone 15 Pro",
      price: 999,
      image: "/placeholder.svg",
      specs: ["A17 Pro", "128GB", "6.1\""],
      inStock: true
    },
    {
      id: 2,
      brand: "Dell",
      model: "XPS 15",
      price: 1799,
      image: "/placeholder.svg",
      specs: ["Intel i7", "1TB SSD", "32GB RAM"],
      inStock: true
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
            <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          </div>
          <span className="text-muted-foreground">{wishlistItems.length} items</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex gap-6">
                <div className="w-32 h-32 rounded-lg bg-muted flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.model}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                      <h3 className="text-xl font-bold text-foreground">{item.model}</h3>
                    </div>
                    <Badge variant={item.inStock ? "default" : "secondary"}>
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.specs.map((spec, index) => (
                      <Badge key={index} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${item.price}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                      <Button size="sm" className="bg-gradient-primary">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
