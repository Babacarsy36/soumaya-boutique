-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  "subCategory" TEXT,
  images TEXT[] DEFAULT '{}',
  "inStock" BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for products
-- Allow public read access
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

-- Allow authenticated users (admin) to insert, update, delete
CREATE POLICY "Authenticated users can insert products" 
ON products FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" 
ON products FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" 
ON products FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create policies for categories
-- Allow public read access
CREATE POLICY "Public categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

-- Allow authenticated users (admin) to insert, update, delete
CREATE POLICY "Authenticated users can insert categories" 
ON categories FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" 
ON categories FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" 
ON categories FOR DELETE 
USING (auth.role() = 'authenticated');

-- Storage buckets
-- Create a storage bucket for products
insert into storage.buckets (id, name, public) values ('products', 'products', true);

-- Policy to allow public access to images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Policy to allow authenticated uploads
create policy "Authenticated Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- Policy to allow authenticated updates
create policy "Authenticated Updates"
  on storage.objects for update
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- Policy to allow authenticated deletes
create policy "Authenticated Deletes"
  on storage.objects for delete
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );
