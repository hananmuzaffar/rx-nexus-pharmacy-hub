
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ExpiryItem {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  daysRemaining: number;
}

interface ExpiryAlertsProps {
  items?: ExpiryItem[];
}

const defaultExpiryItems: ExpiryItem[] = [
  { id: 'MED001', name: 'Amoxicillin 500mg', quantity: 200, expiryDate: '2025-05-10', daysRemaining: 30 },
  { id: 'MED002', name: 'Lisinopril 10mg', quantity: 150, expiryDate: '2025-05-15', daysRemaining: 35 },
  { id: 'MED003', name: 'Metformin 850mg', quantity: 120, expiryDate: '2025-04-20', daysRemaining: 10 },
  { id: 'MED004', name: 'Atorvastatin 20mg', quantity: 80, expiryDate: '2025-04-15', daysRemaining: 5 },
];

const ExpiryAlerts = ({ items }: ExpiryAlertsProps) => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const expiryItems = items || defaultExpiryItems;

  const handleAction = (item: ExpiryItem) => {
    toast({
      title: "Action taken",
      description: `${item.name} marked for review.`,
    });
  };

  const handleViewAll = () => {
    navigate("/inventory", { state: { filter: "expiringSoon" } });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Expiry data refreshed",
        description: "Medication expiry dates have been updated.",
      });
    }, 1000);
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
