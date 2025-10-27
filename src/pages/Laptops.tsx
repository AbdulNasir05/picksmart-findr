import { useState, useEffect } from "react";
import { ArrowLeft, Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DeviceCard } from "@/components/DeviceCard";
import laptopsData from "@/data/laptops.json";

interface LaptopDevice {
  category: string;
  brand: string;
  model: string;
  image: string;
  ram: string;
  storage: string;
  battery: string;
  processor: string;
  graphics: string;
  display: string;
  os: string;
  price: number;
  ratings: number;
  key_features: string[];
  Amazon: string;
  Flipkart: string;
  "Amazon Price": number;
  "Flipkart Price": number;
}

const Laptops = () => {
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState<LaptopDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLaptops(laptopsData as LaptopDevice[]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/categories")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Laptop className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Laptops</h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {laptops.length} devices available
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-muted-foreground animate-pulse">Loading devices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laptops.map((laptop, index) => (
              <DeviceCard key={index} device={laptop} category="laptop" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Laptops;
