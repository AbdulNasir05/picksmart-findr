import { Laptop } from "lucide-react";
import { CategoryPage } from "@/components/CategoryPage";
import laptopsData from "@/data/laptops.json";

const Laptops = () => {
  // Mark some devices as bestsellers and recommended for demonstration
  const processedLaptops = laptopsData.map((laptop: any, index: number) => ({
    ...laptop,
    bestseller: index % 5 === 0,
    recommended: index % 7 === 0,
  }));

  return (
    <CategoryPage
      title="Laptops"
      icon={Laptop}
      category="laptop"
      categoryKey="laptop"
      devices={processedLaptops}
    />
  );
};

export default Laptops;
