
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { sales as initialSales } from '@/components/purchases/PurchaseData';

export const useSalesStore = create((set, get) => ({
  sales: initialSales,
  isLoading: false,
  
  fetchSales: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        set({ sales: data, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      set({ isLoading: false });
    }
  },
  
  addSale: async (sale) => {
    try {
      const saleData = {
        ...sale,
        date: sale.date || new Date().toISOString(),
        payment_method: sale.paymentMethod || 'cash'
      };
      
      const { data, error } = await supabase
        .from('sales')
        .insert([saleData])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        sales: [data, ...state.sales]
      }));
      
      return data;
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  },
      
  updateSale: async (updatedSale) => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({
          customer_id: updatedSale.customer_id,
          items: updatedSale.items,
          total_amount: updatedSale.total_amount,
          payment_method: updatedSale.payment_method,
          date: updatedSale.date
        })
        .eq('id', updatedSale.id);
      
      if (error) throw error;
      
      set((state) => ({
        sales: state.sales.map((sale) => 
          sale.id === updatedSale.id ? updatedSale : sale
        )
      }));
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  },
  
  deleteSale: async (id) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        sales: state.sales.filter((sale) => sale.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  },
      
      getSaleById: (id) => {
        return get().sales.find(sale => sale.id === id);
      },
      
  getSalesByCustomerId: (customerId) => {
    return get().sales.filter(sale => sale.customer_id === customerId);
  },
      
  // Statistics for dashboard
  getTodaySales: () => {
    const today = new Date().toDateString();
    return get().sales
      .filter(sale => new Date(sale.date).toDateString() === today)
      .reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  },
  
  getMonthSales: () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return get().sales
      .filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      })
      .reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  },
  
  getUniqueCustomerCount: () => {
    const uniqueCustomers = new Set();
    get().sales.forEach(sale => {
      if (sale.customer_id) {
        uniqueCustomers.add(sale.customer_id);
      }
    });
    return uniqueCustomers.size;
  }
}));
