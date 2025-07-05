
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type InventoryItem = {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorder_level: number;
  unit_price: number;
  expiry_date: string;
  medicine_type?: string;
  tablets_per_strip?: number;
  strip_price?: number;
  manufacturer?: string;
  created_at?: string;
  updated_at?: string;
};

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Inventory item added successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItem = async (id: number, updates: Partial<InventoryItem>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        item.id === id ? data : item
      ));
      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to delete inventory item",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  };
};
