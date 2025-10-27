import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Laptop, Tablet, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  {
    id: "phone",
    name: "Phones",
    icon: Smartphone,
    description: "Find the perfect smartphone for your needs",
    gradient: "from-purple-500 to-blue-500"
  },
  {
    id: "laptop",
    name: "Laptops",
    icon: Laptop,
    description: "Discover powerful laptops for work and play",
    gradient: "from-blue-500 to-teal-500"
  },
  {
    id: "tablet",
    name: "Tablets",
    icon: Tablet,
    description: "Explore versatile tablets for productivity",
    gradient: "from-teal-500 to-green-500"
  }
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    const routeMap: { [key: string]: string } = {
      phone: "/mobiles",
      laptop: "/laptops",
      tablet: "/tablets",
    };
    navigate(routeMap[categoryId] || `/products/${categoryId}`);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">PickSmart</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/account")}>
                <User className="w-4 h-4 mr-2" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Category</h2>
          <p className="text-lg text-muted-foreground">Select a product category to start exploring</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group cursor-pointer p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 hover:border-primary"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center mb-3">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-center">
                  {category.description}
                </p>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Categories;
