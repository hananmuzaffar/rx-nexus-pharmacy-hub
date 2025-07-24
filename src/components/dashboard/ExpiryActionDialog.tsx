import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface ExpiryItem {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  daysRemaining: number;
}

interface ExpiryActionDialogProps {
  open: boolean;
  onClose: () => void;
  item: ExpiryItem | null;
}

const ExpiryActionDialog = ({ open, onClose, item }: ExpiryActionDialogProps) => {
  const [action, setAction] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!action) {
      toast({
        title: "Action Required",
        description: "Please select an action to take.",
        variant: "destructive"
      });
      return;
    }

    if (action === 'return' && !quantity) {
      toast({
        title: "Quantity Required",
        description: "Please enter the quantity to return.",
        variant: "destructive"
      });
      return;
    }

    // Process the action
    const actionData = {
      item: item?.name,
      action,
      quantity: quantity ? parseInt(quantity) : item?.quantity,
      reason: reason || 'Expiring soon',
      notes,
      date: new Date().toISOString()
    };

    toast({
      title: "Action Processed",
      description: `${action === 'return' ? 'Return' : action === 'discount' ? 'Discount sale' : 'Disposal'} initiated for ${item?.name}.`,
    });

    // Reset form and close
    setAction('');
    setQuantity('');
    setReason('');
    setNotes('');
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Action Required: {item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Product: <span className="font-medium">{item.name}</span></div>
              <div>Stock: <span className="font-medium">{item.quantity} units</span></div>
              <div>Expires: <span className="font-medium">{new Date(item.expiryDate).toLocaleDateString()}</span></div>
              <div>Days Left: <span className={`font-medium ${item.daysRemaining <= 10 ? 'text-red-600' : 'text-yellow-600'}`}>
                {item.daysRemaining} days
              </span></div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Action to Take</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="return">Return to Supplier</SelectItem>
                <SelectItem value="discount">Discount Sale</SelectItem>
                <SelectItem value="dispose">Dispose Safely</SelectItem>
                <SelectItem value="monitor">Continue Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {action === 'return' && (
            <div className="space-y-2">
              <Label>Quantity to Return</Label>
              <Input
                type="number"
                min="1"
                max={item.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Max: ${item.quantity}`}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Reason</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Expiring soon, Quality issue"
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Process Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpiryActionDialog;