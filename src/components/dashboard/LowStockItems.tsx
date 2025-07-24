
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, PackageMinus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  percentRemaining: number;
}

const LowStockItems = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lowStockItems, setLowStockItems] = React.useState<StockItem[]>([]);

  React.useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchLowStockItems = async () => {
    try {
      const supabaseClient = createClient(
        "https://cqdalqkmzqkfneoeblmh.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGFscWttenFrZm5lb2VibG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTEzODMsImV4cCI6MjA1OTg2NzM4M30.JzaHcTkyuT6L4dc6U10AFDUyP9JtBAHl8YGrAq9C024"
      );
      
      const { data, error } = await supabaseClient
        .from('inventory_items')
        .select('id, name, stock, reorder_level')
        .order('stock');

      if (error) throw error;

      const lowStock = (data || [])
        .filter(item => item.stock <= item.reorder_level)
        .map(item => ({
          id: item.id.toString(),
          name: item.name,
          currentStock: item.stock,
          minStock: item.reorder_level,
          percentRemaining: Math.round((item.stock / item.reorder_level) * 100)
        }))
        .slice(0, 4);

      setLowStockItems(lowStock);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    }
  };

  const handleReorder = (id: string, name: string) => {
    navigate("/purchases", { 
      state: { 
        prefilledData: {
          product: name,
          quantity: 100
        }
      }
    });
  };

  const handleViewAll = () => {
    navigate("/inventory", { state: { filter: "lowStock" } });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLowStockItems().finally(() => {
      setIsRefreshing(false);
      toast({
        title: "Stock data refreshed",
        description: "Low stock inventory has been updated.",
      });
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-lg font-medium">Low Stock Alerts</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 h-8 w-8"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            tooltip="Refresh stock data"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={handleViewAll}>
          View All <ArrowRight size={14} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {lowStockItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <PackageMinus size={16} className="text-amber-500" />
                <span className="font-medium ml-2">{item.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => handleReorder(item.id, item.name)}
              >
                Reorder
              </Button>
            </div>
            
            <div className="mb-1.5">
              <div className="flex justify-between text-xs mb-1.5">
                <span>Current: {item.currentStock} units</span>
                <span>Min: {item.minStock} units</span>
              </div>
              <Progress value={item.percentRemaining} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LowStockItems;
