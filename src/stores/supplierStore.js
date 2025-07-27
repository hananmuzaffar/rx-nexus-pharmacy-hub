
import { create } from 'zustand';

// Initial suppliers data
const initialSuppliers = [
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

export const useSupplierStore = create((set, get) => ({
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
