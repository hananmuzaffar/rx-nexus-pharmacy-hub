
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Truck, FileCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PurchaseOrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface PurchaseOrder {
  id: string;
  date: string;
  supplier: string;
  status: string;
  total: number;
  items: PurchaseOrderItem[];
}

interface ViewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PurchaseOrder;
}

const ViewOrderDialog: React.FC<ViewOrderDialogProps> = ({ open, onOpenChange, order }) => {
  // Format currency 
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">Purchase Order: {order.id}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                <Calendar className="inline-block h-4 w-4 mr-1" />
                {formatDate(order.date)}
              </p>
            </div>
            <Badge 
              variant={order.status === "Received" ? "default" : 
                      order.status === "In Transit" ? "secondary" : "outline"}
              className="capitalize"
            >
              {order.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 my-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm mb-1">Supplier</h3>
              <p className="text-lg">{order.supplier}</p>
            </div>
            <div className="text-right">
              <h3 className="font-medium text-sm mb-1">Total Amount</h3>
              <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-3">Order Items</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/50">
                  <tr>
                    <th className="h-10 px-4 text-left align-middle font-medium">Product</th>
                    <th className="h-10 px-4 text-center align-middle font-medium">Quantity</th>
                    <th className="h-10 px-4 text-right align-middle font-medium">Unit Price</th>
                    <th className="h-10 px-4 text-right align-middle font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="p-2 text-right font-medium">
                      Total Amount:
                    </td>
                    <td className="p-2 text-right font-bold">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <FileCheck className="h-4 w-4 mr-2" />
                Print Order
              </Button>
            </div>
            <div className="flex items-center">
              {order.status !== "Received" && (
                <Button variant="secondary" size="sm" className="mr-2">
                  <Truck className="h-4 w-4 mr-2" />
                  Mark as Received
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;
