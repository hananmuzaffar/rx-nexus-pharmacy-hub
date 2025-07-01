
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  items, 
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(items);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredItems(items);
      return;
    }
    
    const filtered = items.filter(
      item => 
        item.name.toLowerCase().includes(term) || 
        item.sku.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
    
    setFilteredItems(filtered);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(id);
      toast({
        title: "Item deleted",
        description: "The inventory item has been removed successfully.",
      });
    }
  };

  // Recalculate filtered items when original items change
  React.useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = items.filter(
        item => 
          item.name.toLowerCase().includes(term) || 
          item.sku.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-10 px-4 text-left align-middle font-medium">Product</th>
              <th className="h-10 px-4 text-left align-middle font-medium">SKU</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Category</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Stock</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Reorder Level</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Unit Price</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Expiry Date</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                // Calculate if stock is low
                const isLowStock = item.stock <= item.reorderLevel;
                
                // Calculate if expiry date is approaching (within 90 days)
                const today = new Date();
                const expiryDate = new Date(item.expiryDate);
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = daysUntilExpiry <= 90;
                
                return (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-2 align-middle">{item.name}</td>
                    <td className="p-2 align-middle">{item.sku}</td>
                    <td className="p-2 align-middle">{item.category}</td>
                    <td className="p-2 align-middle">
                      <span className={`font-medium ${isLowStock ? 'text-red-500' : ''}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="p-2 align-middle">{item.reorderLevel}</td>
                    <td className="p-2 align-middle">₹{item.unitPrice.toFixed(2)}</td>
                    <td className="p-2 align-middle">
                      <span className={`${isExpiringSoon ? 'text-amber-500 font-medium' : ''}`}>
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-muted-foreground">
                  No inventory items found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
