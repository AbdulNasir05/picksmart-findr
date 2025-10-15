import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Search, User, Heart, BarChart3, MessageCircle, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import ChatBot from "@/components/ChatBot";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  brand: string;
  model: string;
  price: number;
  rating: number;
  image: string;
  specs: Record<string, string>;
  features: string[];
  bestseller: boolean;
  recommended: boolean;
  category: string;
}

const Products = () => {
  const { category = "phone" } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: [0, 300000],
    specs: {},
    features: [],
  });
  const [sortBy, setSortBy] = useState("popularity");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchRecentlyViewed();
    }
  }, [category, user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);

      if (error) throw error;
      setProducts((data as any) || []);
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentlyViewed = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('recently_viewed')
        .select('product_id, products(*)')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      
      const viewedProducts = data
        ?.map(item => item.products)
        .filter(Boolean) as Product[];
      
      setRecentlyViewed(viewedProducts || []);
    } catch (error: any) {
      console.error('Failed to fetch recently viewed:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.model.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Specs filter
    for (const [specKey, specValues] of Object.entries(filters.specs)) {
      if (specValues.length > 0) {
        const productSpecValue = product.specs[specKey.toLowerCase()];
        if (!productSpecValue || !specValues.some(v => productSpecValue.includes(v))) {
          return false;
        }
      }
    }

    // Features filter
    if (filters.features.length > 0) {
      if (!filters.features.some(f => product.features.includes(f))) {
        return false;
      }
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return 0; // Would need created_at field
      default: // popularity
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    }
  });

  const bestsellers = sortedProducts.filter(p => p.bestseller);
  const recommended = sortedProducts.filter(p => p.recommended);

  const activeFilterCount = 
    filters.brands.length + 
    Object.values(filters.specs).reduce((acc, val) => acc + val.length, 0) +
    filters.features.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 300000 ? 1 : 0);

  const removeFilterChip = (type: 'brand' | 'spec' | 'feature', value: string, specKey?: string) => {
    if (type === 'brand') {
      setFilters(prev => ({
        ...prev,
        brands: prev.brands.filter(b => b !== value)
      }));
    } else if (type === 'spec' && specKey) {
      setFilters(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specKey]: prev.specs[specKey]?.filter(v => v !== value) || []
        }
      }));
    } else if (type === 'feature') {
      setFilters(prev => ({
        ...prev,
        features: prev.features.filter(f => f !== value)
      }));
    }
  };

  const toggleWishlist = (productId: string | number) => {
    const id = String(productId);
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCompare = (productId: string | number) => {
    const id = String(productId);
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(i => i !== id));
    } else if (compareList.length < 3) {
      setCompareList(prev => [...prev, id]);
    } else {
      toast.error('You can compare up to 3 products only');
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

            {/* Mobile Filter Button */}
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden relative">
                  <SlidersHorizontal className="w-5 h-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <FilterPanel category={category} onFilterChange={setFilters} isMobile />
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist ({wishlist.length})
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 hidden lg:block">
            <FilterPanel category={category} onFilterChange={setFilters} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort and Filter Chips */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {activeFilterCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
              )}
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.brands.map(brand => (
                  <Badge key={brand} variant="secondary" className="gap-1">
                    {brand}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeFilterChip('brand', brand)}
                    />
                  </Badge>
                ))}
                {Object.entries(filters.specs).map(([key, values]) =>
                  values.map(value => (
                    <Badge key={`${key}-${value}`} variant="secondary" className="gap-1">
                      {value}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeFilterChip('spec', value, key)}
                      />
                    </Badge>
                  ))
                )}
                {filters.features.map(feature => (
                  <Badge key={feature} variant="secondary" className="gap-1">
                    {feature}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeFilterChip('feature', feature)}
                    />
                  </Badge>
                ))}
              </div>
            )}
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

            {/* Recently Visited */}
            {recentlyViewed.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Recently Visited</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentlyViewed.map(product => (
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your filters</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map(product => (
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
              )}
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
