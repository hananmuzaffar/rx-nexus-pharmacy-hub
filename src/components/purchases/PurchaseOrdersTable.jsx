
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const PurchaseOrdersTable = ({ 
  purchaseOrders, 
  onViewOrder 
}) => {
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            <th className="h-10 px-4 text-left align-middle font-medium">Order ID</th>
            <th className="h-10 px-4 text-left align-middle font-medium">Supplier</th>
            <th className="h-10 px-4 text-left align-middle font-medium">Date</th>
            <th className="h-10 px-4 text-left align-middle font-medium">Total Items</th>
            <th className="h-10 px-4 text-left align-middle font-medium">Total Cost</th>
            <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
            <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {purchaseOrders.map((order) => (
            <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-2 align-middle">{order.id}</td>
              <td className="p-2 align-middle">{order.supplier}</td>
              <td className="p-2 align-middle">{order.date}</td>
              <td className="p-2 align-middle">{order.items} items</td>
              <td className="p-2 align-middle">₹{order.total.toFixed(2)}</td>
              <td className="p-2 align-middle">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                  order.status === "pending"
                    ? "bg-amber-500 text-white"
                    : "bg-green-500 text-white"
                }`}>
                  {order.status === "pending" ? "Pending" : "Delivered"}
                </span>
              </td>
              <td className="p-2 align-middle">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewOrder(order.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrdersTable;
