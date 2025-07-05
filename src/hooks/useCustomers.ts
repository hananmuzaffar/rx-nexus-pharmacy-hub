
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  date_registered: string;
  prescriptions: number;
  last_visit: string;
  created_at?: string;
  updated_at?: string;
};

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (error) throw error;
      
      setCustomers(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCustomer = async (id: number, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? data : customer
      ));
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers
  };
};
