import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface FilterPanelProps {
  category: string;
  onFilterChange?: (filters: FilterState) => void;
  isMobile?: boolean;
}

export interface FilterState {
  brands: string[];
  priceRange: [number, number];
  specs: Record<string, string[]>;
  features: string[];
}

const FilterPanel = ({ category, onFilterChange, isMobile = false }: FilterPanelProps) => {
  const maxPrice = 300000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState(maxPrice.toString());
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>({});
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");

  const brands = category === "phone" 
    ? ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo"]
    : category === "laptop"
    ? ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Microsoft"]
    : ["Apple", "Samsung", "Microsoft", "Lenovo", "Huawei", "Amazon"];

  const specs = category === "phone"
    ? {
        "RAM": ["4GB", "6GB", "8GB", "12GB", "16GB"],
        "Storage": ["64GB", "128GB", "256GB", "512GB", "1TB"],
        "Display": ["6.1\"", "6.4\"", "6.7\"", "6.8\""],
      }
    : category === "laptop"
    ? {
        "RAM": ["8GB", "16GB", "32GB", "64GB"],
        "Storage": ["256GB", "512GB", "1TB", "2TB"],
        "Processor": ["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7", "M1", "M2", "M3"],
      }
    : {
        "RAM": ["4GB", "6GB", "8GB", "12GB", "16GB"],
        "Storage": ["64GB", "128GB", "256GB", "512GB", "1TB"],
        "Display": ["10\"", "11\"", "12\"", "13\"", "14\""],
      };

  const features = category === "phone"
    ? ["5G", "Face ID", "Fingerprint", "Wireless Charging", "Fast Charging", "Water Resistant"]
    : category === "laptop"
    ? ["Touchscreen", "2-in-1", "Backlit Keyboard", "Fingerprint", "Thunderbolt", "Dedicated GPU"]
    : ["Stylus Support", "Keyboard", "5G", "LTE", "Face ID", "Fingerprint"];

  const filteredBrands = brands.filter(brand =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        brands: selectedBrands,
        priceRange,
        specs: selectedSpecs,
        features: selectedFeatures,
      });
    }
  }, [selectedBrands, priceRange, selectedSpecs, selectedFeatures]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleSpec = (category: string, value: string) => {
    setSelectedSpecs(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handlePriceChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setPriceRange(newRange);
    setMinInput(values[0].toString());
    setMaxInput(values[1].toString());
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxInput(value);
    const numValue = parseInt(value) || maxPrice;
    if (numValue >= priceRange[0] && numValue <= maxPrice) {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setMinInput("0");
    setMaxInput(maxPrice.toString());
    setSelectedSpecs({});
    setSelectedFeatures([]);
  };

  const hasActiveFilters = selectedBrands.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < maxPrice ||
    Object.keys(selectedSpecs).length > 0 ||
    selectedFeatures.length > 0;

  return (
    /* FilterPanel component */
    // We DON'T apply padding on the Card — it's handled by the sheet wrapper so scroll area includes padding.
    // For desktop we add an inner wrapper with max-height + overflow-y-auto so it scrolls.
    <Card className={`${!isMobile ? 'sticky top-24' : ''} w-full`}>
      {/* Desktop: limit the height of the content and enable inner scrolling.
          - top-24 must match your header height; adjust if necessary.
          - Using calc(100vh - 6rem) as example. You can change 6rem to whatever top offset you need.
      */}
      <div
        className={
          !isMobile
            ? 'max-h-[calc(100vh-6rem)] overflow-y-auto pr-2' // desktop: scroll inside the card
            : '' // mobile: sheet's parent scrolling handles it
        }
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Filters</h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-foreground">
              Clear all
            </button>
          )}
        </div>

        {/* Brand Filter with Search */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Brand</Label>
          <Input
            type="text"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="mb-3 h-9"
          />
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {filteredBrands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox id={brand} checked={selectedBrands.includes(brand)} onCheckedChange={() => toggleBrand(brand)} />
                <label htmlFor={brand} className="text-sm cursor-pointer select-none">{brand}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">
            Price Range: ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
          </Label>
          <Slider value={priceRange} onValueChange={handlePriceChange} max={maxPrice} step={1000} className="mb-3" />
          <div className="flex gap-2">
            <Input type="number" placeholder="Min" value={minInput} onChange={handleMinInputChange} className="h-9" />
            <Input type="number" placeholder="Max" value={maxInput} onChange={handleMaxInputChange} className="h-9" />
          </div>
        </div>

        {/* Specs Filters */}
        {Object.entries(specs).map(([specName, options]) => (
          <div key={specName} className="mb-6">
            <Label className="text-sm font-medium mb-3 block">{specName}</Label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {options.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${specName}-${option}`}
                    checked={selectedSpecs[specName]?.includes(option) || false}
                    onCheckedChange={() => toggleSpec(specName, option)}
                  />
                  <label htmlFor={`${specName}-${option}`} className="text-sm cursor-pointer select-none">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Features Filter */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Features</Label>
          <div className="space-y-3">
            {features.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox id={`feature-${feature}`} checked={selectedFeatures.includes(feature)} onCheckedChange={() => toggleFeature(feature)} />
                <label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer select-none">{feature}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile apply button - keep it sticky at bottom of the sheet if desired */}
        {isMobile && (
          <div className="mt-4">
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full bg-gradient-primary">
              Apply Filters
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FilterPanel;
