import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  percentRemaining: number;
}

interface ReorderDialogProps {
  open: boolean;
  onClose: () => void;
  item: StockItem | null;
}

const ReorderDialog = ({ open, onClose, item }: ReorderDialogProps) => {
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('');
  const [notes, setNotes] = useState('');

  // Sample suppliers - in real app this would come from supplierStore
  const suppliers = [
    "MedSupply Co.",
    "PharmaDirect",
    "HealthSource Ltd.",
    "Medical Supplies Inc.",
    "PharmaLink"
  ];

  const handleSubmit = () => {
    if (!supplier) {
      toast({
        title: "Supplier Required",
        description: "Please select a supplier.",
        variant: "destructive"
      });
      return;
    }

    if (!quantity) {
      toast({
        title: "Quantity Required",
        description: "Please enter the quantity to order.",
        variant: "destructive"
      });
      return;
    }

    // Calculate suggested quantity based on current usage
    const suggestedQty = Math.max(item?.minStock ? item.minStock * 2 : 100, parseInt(quantity));

    // Create purchase order
    const orderData = {
      item: item?.name,
      supplier,
      quantity: parseInt(quantity),
      urgency,
      notes,
      currentStock: item?.currentStock,
      minStock: item?.minStock,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    toast({
      title: "Reorder Initiated",
      description: `Purchase order created for ${quantity} units of ${item?.name} from ${supplier}.`,
    });

    // Reset form and close
    setSupplier('');
    setQuantity('');
    setUrgency('');
    setNotes('');
    onClose();
  };

  if (!item) return null;

  // Calculate suggested order quantity
  const suggestedQuantity = Math.max(item.minStock * 2, 50);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reorder: {item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Product: <span className="font-medium">{item.name}</span></div>
              <div>Current Stock: <span className="font-medium text-amber-600">{item.currentStock} units</span></div>
              <div>Min Required: <span className="font-medium">{item.minStock} units</span></div>
              <div>Stock Level: <span className={`font-medium ${item.percentRemaining <= 25 ? 'text-red-600' : 'text-yellow-600'}`}>
                {item.percentRemaining}%
              </span></div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((sup) => (
                  <SelectItem key={sup} value={sup}>
                    {sup}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Order Quantity</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Suggested: ${suggestedQuantity} units`}
            />
            <p className="text-xs text-muted-foreground">
              Suggested: {suggestedQuantity} units (2x minimum stock)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Urgency Level</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Standard Delivery</SelectItem>
                <SelectItem value="medium">Medium - Priority Delivery</SelectItem>
                <SelectItem value="high">High - Express Delivery</SelectItem>
                <SelectItem value="critical">Critical - Emergency Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Order Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions, delivery requirements, etc."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReorderDialog;