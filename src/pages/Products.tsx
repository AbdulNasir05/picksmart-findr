import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, User, Heart, BarChart3, MessageCircle } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FilterPanel from "@/components/FilterPanel";
import ChatBot from "@/components/ChatBot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock product data
const mockProducts = {
  phone: [
    { id: 1, brand: "Apple", model: "iPhone 15 Pro", price: 999, rating: 4.8, image: "/placeholder.svg", specs: ["A17 Pro", "128GB", "6.1\""], bestseller: true },
    { id: 2, brand: "Samsung", model: "Galaxy S24 Ultra", price: 1199, rating: 4.7, image: "/placeholder.svg", specs: ["Snapdragon 8 Gen 3", "256GB", "6.8\""], recommended: true },
    { id: 3, brand: "Google", model: "Pixel 8 Pro", price: 899, rating: 4.6, image: "/placeholder.svg", specs: ["Tensor G3", "128GB", "6.7\""] },
    { id: 4, brand: "OnePlus", model: "12 Pro", price: 799, rating: 4.5, image: "/placeholder.svg", specs: ["Snapdragon 8 Gen 3", "256GB", "6.7\""], bestseller: true },
  ],
  laptop: [
    { id: 5, brand: "Apple", model: "MacBook Pro 16\"", price: 2499, rating: 4.9, image: "/placeholder.svg", specs: ["M3 Pro", "512GB SSD", "16GB RAM"], bestseller: true },
    { id: 6, brand: "Dell", model: "XPS 15", price: 1799, rating: 4.7, image: "/placeholder.svg", specs: ["Intel i7", "1TB SSD", "32GB RAM"], recommended: true },
    { id: 7, brand: "HP", model: "Spectre x360", price: 1499, rating: 4.6, image: "/placeholder.svg", specs: ["Intel i7", "512GB SSD", "16GB RAM"] },
    { id: 8, brand: "Lenovo", model: "ThinkPad X1", price: 1699, rating: 4.8, image: "/placeholder.svg", specs: ["Intel i7", "1TB SSD", "16GB RAM"] },
  ],
  tablet: [
    { id: 9, brand: "Apple", model: "iPad Pro 12.9\"", price: 1099, rating: 4.8, image: "/placeholder.svg", specs: ["M2", "256GB", "12.9\""], bestseller: true },
    { id: 10, brand: "Samsung", model: "Galaxy Tab S9 Ultra", price: 999, rating: 4.7, image: "/placeholder.svg", specs: ["Snapdragon 8 Gen 2", "256GB", "14.6\""], recommended: true },
    { id: 11, brand: "Microsoft", model: "Surface Pro 9", price: 899, rating: 4.6, image: "/placeholder.svg", specs: ["Intel i7", "256GB", "13\""] },
    { id: 12, brand: "Lenovo", model: "Tab P12 Pro", price: 699, rating: 4.5, image: "/placeholder.svg", specs: ["Snapdragon 870", "256GB", "12.6\""] },
  ]
};

const Products = () => {
  const { category = "phone" } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  const products = mockProducts[category as keyof typeof mockProducts] || mockProducts.phone;
  const bestsellers = products.filter(p => p.bestseller);
  const recommended = products.filter(p => p.recommended);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleCompare = (productId: number) => {
    if (compareList.includes(productId)) {
      setCompareList(prev => prev.filter(id => id !== productId));
    } else if (compareList.length < 3) {
      setCompareList(prev => [...prev, productId]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/categories")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist ({wishlist.length})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 hidden lg:block">
            <FilterPanel category={category} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Compare Bar */}
            {compareList.length > 0 && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  <span className="font-medium">{compareList.length} products selected</span>
                </div>
                <Button
                  onClick={() => navigate("/compare", { state: { productIds: compareList } })}
                  size="sm"
                  className="bg-gradient-primary"
                >
                  Compare Now
                </Button>
              </div>
            )}

            {/* Bestsellers */}
            {bestsellers.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="text-accent">★</span> Bestsellers
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestsellers.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isInWishlist={wishlist.includes(product.id)}
                      isInCompare={compareList.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                      onToggleCompare={toggleCompare}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Recommended */}
            {recommended.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Recommended For You</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommended.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isInWishlist={wishlist.includes(product.id)}
                      isInCompare={compareList.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                      onToggleCompare={toggleCompare}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Products */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">All {category}s</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isInWishlist={wishlist.includes(product.id)}
                    isInCompare={compareList.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Floating Chat Button */}
      <Button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl bg-gradient-primary hover:opacity-90 transition-opacity z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chatbot */}
      <ChatBot open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Products;
