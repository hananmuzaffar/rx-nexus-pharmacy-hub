
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Package, CreditCard, Clock } from 'lucide-react';

const PurchaseStats = ({ orders }) => {
  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <Package className="h-5 w-5 text-blue-500" />,
      description: 'All purchase orders'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      description: 'Awaiting delivery'
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent.toFixed(2)}`,
      icon: <CreditCard className="h-5 w-5 text-green-500" />,
      description: 'For all orders'
    },
    {
      title: 'Average Order',
      value: `₹${averageOrderValue.toFixed(2)}`,
      icon: <Truck className="h-5 w-5 text-purple-500" />,
      description: 'Per order value'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
              <div className="p-2 bg-muted rounded-full">
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PurchaseStats;
