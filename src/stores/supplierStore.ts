
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export type Supplier = {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

// Initial suppliers data
const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Sunshine Pharma Distributors",
    contact: "M. Shakeel",
    email: "contact@sunshine.com",
    phone: "1234567890",
    address: "Srinagar, J&K"
  },
  {
    id: 2,
    name: "Healthcare Distributors",
    contact: "Aasif",
    email: "contact@healthcare.com",
    phone: "9876543210",
    address: "Sopore, J&K"
  },
  {
    id: 3,
    name: "MD Pharma",
    contact: "Mudasir",
    email: "contact@mdpharma.com",
    phone: "8956741230",
    address: "Srinagar, J&K"
  }
];

type SupplierStore = {
  suppliers: Supplier[];
  isLoading: boolean;
  fetchSuppliers: () => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (supplier: Supplier) => Promise<void>;
  deleteSupplier: (id: number) => Promise<void>;
  getSupplierById: (id: number) => Supplier | undefined;
}

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: initialSuppliers,
  isLoading: false,
  
  fetchSuppliers: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        set({ suppliers: data, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      set({ isLoading: false });
    }
  },
  
  addSupplier: async (supplierData) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        suppliers: [data, ...state.suppliers]
      }));
    } catch (error) {
      console.error('Error adding supplier:', error);
      throw error;
    }
  },
  
  updateSupplier: async (supplier) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({
          name: supplier.name,
          contact: supplier.contact,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
        })
        .eq('id', supplier.id);
      
      if (error) throw error;
      
      set((state) => ({
        suppliers: state.suppliers.map((s) => 
          s.id === supplier.id ? supplier : s
        )
      }));
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  },
  
  deleteSupplier: async (id) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  },
  
  getSupplierById: (id) => {
    return get().suppliers.find(supplier => supplier.id === id);
  }
}));
