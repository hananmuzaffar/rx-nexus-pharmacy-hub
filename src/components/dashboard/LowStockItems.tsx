
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, PackageMinus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  percentRemaining: number;
}

const lowStockItems: StockItem[] = [
  { id: 'MED101', name: 'Paracetamol 500mg', currentStock: 15, minStock: 50, percentRemaining: 30 },
  { id: 'MED102', name: 'Ibuprofen 400mg', currentStock: 10, minStock: 40, percentRemaining: 25 },
  { id: 'MED103', name: 'Cetirizine 10mg', currentStock: 5, minStock: 30, percentRemaining: 16 },
  { id: 'MED104', name: 'Omeprazole 20mg', currentStock: 8, minStock: 35, percentRemaining: 23 },
];

const LowStockItems = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleReorder = (id: string, name: string) => {
    toast({
      title: "Reorder initiated",
      description: `Added ${name} to your purchase order list.`,
    });
  };

  const handleViewAll = () => {
    navigate("/inventory", { state: { filter: "lowStock" } });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Stock data refreshed",
        description: "Low stock inventory has been updated.",
      });
    }, 1000);
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
