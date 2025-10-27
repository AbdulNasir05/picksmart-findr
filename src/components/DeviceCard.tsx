import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";

interface DeviceCardProps {
  device: {
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
  };
  category: "mobile" | "laptop" | "tablet";
}

export const DeviceCard = ({ device, category }: DeviceCardProps) => {
  const amazonPrice = device["Amazon Price"] || 0;
  const flipkartPrice = device["Flipkart Price"] || device["Flipkart prices"] || amazonPrice || 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card">
      {/* Product Image */}
      <div className="relative h-64 bg-muted/50 flex items-center justify-center p-4">
        <img
          src={device.image}
          alt={`${device.brand} ${device.model}`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
        {device.ratings && (
          <Badge className="absolute top-4 right-4 bg-primary/90">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {device.ratings}
          </Badge>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Brand & Model */}
        <div>
          <h3 className="text-xl font-semibold text-foreground">{device.brand}</h3>
          <p className="text-sm text-muted-foreground">{device.model}</p>
        </div>

        {/* Key Specifications */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {device.ram && (
            <div>
              <span className="text-muted-foreground">RAM:</span>
              <span className="ml-2 text-foreground font-medium">{device.ram}</span>
            </div>
          )}
          {device.storage && (
            <div>
              <span className="text-muted-foreground">Storage:</span>
              <span className="ml-2 text-foreground font-medium">{device.storage}</span>
            </div>
          )}
          {device.processor && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Processor:</span>
              <span className="ml-2 text-foreground font-medium">{device.processor}</span>
            </div>
          )}
          {device.graphics && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Graphics:</span>
              <span className="ml-2 text-foreground font-medium">{device.graphics}</span>
            </div>
          )}
          {device.camera && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Camera:</span>
              <span className="ml-2 text-foreground font-medium">{device.camera}</span>
            </div>
          )}
          {device.display && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Display:</span>
              <span className="ml-2 text-foreground font-medium">{device.display}</span>
            </div>
          )}
          {device.battery && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Battery:</span>
              <span className="ml-2 text-foreground font-medium">{device.battery}</span>
            </div>
          )}
          {device.os && (
            <div className="col-span-2">
              <span className="text-muted-foreground">OS:</span>
              <span className="ml-2 text-foreground font-medium">{device.os}</span>
            </div>
          )}
        </div>

        {/* Key Features */}
        {device.key_features && device.key_features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {device.key_features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        )}

        {/* Best Deal Section */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold text-foreground mb-3">Best Deal</h4>
          
          {/* Amazon Deal */}
          <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">Amazon</span>
              {device.ratings && (
                <span className="flex items-center text-sm text-muted-foreground">
                  <Star className="w-3 h-3 mr-1 fill-current text-primary" />
                  {device.ratings} rating
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-primary mb-1">
              {amazonPrice > 0 ? `₹${amazonPrice.toLocaleString('en-IN')}` : 'Price not available'}
            </p>
            <p className="text-xs text-muted-foreground mb-2">Delivery in 2 days • In Stock</p>
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => window.open(device.Amazon, '_blank')}
            >
              Buy Now <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Flipkart Deal */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">Flipkart</span>
              {device.ratings && (
                <span className="flex items-center text-sm text-muted-foreground">
                  <Star className="w-3 h-3 mr-1 fill-current text-primary" />
                  {device.ratings} rating
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-primary mb-1">
              {flipkartPrice > 0 ? `₹${flipkartPrice.toLocaleString('en-IN')}` : 'Price not available'}
            </p>
            <p className="text-xs text-muted-foreground mb-2">Delivery in 3 days • In Stock</p>
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => window.open(device.Flipkart, '_blank')}
            >
              Buy Now <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
