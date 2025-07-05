
-- Create customers table first (no dependencies)
CREATE TABLE public.customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  date_registered TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  prescriptions INTEGER DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  expiry_date DATE,
  medicine_type TEXT DEFAULT 'tablet',
  tablets_per_strip INTEGER DEFAULT 10,
  strip_price DECIMAL(10,2) DEFAULT 0,
  manufacturer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE public.sales (
  id TEXT PRIMARY KEY,
  customer_id INTEGER REFERENCES public.customers(id),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_id INTEGER REFERENCES public.customers(id),
  doctor_name TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  medications JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create e_prescriptions table
CREATE TABLE public.e_prescriptions (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_id INTEGER REFERENCES public.customers(id),
  doctor_name TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending',
  medications JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_orders table
CREATE TABLE public.purchase_orders (
  id TEXT PRIMARY KEY,
  supplier_id INTEGER REFERENCES public.suppliers(id),
  supplier_name TEXT NOT NULL,
  date TEXT NOT NULL,
  items INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create returns table
CREATE TABLE public.returns (
  id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  customer TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending',
  refund_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.e_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable all operations for all users" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.inventory_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.prescriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.e_prescriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.returns FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_inventory_sku ON public.inventory_items(sku);
CREATE INDEX idx_sales_customer ON public.sales(customer_id);
CREATE INDEX idx_prescriptions_patient ON public.prescriptions(patient_id);
CREATE INDEX idx_eprescriptions_patient ON public.e_prescriptions(patient_id);

-- Insert initial customer data
INSERT INTO public.customers (name, email, phone, address, date_registered, prescriptions, last_visit) VALUES
('John Smith', 'john.smith@example.com', '(555) 123-4567', '123 Maple Street, Anytown, ST 12345', '2024-01-15', 3, '2025-03-28'),
('Maria Rodriguez', 'maria.r@example.com', '(555) 987-6543', '456 Oak Avenue, Othertown, ST 67890', '2023-11-10', 5, '2025-04-02'),
('Robert Wilson', 'rwilson@example.com', '(555) 456-7890', '789 Elm Boulevard, Somewhere, ST 54321', '2024-02-22', 1, '2025-03-15'),
('Sarah Johnson', 'sjohnson@example.com', '(555) 789-0123', '321 Pine Drive, Nowhere, ST 09876', '2023-09-05', 7, '2025-04-05');

-- Insert initial inventory data
INSERT INTO public.inventory_items (name, sku, category, stock, reorder_level, unit_price, expiry_date, medicine_type, tablets_per_strip) VALUES
('Paracetamol 500mg', 'PCM-500', 'Analgesics', 165, 50, 4.99, '2026-01-15', 'strip', 10),
('Amoxicillin 250mg', 'AMX-250', 'Antibiotics', 42, 30, 8.50, '2025-11-20', 'strip', 10),
('Cetirizine 10mg', 'CET-10', 'Antihistamines', 87, 40, 3.25, '2025-08-30', 'strip', 10),
('Omeprazole 20mg', 'OMP-20', 'Gastrointestinal', 15, 25, 7.99, '2025-09-25', 'strip', 10),
('Ibuprofen 400mg', 'IBU-400', 'Anti-inflammatory', 120, 40, 5.49, '2026-03-10', 'strip', 10);

-- Insert initial supplier data
INSERT INTO public.suppliers (name, contact, email, phone, address) VALUES
('MedSupply Corp', 'John Smith', 'contact@medsupplycorp.com', '(555) 123-4567', '123 Medical Way, Pharma City, CA 90001'),
('Healthcare Distributors', 'Sarah Johnson', 'info@healthcaredist.com', '(555) 234-5678', '456 Pharmacy Drive, Medicine Town, NY 10001'),
('PharmWholesale Inc', 'Michael Davis', 'service@pharmwholesale.com', '(555) 345-6789', '789 Prescription Lane, Remedy City, TX 75001');
