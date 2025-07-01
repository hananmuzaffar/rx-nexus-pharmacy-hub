
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type InventoryItem = {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  expiryDate: string;
}

interface InventoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Partial<InventoryItem>) => void;
  item?: InventoryItem;
}

const CATEGORIES = [
  "Analgesics",
  "Antibiotics",
  "Antihistamines",
  "Gastrointestinal",
  "Anti-inflammatory",
  "Cardiovascular",
  "Respiratory",
  "Dermatological",
  "Vitamins",
  "Other"
];

const InventoryFormDialog: React.FC<InventoryFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  item
}) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: "",
    sku: "",
    category: "",
    stock: 0,
    reorderLevel: 0,
    unitPrice: 0,
    expiryDate: new Date().toISOString().split('T')[0]
  });

  // Initialize form with item data when editing
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        stock: item.stock,
        reorderLevel: item.reorderLevel,
        unitPrice: item.unitPrice,
        expiryDate: item.expiryDate
      });
    } else {
      // Reset form for new item
      setFormData({
        name: "",
        sku: "",
        category: "",
        stock: 0,
        reorderLevel: 0,
        unitPrice: 0,
        expiryDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [item, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Inventory Item" : "Add New Item"}</DialogTitle>
          <DialogDescription>
            {item ? "Update the details of this inventory item." : "Add a new product to your inventory."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Current Stock</Label>
                <Input 
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input 
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                <Input 
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {item ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;
