
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Sale {
  id: string;
  customer: string;
  items: number;
  total: number;
  date: string;
  status: 'completed' | 'pending';
}

const recentSales: Sale[] = [
  { id: 'INV-001', customer: 'Mohammd Hanan', items: 3, total: 89.97, date: '2025-04-06', status: 'completed' },
  { id: 'INV-002', customer: 'Uzaid Showkat', items: 2, total: 124.50, date: '2025-04-06', status: 'completed' },
  { id: 'INV-003', customer: 'Tahoora Tanveer', items: 5, total: 215.75, date: '2025-04-05', status: 'completed' },
  { id: 'INV-004', customer: 'Najma Naseer', items: 1, total: 45.99, date: '2025-04-05', status: 'pending' },
  { id: 'INV-005', customer: 'Test User', items: 4, total: 156.80, date: '2025-04-04', status: 'completed' },
];

const RecentSalesList = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Recent Sales</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs gap-1">
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
