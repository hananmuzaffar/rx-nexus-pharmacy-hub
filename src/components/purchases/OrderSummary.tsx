
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Package, X } from "lucide-react";

type OrderItem = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unitCost: number;
  total: number;
}

interface OrderSummaryProps {
  orderItems: OrderItem[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  orderTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  orderItems, 
  onQuantityChange, 
  onRemoveItem,
  orderTotal 
}) => {
  if (orderItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Package className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium">No Products Added</h3>
        <p className="text-sm text-muted-foreground">
          Go to the Products tab to add items to this order.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr>
              <th className="h-10 px-4 text-left align-middle font-medium">Product</th>
              <th className="h-10 px-4 text-left align-middle font-medium">SKU</th>
              <th className="h-10 px-4 text-center align-middle font-medium">Quantity</th>
              <th className="h-10 px-4 text-right align-middle font-medium">Unit Cost</th>
              <th className="h-10 px-4 text-right align-middle font-medium">Total</th>
              <th className="h-10 px-4 text-center align-middle font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.sku}</td>
                <td className="p-2 text-center">
                  <div className="flex items-center justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td className="p-2 text-right">₹{item.unitCost.toFixed(2)}</td>
                <td className="p-2 text-right">₹{item.total.toFixed(2)}</td>
                <td className="p-2 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="p-2 text-right font-medium">
                Total Cost:
              </td>
              <td className="p-2 text-right font-bold">
                ₹{orderTotal.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-muted-foreground">
            Expected Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Set Delivery Date
          </Button>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
