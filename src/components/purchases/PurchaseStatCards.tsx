
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PurchaseStatsProps {
  pendingOrdersCount: number;
  totalPurchases: number;
  averageProcessingDays: number;
}

const PurchaseStatCards: React.FC<PurchaseStatsProps> = ({ 
  pendingOrdersCount, 
  totalPurchases,
  averageProcessingDays
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pendingOrdersCount}
          </div>
          <p className="text-xs text-muted-foreground">Awaiting delivery</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">This Month's Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{totalPurchases.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg. Order Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageProcessingDays} days</div>
          <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseStatCards;
