
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SaleItem = {
  product: string;
  quantity: number;
  price: number;
  total: number;
}

type Sale = {
  id: string;
  date: string;
  customer: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
}

interface SalesTableProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ sales, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSales, setFilteredSales] = useState<Sale[]>(sales);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>(undefined);
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>(undefined);
  const [filterMinAmount, setFilterMinAmount] = useState<string>("");
  const [filterMaxAmount, setFilterMaxAmount] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    applyFilters(term, filterPaymentMethod, filterDateFrom, filterDateTo, filterMinAmount, filterMaxAmount);
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const handleFilterApply = () => {
    applyFilters(searchTerm, filterPaymentMethod, filterDateFrom, filterDateTo, filterMinAmount, filterMaxAmount);
    setIsFilterOpen(false);
    
    toast({
      title: "Filters Applied",
      description: "Sales data has been filtered according to your criteria",
    });
  };

  const handleFilterReset = () => {
    setFilterPaymentMethod("");
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setFilterMinAmount("");
    setFilterMaxAmount("");
    
    setFilteredSales(sales.filter(sale => 
      sale.id.toLowerCase().includes(searchTerm) || 
      sale.customer.toLowerCase().includes(searchTerm)
    ));
    
    setIsFilterOpen(false);
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };

  const handleExportData = () => {
    // In a real app, this would trigger a CSV or PDF export
    const data = filteredSales.map(sale => ({
      id: sale.id,
      date: new Date(sale.date).toLocaleDateString(),
      customer: sale.customer,
      items: sale.items.length,
      totalAmount: `₹${sale.totalAmount.toFixed(2)}`,
      paymentMethod: sale.paymentMethod
    }));
    
    console.log('Exporting data:', data);
    
    toast({
      title: "Export Data",
      description: "Sales data exported successfully",
    });
  };

  const applyFilters = (
    term: string, 
    paymentMethod: string, 
    dateFrom?: Date, 
    dateTo?: Date,
    minAmount?: string,
    maxAmount?: string
  ) => {
    let filtered = [...sales];
    
    // Search term filter
    if (term) {
      filtered = filtered.filter(sale => 
        sale.id.toLowerCase().includes(term) || 
        sale.customer.toLowerCase().includes(term)
      );
    }
    
    // Payment method filter
    if (paymentMethod) {
      filtered = filtered.filter(sale => sale.paymentMethod === paymentMethod);
    }
    
    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(sale => new Date(sale.date) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(sale => new Date(sale.date) <= toDate);
    }
    
    // Amount range filter
    if (minAmount && !isNaN(parseFloat(minAmount))) {
      filtered = filtered.filter(sale => sale.totalAmount >= parseFloat(minAmount));
    }
    
    if (maxAmount && !isNaN(parseFloat(maxAmount))) {
      filtered = filtered.filter(sale => sale.totalAmount <= parseFloat(maxAmount));
    }
    
    setFilteredSales(filtered);
  };

  // Update filtered sales when original list changes
  useEffect(() => {
    applyFilters(searchTerm, filterPaymentMethod, filterDateFrom, filterDateTo, filterMinAmount, filterMaxAmount);
  }, [sales]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search sales..." 
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr>
              <th className="h-10 px-4 text-left align-middle font-medium">Sale ID</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Date</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Customer</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Items</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Total Amount</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Payment Method</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-2 align-middle">{sale.id}</td>
                  <td className="p-2 align-middle">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="p-2 align-middle">{sale.customer}</td>
                  <td className="p-2 align-middle">{sale.items.length} items</td>
                  <td className="p-2 align-middle">₹{sale.totalAmount.toFixed(2)}</td>
                  <td className="p-2 align-middle">{sale.paymentMethod}</td>
                  <td className="p-2 align-middle">
                    <Button variant="ghost" size="sm" onClick={() => onView(sale)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-muted-foreground">
                  No sales found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Sales</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select 
                value={filterPaymentMethod} 
                onValueChange={setFilterPaymentMethod}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="All payment methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All payment methods</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex-1">
                  <Label htmlFor="date-from" className="text-xs">From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDateFrom ? format(filterDateFrom, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filterDateFrom}
                        onSelect={setFilterDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="date-to" className="text-xs">To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDateTo ? format(filterDateTo, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filterDateTo}
                        onSelect={setFilterDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="flex items-center space-x-2">
                <div>
                  <Label htmlFor="min-amount" className="text-xs">Min (₹)</Label>
                  <Input
                    id="min-amount"
                    type="number"
                    value={filterMinAmount}
                    onChange={e => setFilterMinAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="max-amount" className="text-xs">Max (₹)</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    value={filterMaxAmount}
                    onChange={e => setFilterMaxAmount(e.target.value)}
                    placeholder="1000.00"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleFilterReset}>
              Reset
            </Button>
            <Button onClick={handleFilterApply}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesTable;
