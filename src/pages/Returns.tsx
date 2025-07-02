import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RotateCcw, AlertCircle, CheckCircle, Download } from "lucide-react";
import { returns } from '@/components/purchases/PurchaseData';
import ReturnsTable from '@/components/returns/ReturnsTable';
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';

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

const Returns = () => {
  const [returnsList, setReturnsList] = useState<Return[]>(returns);
  const [isNewReturnOpen, setIsNewReturnOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isViewReturnOpen, setIsViewReturnOpen] = useState(false);
  
  const [newReturnProduct, setNewReturnProduct] = useState('');
  const [newReturnCustomer, setNewReturnCustomer] = useState('');
  const [newReturnQuantity, setNewReturnQuantity] = useState('1');
  const [newReturnReason, setNewReturnReason] = useState('Defective');
  const [newReturnAmount, setNewReturnAmount] = useState('');

  const pendingReturns = returnsList.filter(item => item.status === "pending").length;
  const processedReturns = returnsList.filter(item => item.status === "processed").length;
  
  const totalRefundAmount = returnsList
    .filter(item => item.status === "processed")
    .reduce((sum, item) => sum + item.refundAmount, 0);

  const handleProcessReturn = (returnId: string) => {
    setReturnsList(returnsList.map(item => 
      item.id === returnId ? { ...item, status: "processed" } : item
    ));
    
    toast({
      title: "Return Processed",
      description: `Return ${returnId} has been successfully processed.`,
    });
  };

  const handleViewReturn = (returnData: Return) => {
    setSelectedReturn(returnData);
    setIsViewReturnOpen(true);
  };
  
  const handleExportReturns = () => {
    toast({
      title: "Exporting Returns",
      description: "Generating returns report for download...",
    });
    
    const headers = "ID,Product,Customer,Quantity,Reason,Date,Status,Refund Amount\n";
    const rows = returnsList.map(item => 
      `${item.id},${item.product},${item.customer},${item.quantity},"${item.reason}",${item.date},${item.status},${item.refundAmount}`
    ).join('\n');
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "returns_report.csv");
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleCreateNewReturn = () => {
    setIsNewReturnOpen(true);
  };
  
  const handleSaveNewReturn = () => {
    if (!newReturnProduct || !newReturnCustomer || !newReturnReason || !newReturnAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const quantity = parseInt(newReturnQuantity);
    const refundAmount = parseFloat(newReturnAmount);
    
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(refundAmount) || refundAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid refund amount greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    const newReturn: Return = {
      id: uuidv4().substring(0, 8),
      product: newReturnProduct,
      customer: newReturnCustomer,
      quantity: quantity,
      reason: newReturnReason,
      date: new Date().toISOString(),
      status: "pending",
      refundAmount: refundAmount
    };
    
    setReturnsList([newReturn, ...returnsList]);
    resetNewReturnForm();
    setIsNewReturnOpen(false);
    
    toast({
      title: "Return Created",
      description: `Return ${newReturn.id} has been created successfully`,
    });
  };
  
  const resetNewReturnForm = () => {
    setNewReturnProduct('');
    setNewReturnCustomer('');
    setNewReturnQuantity('1');
    setNewReturnReason('Defective');
    setNewReturnAmount('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Returns Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReturns}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreateNewReturn}>
            <Plus className="mr-2 h-4 w-4" />
            New Return
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <RotateCcw className="h-4 w-4 mr-2 text-primary" />
              Total Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnsList.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              Pending Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReturns}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Processed Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedReturns}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Refunded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRefundAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Returns Queue</CardTitle>
          <CardDescription>Manage product returns and refunds</CardDescription>
        </CardHeader>
        <CardContent>
          <ReturnsTable 
            returns={returnsList}
            onProcess={handleProcessReturn}
            onView={handleViewReturn}
          />
        </CardContent>
      </Card>
      
      <Dialog open={isNewReturnOpen} onOpenChange={setIsNewReturnOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Return</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Input
                id="product"
                value={newReturnProduct}
                onChange={(e) => setNewReturnProduct(e.target.value)}
                placeholder="Product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={newReturnCustomer}
                onChange={(e) => setNewReturnCustomer(e.target.value)}
                placeholder="Customer name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newReturnQuantity}
                  onChange={(e) => setNewReturnQuantity(e.target.value)}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refund-amount">Refund Amount (₹)</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  value={newReturnAmount}
                  onChange={(e) => setNewReturnAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select
                value={newReturnReason}
                onValueChange={setNewReturnReason}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Defective">Defective</SelectItem>
                  <SelectItem value="Wrong Product">Wrong Product</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Customer Dissatisfied">Customer Dissatisfied</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewReturnOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewReturn}>
              Create Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewReturnOpen} onOpenChange={setIsViewReturnOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Return Details</DialogTitle>
          </DialogHeader>
          
          {selectedReturn && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Return ID:</div>
                <div className="col-span-2">{selectedReturn.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Product:</div>
                <div className="col-span-2">{selectedReturn.product}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Customer:</div>
                <div className="col-span-2">{selectedReturn.customer}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Quantity:</div>
                <div className="col-span-2">{selectedReturn.quantity}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Reason:</div>
                <div className="col-span-2">{selectedReturn.reason}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Date:</div>
                <div className="col-span-2">{new Date(selectedReturn.date).toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    selectedReturn.status === "pending"
                      ? "bg-amber-500 text-white"
                      : "bg-green-500 text-white"
                  }`}>
                    {selectedReturn.status === "pending" ? "Pending" : "Processed"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Refund Amount:</div>
                <div className="col-span-2">₹{selectedReturn.refundAmount.toFixed(2)}</div>
              </div>
              
              {selectedReturn.status === "pending" && (
                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      handleProcessReturn(selectedReturn.id);
                      setIsViewReturnOpen(false);
                    }}
                  >
                    Process Return
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsViewReturnOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Returns;
