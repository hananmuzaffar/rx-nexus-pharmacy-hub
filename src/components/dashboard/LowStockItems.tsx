
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, PackageMinus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';

const LowStockItems = () => {
  const navigate = useNavigate();
  const { items, loading, refetch } = useInventory();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Filter items that are at or below reorder level
  const lowStockItems = items.filter(item => item.stock <= item.reorder_level).slice(0, 4);

  const handleReorder = (id: number, name: string) => {
    toast({
      title: "Reorder initiated",
      description: `Added ${name} to your purchase order list.`,
    });
  };

  const handleViewAll = () => {
    navigate("/inventory", { state: { filter: "lowStock" } });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Stock data refreshed",
        description: "Low stock inventory has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh stock data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            Loading stock data...
          </div>
        </CardContent>
      </Card>
    );
  }

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
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={handleViewAll}>
          View All <ArrowRight size={14} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {lowStockItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No low stock items found
          </div>
        ) : (
          lowStockItems.map((item) => {
            const percentRemaining = item.reorder_level > 0 ? Math.max(0, (item.stock / item.reorder_level) * 100) : 0;
            
            return (
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
                    <span>Current: {item.stock} units</span>
                    <span>Min: {item.reorder_level} units</span>
                  </div>
                  <Progress value={percentRemaining} className="h-2" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockItems;
