
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Sale = {
  id: string;
  customer_id?: number;
  date: string;
  items: any[];
  total_amount: number;
  payment_method?: string;
  created_at?: string;
};

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error: any) {
      console.error('Error fetching sales:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (sale: Omit<Sale, 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single();

      if (error) throw error;
      
      setSales(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Sale recorded successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error adding sale:', error);
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getSalesByCustomerId = (customerId: number) => {
    return sales.filter(sale => sale.customer_id === customerId);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    addSale,
    getSalesByCustomerId,
    refetch: fetchSales
  };
};
