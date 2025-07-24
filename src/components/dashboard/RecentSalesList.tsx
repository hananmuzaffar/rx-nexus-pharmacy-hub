
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

interface Sale {
  id: string;
  customer: string;
  items: number;
  total: number;
  date: string;
  status: 'completed' | 'pending';
}

const RecentSalesList = () => {
  const navigate = useNavigate();
  const [recentSales, setRecentSales] = React.useState<Sale[]>([]);

  React.useEffect(() => {
    fetchRecentSales();
  }, []);

  const fetchRecentSales = async () => {
    try {
      const supabaseClient = createClient(
        "https://cqdalqkmzqkfneoeblmh.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGFscWttenFrZm5lb2VibG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTEzODMsImV4cCI6MjA1OTg2NzM4M30.JzaHcTkyuT6L4dc6U10AFDUyP9JtBAHl8YGrAq9C024"
      );
      
      const { data, error } = await supabaseClient
        .from('sales')
        .select(`
          id,
          total_amount,
          date,
          items
        `)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;

      const salesData = (data || []).map((sale: any) => ({
        id: sale.id,
        customer: 'Customer',
        items: Array.isArray(sale.items) ? sale.items.length : 0,
        total: sale.total_amount,
        date: new Date(sale.date).toISOString().split('T')[0],
        status: 'completed' as const
      }));

      setRecentSales(salesData);
    } catch (error) {
      console.error('Error fetching recent sales:', error);
    }
  };
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Recent Sales</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs gap-1"
          onClick={() => navigate('/sales')}
        >
          View All <ArrowRight size={14} />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell className="text-right">{sale.items}</TableCell>
                <TableCell className="text-right">₹{sale.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    sale.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sale.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentSalesList;
