
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';

const ExpiryAlerts = () => {
  const navigate = useNavigate();
  const { items, loading, refetch } = useInventory();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Filter items expiring within 90 days
  const today = new Date();
  const expiryItems = items.filter(item => {
    if (!item.expiry_date) return false;
    const expiryDate = new Date(item.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  }).slice(0, 4).map(item => {
    const expiryDate = new Date(item.expiry_date!);
    const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: item.id.toString(),
      name: item.name,
      quantity: item.stock,
      expiryDate: item.expiry_date!,
      daysRemaining
    };
  });

  const handleAction = (itemId: string, itemName: string) => {
    toast({
      title: "Action taken",
      description: `${itemName} marked for review.`,
    });
  };

  const handleViewAll = () => {
    navigate("/inventory", { state: { filter: "expiringSoon" } });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Expiry data refreshed",
        description: "Medication expiry dates have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh expiry data.",
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
          <CardTitle className="text-lg font-medium">Expiry Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            Loading expiry data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-lg font-medium">Expiry Alerts</CardTitle>
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
        {expiryItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No items expiring soon
          </div>
        ) : (
          expiryItems.map((item) => (
            <div 
              key={item.id}
              className={`border rounded-lg p-3 ${
                item.daysRemaining <= 10 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <AlertTriangle 
                    size={16} 
                    className={item.daysRemaining <= 10 ? 'text-red-500' : 'text-yellow-500'} 
                  />
                  <span className="font-medium ml-2">{item.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-7 text-xs ${
                    item.daysRemaining <= 10 ? 'border-red-200 hover:bg-red-100' : 'border-yellow-200 hover:bg-yellow-100'
                  }`}
                  onClick={() => handleAction(item.id, item.name)}
                >
                  Action
                </Button>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantity: {item.quantity}</span>
                <span className="font-medium">
                  {item.daysRemaining <= 10 
                    ? `Expires in ${item.daysRemaining} days!` 
                    : `Expires in ${item.daysRemaining} days`
                  }
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiryAlerts;
