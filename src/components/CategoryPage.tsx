import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Search, User, Heart, MessageCircle, SlidersHorizontal, X } from "lucide-react";
import { DeviceCard } from "@/components/DeviceCard";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import ChatBot from "@/components/ChatBot";
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

interface Device {
  brand: string;
  model: string;
  image: string;
  ram?: string;
  storage?: string;
  battery?: string;
  camera?: string;
  processor?: string;
  graphics?: string;
  display?: string;
  os?: string;
  price: number;
  ratings?: number;
  key_features?: string[];
  Amazon: string;
  Flipkart: string;
  "Amazon Price": number;
  "Flipkart Price"?: number;
  "Flipkart prices"?: number;
  bestseller?: boolean;
  recommended?: boolean;
}

interface CategoryPageProps {
  title: string;
  icon: React.ElementType;
  category: "mobile" | "laptop" | "tablet";
  categoryKey: string;
  devices: Device[];
}

export const CategoryPage = ({ title, icon: Icon, category, categoryKey, devices }: CategoryPageProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
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
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filteredDevices = devices.filter(device => {
    // Search filter
    if (searchQuery && !device.model.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !device.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(device.brand)) {
      return false;
    }

    // Price filter
    const devicePrice = device["Amazon Price"] || device.price || 0;
    if (devicePrice < filters.priceRange[0] || devicePrice > filters.priceRange[1]) {
      return false;
    }

    // RAM filter
    if (filters.specs.RAM && filters.specs.RAM.length > 0 && device.ram) {
      if (!filters.specs.RAM.some(ram => device.ram?.includes(ram))) {
        return false;
      }
    }

    // Storage filter
    if (filters.specs.Storage && filters.specs.Storage.length > 0 && device.storage) {
      if (!filters.specs.Storage.some(storage => device.storage?.includes(storage))) {
        return false;
      }
    }

    // Display filter
    if (filters.specs.Display && filters.specs.Display.length > 0 && device.display) {
      if (!filters.specs.Display.some(display => device.display?.includes(display))) {
        return false;
      }
    }

    // Processor filter
    if (filters.specs.Processor && filters.specs.Processor.length > 0 && device.processor) {
      if (!filters.specs.Processor.some(proc => device.processor?.toLowerCase().includes(proc.toLowerCase()))) {
        return false;
      }
    }

    // Features filter
    if (filters.features.length > 0 && device.key_features) {
      if (!filters.features.some(f => device.key_features?.includes(f))) {
        return false;
      }
    }

    return true;
  });

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    const priceA = a["Amazon Price"] || a.price || 0;
    const priceB = b["Amazon Price"] || b.price || 0;
    
    switch (sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'rating':
        return (b.ratings || 0) - (a.ratings || 0);
      case 'newest':
        return 0;
      default: // popularity
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    }
  });

  const bestsellers = sortedDevices.filter(d => d.bestseller).slice(0, 6);
  const recommended = sortedDevices.filter(d => d.recommended).slice(0, 6);

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

            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
            </div>

            <div className="flex-1 relative max-w-md ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
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
                <FilterPanel category={categoryKey} onFilterChange={setFilters} isMobile />
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
                      Wishlist
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
            <FilterPanel category={categoryKey} onFilterChange={setFilters} />
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
                  {filteredDevices.length} devices found
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

            {/* Bestsellers */}
            {bestsellers.length > 0 && (
              <section className="mb-12 animate-fade-in">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="text-accent">★</span> Bestsellers
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestsellers.map((device, index) => (
                    <DeviceCard key={index} device={device} category={category} />
                  ))}
                </div>
              </section>
            )}

            {/* Recommended */}
            {recommended.length > 0 && (
              <section className="mb-12 animate-fade-in">
                <h2 className="text-2xl font-bold text-foreground mb-6">Recommended For You</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommended.map((device, index) => (
                    <DeviceCard key={index} device={device} category={category} />
                  ))}
                </div>
              </section>
            )}

            {/* All Devices */}
            <section className="animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">All {title}</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : sortedDevices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No devices found matching your filters</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedDevices.map((device, index) => (
                    <DeviceCard key={index} device={device} category={category} />
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
