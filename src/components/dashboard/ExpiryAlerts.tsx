
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

interface ExpiryItem {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  daysRemaining: number;
}

const ExpiryAlerts = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [expiryItems, setExpiryItems] = React.useState<ExpiryItem[]>([]);

  React.useEffect(() => {
    fetchExpiryItems();
  }, []);

  const fetchExpiryItems = async () => {
    try {
      const supabaseClient = createClient(
        "https://cqdalqkmzqkfneoeblmh.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGFscWttenFrZm5lb2VibG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTEzODMsImV4cCI6MjA1OTg2NzM4M30.JzaHcTkyuT6L4dc6U10AFDUyP9JtBAHl8YGrAq9C024"
      );
      
      const { data, error } = await supabaseClient
        .from('inventory_items')
        .select('id, name, stock, expiry_date')
        .not('expiry_date', 'is', null)
        .order('expiry_date');

      if (error) throw error;

      const today = new Date();
      const expiringItems = (data || [])
        .map(item => {
          const expiryDate = new Date(item.expiry_date);
          const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return {
            id: item.id.toString(),
            name: item.name,
            quantity: item.stock,
            expiryDate: item.expiry_date,
            daysRemaining
          };
        })
        .filter(item => item.daysRemaining <= 90 && item.daysRemaining >= 0)
        .slice(0, 4);

      setExpiryItems(expiringItems);
    } catch (error) {
      console.error('Error fetching expiry items:', error);
    }
  };

  const handleAction = (item: ExpiryItem) => {
    navigate("/returns", { 
      state: { 
        prefilledData: {
          product: item.name,
          reason: "Expiring soon",
          quantity: item.quantity
        }
      }
    });
  };

  const handleViewAll = () => {
    navigate("/inventory", { state: { filter: "expiringSoon" } });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchExpiryItems().finally(() => {
      setIsRefreshing(false);
      toast({
        title: "Expiry data refreshed",
        description: "Medication expiry dates have been updated.",
      });
    });
  };

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
            isLoading={isRefreshing}
            tooltip="Refresh expiry data"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={handleViewAll}>
          View All <ArrowRight size={14} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {expiryItems.map((item) => (
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
                onClick={() => handleAction(item)}
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
        ))}
      </CardContent>
    </Card>
  );
};

export default ExpiryAlerts;
