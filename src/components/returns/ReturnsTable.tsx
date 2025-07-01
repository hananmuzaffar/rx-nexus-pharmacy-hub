
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type Return = {
  id: string;
  product: string;
  customer: string;
  quantity: number;
  reason: string;
  date: string;
  status: string;
  refundAmount: number;
}

interface ReturnsTableProps {
  returns: Return[];
  onProcess: (returnId: string) => void;
  onView: (returnData: Return) => void;
}

const ReturnsTable: React.FC<ReturnsTableProps> = ({ 
  returns,
  onProcess,
  onView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredReturns, setFilteredReturns] = useState<Return[]>(returns);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, filterStatus);
  };
  
  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    applyFilters(searchTerm, status);
  };
  
  const applyFilters = (term: string, status: string) => {
    let filtered = returns;
    
    // Apply search term filter
    if (term) {
      filtered = filtered.filter(
        item => 
          item.product.toLowerCase().includes(term) || 
          item.customer.toLowerCase().includes(term) ||
          item.id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }
    
    setFilteredReturns(filtered);
  };

  // Update filtered returns when original list changes
  useEffect(() => {
    applyFilters(searchTerm, filterStatus);
  }, [returns]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search returns..." 
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select 
            value={filterStatus}
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Returns</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr>
              <th className="h-10 px-4 text-left align-middle font-medium">Return ID</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Product</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Customer</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Quantity</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Date</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Reason</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Refund</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.length > 0 ? (
              filteredReturns.map((item) => (
                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-2 align-middle">{item.id}</td>
                  <td className="p-2 align-middle">{item.product}</td>
                  <td className="p-2 align-middle">{item.customer}</td>
                  <td className="p-2 align-middle">{item.quantity}</td>
                  <td className="p-2 align-middle">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-2 align-middle">{item.reason}</td>
                  <td className="p-2 align-middle">₹{item.refundAmount.toFixed(2)}</td>
                  <td className="p-2 align-middle">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                      item.status === "processed"
                        ? "bg-green-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}>
                      {item.status === "processed" ? "Processed" : "Pending"}
                    </span>
                  </td>
                  <td className="p-2 align-middle">
                    {item.status === "pending" ? (
                      <Button variant="outline" size="sm" onClick={() => onProcess(item.id)}>
                        Process
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => onView(item)}>
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center text-muted-foreground">
                  No returns found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnsTable;
