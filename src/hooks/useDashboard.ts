
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    totalPrescriptions: 0,
    recentSales: [],
    expiringItems: [],
    salesData: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        salesResult,
        customersResult,
        inventoryResult,
        prescriptionsResult,
        ePrescriptionsResult
      ] = await Promise.all([
        supabase.from('sales').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('customers').select('id'),
        supabase.from('inventory_items').select('*'),
        supabase.from('prescriptions').select('id'),
        supabase.from('e_prescriptions').select('id')
      ]);

      // Calculate metrics
      const totalSales = salesResult.data?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
      const totalCustomers = customersResult.data?.length || 0;
      const totalPrescriptions = (prescriptionsResult.data?.length || 0) + (ePrescriptionsResult.data?.length || 0);
      
      const lowStockItems = inventoryResult.data?.filter(item => 
        item.stock <= item.reorder_level
      ).length || 0;

      const today = new Date();
      const expiringItems = inventoryResult.data?.filter(item => {
        if (!item.expiry_date) return false;
        const expiryDate = new Date(item.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }) || [];

      // Generate sales chart data (last 7 days)
      const salesData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const daySales = salesResult.data?.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate.toDateString() === date.toDateString();
        }) || [];
        
        const dayTotal = daySales.reduce((sum, sale) => sum + sale.total_amount, 0);
        
        salesData.push({
          name: dayName,
          sales: dayTotal
        });
      }

      setDashboardData({
        totalSales,
        totalCustomers,
        lowStockItems,
        totalPrescriptions,
        recentSales: salesResult.data || [],
        expiringItems,
        salesData
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    ...dashboardData,
    loading,
    refetch: fetchDashboardData
  };
};
