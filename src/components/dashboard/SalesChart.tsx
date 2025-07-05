
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SalesChartProps {
  data?: any[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  // Default fallback data if no data is provided
  const defaultDailyData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 4500 },
    { name: 'Fri', sales: 6000 },
    { name: 'Sat', sales: 7200 },
    { name: 'Sun', sales: 3800 },
  ];

  const weeklyData = [
    { name: 'Week 1', sales: 28000 },
    { name: 'Week 2', sales: 32000 },
    { name: 'Week 3', sales: 26000 },
    { name: 'Week 4', sales: 35000 },
  ];

  const monthlyData = [
    { name: 'Jan', sales: 120000 },
    { name: 'Feb', sales: 95000 },
    { name: 'Mar', sales: 110000 },
    { name: 'Apr', sales: 135000 },
  ];

  // Use provided data or fallback to default
  const chartData = data && data.length > 0 ? data : defaultDailyData;

  return (
    <Tabs defaultValue="daily">
      <TabsList className="mb-4">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
      
      <TabsContent value="daily">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Sales']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="sales" fill="#0e99eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="weekly">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Sales']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="sales" fill="#0e99eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="monthly">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Sales']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="sales" fill="#0e99eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SalesChart;
