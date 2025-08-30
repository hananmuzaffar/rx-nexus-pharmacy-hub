import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export type Return = {
  id: string;
  product: string;
  customer: string;
  quantity: number;
  reason: string;
  date: string;
  status: string;
  refund_amount: number;
}

type ReturnsStore = {
  returns: Return[];
  isLoading: boolean;
  fetchReturns: () => Promise<void>;
  addReturn: (returnData: Omit<Return, 'id'>) => Promise<void>;
  updateReturn: (returnData: Return) => Promise<void>;
  deleteReturn: (id: string) => Promise<void>;
  getReturnById: (id: string) => Return | undefined;
  getReturnsByCustomer: (customer: string) => Return[];
  getPendingReturnsCount: () => number;
}

export const useReturnsStore = create<ReturnsStore>((set, get) => ({
  returns: [],
  isLoading: false,
  
  fetchReturns: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('returns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        set({ returns: data, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
      set({ isLoading: false });
    }
  },
  
  addReturn: async (returnData) => {
    try {
      const { data, error } = await supabase
        .from('returns')
        .insert({
          product: returnData.product,
          customer: returnData.customer,
          quantity: returnData.quantity,
          reason: returnData.reason,
          refund_amount: returnData.refund_amount,
          status: returnData.status || 'pending',
          date: returnData.date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        returns: [data, ...state.returns]
      }));
    } catch (error) {
      console.error('Error adding return:', error);
      throw error;
    }
  },
  
  updateReturn: async (returnData) => {
    try {
      const { error } = await supabase
        .from('returns')
        .update({
          product: returnData.product,
          customer: returnData.customer,
          quantity: returnData.quantity,
          reason: returnData.reason,
          date: returnData.date,
          status: returnData.status,
          refund_amount: returnData.refund_amount,
        })
        .eq('id', returnData.id);
      
      if (error) throw error;
      
      set((state) => ({
        returns: state.returns.map((r) => 
          r.id === returnData.id ? returnData : r
        )
      }));
    } catch (error) {
      console.error('Error updating return:', error);
      throw error;
    }
  },
  
  deleteReturn: async (id) => {
    try {
      const { error } = await supabase
        .from('returns')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        returns: state.returns.filter((r) => r.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting return:', error);
      throw error;
    }
  },
  
  getReturnById: (id) => {
    return get().returns.find(ret => ret.id === id);
  },
  
  getReturnsByCustomer: (customer) => {
    return get().returns.filter(ret => ret.customer === customer);
  },
  
  getPendingReturnsCount: () => {
    return get().returns.filter(r => r.status === 'pending').length;
  }
}));