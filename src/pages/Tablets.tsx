import { Tablet } from "lucide-react";
import { CategoryPage } from "@/components/CategoryPage";
import tabletsData from "@/data/tablets.json";

const Tablets = () => {
  // Mark some devices as bestsellers and recommended for demonstration
  const processedTablets = tabletsData.map((tablet: any, index: number) => ({
    ...tablet,
    bestseller: index % 5 === 0,
    recommended: index % 7 === 0,
  }));

  return (
    <CategoryPage
      title="Tablets"
      icon={Tablet}
      category="tablet"
      categoryKey="tablet"
      devices={processedTablets}
    />
  );
};

export default Tablets;
