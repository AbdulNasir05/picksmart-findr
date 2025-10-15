import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

interface FilterPanelProps {
  category: string;
}

const FilterPanel = ({ category }: FilterPanelProps) => {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const brands = category === "phone" 
    ? ["Apple", "Samsung", "Google", "OnePlus"]
    : category === "laptop"
    ? ["Apple", "Dell", "HP", "Lenovo"]
    : ["Apple", "Samsung", "Microsoft", "Lenovo"];

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
  };

  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Filters</h3>
        {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000) && (
          <button 
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filters */}
      {selectedBrands.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedBrands.map(brand => (
            <Badge key={brand} variant="secondary" className="gap-1">
              {brand}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleBrand(brand)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Brand Filter */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Brand</Label>
        <div className="space-y-3">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <label
                htmlFor={brand}
                className="text-sm cursor-pointer select-none"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={2000}
          step={50}
          className="mb-2"
        />
      </div>
    </Card>
  );
};

export default FilterPanel;
