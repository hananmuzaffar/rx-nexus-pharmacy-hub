
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { customers as initialCustomers } from '@/components/purchases/PurchaseData';

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateRegistered: string;
  prescriptions: number;
  lastVisit: string;
}

type CustomerStore = {
  customers: Customer[];
  isLoading: boolean;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  getCustomerById: (id: number) => Customer | undefined;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: initialCustomers,
  isLoading: false,
  
  fetchCustomers: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedCustomers = data.map(customer => ({
          ...customer,
          dateRegistered: new Date(customer.date_registered).toISOString().split('T')[0],
          lastVisit: new Date(customer.last_visit).toISOString().split('T')[0],
        }));
        set({ customers: formattedCustomers, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ isLoading: false });
    }
  },
  
  addCustomer: async (customerData) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const newCustomer = {
        ...data,
        dateRegistered: new Date(data.date_registered).toISOString().split('T')[0],
        lastVisit: new Date(data.last_visit).toISOString().split('T')[0],
      };
      
      set((state) => ({
        customers: [newCustomer, ...state.customers]
      }));
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },
  
  updateCustomer: async (customer) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        })
        .eq('id', customer.id);
      
      if (error) throw error;
      
      set((state) => ({
        customers: state.customers.map((c) => 
          c.id === customer.id ? customer : c
        )
      }));
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },
  
  deleteCustomer: async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },
  
  getCustomerById: (id) => {
    return get().customers.find(customer => customer.id === id);
  }
}));
