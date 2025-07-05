
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package, FileText } from "lucide-react";
import SalesChart from '@/components/dashboard/SalesChart';
import RecentSalesList from '@/components/dashboard/RecentSalesList';
import LowStockItems from '@/components/dashboard/LowStockItems';
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts';
import MetricCard from '@/components/dashboard/MetricCard';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard = () => {
  const {
    totalSales,
    totalCustomers,
    lowStockItems,
    totalPrescriptions,
    recentSales,
    expiringItems,
    salesData,
    loading
  } = useDashboard();

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your pharmacy.</p>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sales"
          value={`₹${totalSales.toFixed(2)}`}
          description="Total revenue"
          icon={DollarSign}
          trend={+12.5}
        />
        <MetricCard
          title="Customers"
          value={totalCustomers.toString()}
          description="Active customers"
          icon={Users}
          trend={+2.1}
        />
        <MetricCard
          title="Low Stock"
          value={lowStockItems.toString()}
          description="Items need reorder"
          icon={Package}
          trend={-4.3}
        />
        <MetricCard
          title="Prescriptions"
          value={totalPrescriptions.toString()}
          description="Active prescriptions"
          icon={FileText}
          trend={+8.2}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Last 7 days sales performance</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={salesData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSalesList sales={recentSales} />
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <LowStockItems />
        <ExpiryAlerts items={expiringItems} />
      </div>
    </div>
  );
};

export default Dashboard;
