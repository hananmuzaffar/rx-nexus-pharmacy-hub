
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSalesStore } from '@/stores/salesStore';

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
  const { sales } = useSalesStore();
  const [recentSales, setRecentSales] = React.useState<Sale[]>([]);

  React.useEffect(() => {
    fetchRecentSales();
  }, [sales]);

  const fetchRecentSales = () => {
    const salesData = sales
      .slice(0, 5)
      .map(sale => ({
        id: sale.id,
        customer: sale.customer || 'Unknown Customer',
        items: Array.isArray(sale.items) ? sale.items.length : 0,
        total: sale.totalAmount,
        date: new Date(sale.date).toISOString().split('T')[0],
        status: 'completed' as const
      }));

    setRecentSales(salesData);
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
