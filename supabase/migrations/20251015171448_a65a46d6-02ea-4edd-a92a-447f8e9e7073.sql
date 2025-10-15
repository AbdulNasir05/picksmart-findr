-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  price INTEGER NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  image TEXT,
  specs JSONB DEFAULT '{}'::JSONB,
  features JSONB DEFAULT '[]'::JSONB,
  bestseller BOOLEAN DEFAULT FALSE,
  recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_prices table for e-commerce platform prices
CREATE TABLE public.product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  platform_url TEXT NOT NULL,
  price INTEGER NOT NULL,
  shipping_cost INTEGER DEFAULT 0,
  delivery_days INTEGER DEFAULT 3,
  rating DECIMAL(2,1) DEFAULT 4.5,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recently_viewed table
CREATE TABLE public.recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for product_prices (public read)
CREATE POLICY "Anyone can view product prices"
  ON public.product_prices FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage product prices"
  ON public.product_prices FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for recently_viewed
CREATE POLICY "Users can view own recently viewed"
  ON public.recently_viewed FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recently viewed"
  ON public.recently_viewed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recently viewed"
  ON public.recently_viewed FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recently viewed"
  ON public.recently_viewed FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (category, brand, model, price, rating, image, specs, features, bestseller, recommended) VALUES
('phone', 'Apple', 'iPhone 15 Pro', 134900, 4.8, '/placeholder.svg', '{"processor": "A17 Pro", "storage": "128GB", "display": "6.1\"", "ram": "8GB", "battery": "3274mAh", "camera": "48MP"}', '["5G", "Face ID", "Titanium Design", "Action Button"]', true, false),
('phone', 'Samsung', 'Galaxy S24 Ultra', 129999, 4.7, '/placeholder.svg', '{"processor": "Snapdragon 8 Gen 3", "storage": "256GB", "display": "6.8\"", "ram": "12GB", "battery": "5000mAh", "camera": "200MP"}', '["5G", "S Pen", "AI Features", "Gorilla Glass"]', false, true),
('phone', 'Google', 'Pixel 8 Pro', 106999, 4.6, '/placeholder.svg', '{"processor": "Tensor G3", "storage": "128GB", "display": "6.7\"", "ram": "12GB", "battery": "5050mAh", "camera": "50MP"}', '["5G", "Pure Android", "AI Camera", "7 Years Updates"]', false, false),
('phone', 'OnePlus', '12 Pro', 64999, 4.5, '/placeholder.svg', '{"processor": "Snapdragon 8 Gen 3", "storage": "256GB", "display": "6.7\"", "ram": "16GB", "battery": "5400mAh", "camera": "50MP"}', '["5G", "Fast Charging", "Hasselblad Camera", "Alert Slider"]', true, false),
('laptop', 'Apple', 'MacBook Pro 16\"', 249900, 4.9, '/placeholder.svg', '{"processor": "M3 Pro", "storage": "512GB SSD", "display": "16\"", "ram": "16GB", "battery": "22 Hours", "graphics": "Integrated"}', '["Liquid Retina XDR", "Touch ID", "Thunderbolt 4", "MagSafe"]', true, false),
('laptop', 'Dell', 'XPS 15', 179999, 4.7, '/placeholder.svg', '{"processor": "Intel i7-13700H", "storage": "1TB SSD", "display": "15.6\"", "ram": "32GB", "battery": "12 Hours", "graphics": "RTX 4050"}', '["4K Display", "Thunderbolt 4", "Wi-Fi 6E", "Carbon Fiber"]', false, true),
('laptop', 'HP', 'Spectre x360', 149999, 4.6, '/placeholder.svg', '{"processor": "Intel i7-1355U", "storage": "512GB SSD", "display": "13.5\"", "ram": "16GB", "battery": "15 Hours", "graphics": "Iris Xe"}', '["2-in-1 Convertible", "OLED", "Thunderbolt 4", "Bang & Olufsen"]', false, false),
('laptop', 'Lenovo', 'ThinkPad X1 Carbon', 169999, 4.8, '/placeholder.svg', '{"processor": "Intel i7-1355U", "storage": "1TB SSD", "display": "14\"", "ram": "16GB", "battery": "16 Hours", "graphics": "Iris Xe"}', '["Carbon Fiber", "TrackPoint", "Mil-Spec Tested", "Wi-Fi 6E"]', false, false),
('tablet', 'Apple', 'iPad Pro 12.9\"', 109900, 4.8, '/placeholder.svg', '{"processor": "M2", "storage": "256GB", "display": "12.9\"", "ram": "8GB", "battery": "10 Hours", "camera": "12MP"}', '["Face ID", "Apple Pencil", "Magic Keyboard", "Liquid Retina XDR"]', true, false),
('tablet', 'Samsung', 'Galaxy Tab S9 Ultra', 99999, 4.7, '/placeholder.svg', '{"processor": "Snapdragon 8 Gen 2", "storage": "256GB", "display": "14.6\"", "ram": "12GB", "battery": "11200mAh", "camera": "13MP"}', '["S Pen", "AMOLED", "5G", "DeX Mode"]', false, true),
('tablet', 'Microsoft', 'Surface Pro 9', 89999, 4.6, '/placeholder.svg', '{"processor": "Intel i7-1255U", "storage": "256GB", "display": "13\"", "ram": "16GB", "battery": "15 Hours", "camera": "10MP"}', '["Windows 11", "Type Cover", "Surface Pen", "Thunderbolt 4"]', false, false),
('tablet', 'Lenovo', 'Tab P12 Pro', 69999, 4.5, '/placeholder.svg', '{"processor": "Snapdragon 870", "storage": "256GB", "display": "12.6\"", "ram": "8GB", "battery": "10200mAh", "camera": "13MP"}', '["AMOLED", "Stylus", "Quad Speakers", "Productivity Mode"]', false, false);

-- Insert sample product prices
INSERT INTO public.product_prices (product_id, platform, platform_url, price, shipping_cost, delivery_days, rating, in_stock)
SELECT id, 'Amazon', 'https://amazon.in', price - 2000, 0, 2, 4.5, true FROM public.products WHERE brand = 'Apple' AND category = 'phone';

INSERT INTO public.product_prices (product_id, platform, platform_url, price, shipping_cost, delivery_days, rating, in_stock)
SELECT id, 'Flipkart', 'https://flipkart.com', price - 1000, 50, 3, 4.3, true FROM public.products WHERE brand = 'Apple' AND category = 'phone';

INSERT INTO public.product_prices (product_id, platform, platform_url, price, shipping_cost, delivery_days, rating, in_stock)
SELECT id, 'Croma', 'https://croma.com', price, 100, 4, 4.4, true FROM public.products WHERE brand = 'Apple' AND category = 'phone';