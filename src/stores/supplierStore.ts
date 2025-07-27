
import { create } from 'zustand';

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

// Initial suppliers data
const initialSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Sunshine Pharma Distributors",
    contact: "M. Shakeel",
    email: "contact@sunshine.com",
    phone: "1234567890",
    address: "Srinagar, J&K"
  },
  {
    id: "2",
    name: "Healthcare Distributors",
    contact: "Aasif",
    email: "contact@healthcare.com",
    phone: "9876543210",
    address: "Sopore, J&K"
  },
  {
    id: "3",
    name: "MD Pharma",
    contact: "Mudasir",
    email: "contact@mdpharma.com",
    phone: "8956741230",
    address: "Srinagar, J&K"
  }
];

type SupplierStore = {
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  getSupplierById: (id: string) => Supplier | undefined;
}

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: initialSuppliers,
  
  addSupplier: (supplier) => {
    set((state) => ({
      suppliers: [...state.suppliers, supplier]
    }));
  },
  
  updateSupplier: (supplier) => {
    set((state) => ({
      suppliers: state.suppliers.map((s) => 
        s.id === supplier.id ? supplier : s
      )
    }));
  },
  
  deleteSupplier: (id) => {
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id)
    }));
  },
  
  getSupplierById: (id) => {
    return get().suppliers.find(supplier => supplier.id === id);
  }
}));
