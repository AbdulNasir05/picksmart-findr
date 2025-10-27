import { Smartphone } from "lucide-react";
import { CategoryPage } from "@/components/CategoryPage";
import mobilesData from "@/data/mobiles.json";

const Mobiles = () => {
  // Mark some devices as bestsellers and recommended for demonstration
  const processedMobiles = mobilesData.map((mobile: any, index: number) => ({
    ...mobile,
    bestseller: index % 5 === 0, // Every 5th device is a bestseller
    recommended: index % 7 === 0, // Every 7th device is recommended
  }));

  return (
    <CategoryPage
      title="Mobiles"
      icon={Smartphone}
      category="mobile"
      categoryKey="phone"
      devices={processedMobiles}
    />
  );
};

export default Mobiles;
