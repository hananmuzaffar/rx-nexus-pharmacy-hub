
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, AlertTriangle, Clock, ListPlus } from "lucide-react";
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryFormDialog from '@/components/inventory/InventoryFormDialog';
import CategoryManagementDialog from '@/components/inventory/CategoryManagementDialog';
import { toast } from "@/hooks/use-toast";
import { useInventoryStore } from '@/stores/inventoryStore';

const Inventory = () => {
  const { items, addItem, updateItem, deleteItem } = useInventoryStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false);
  const [isManufacturersDialogOpen, setIsManufacturersDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | undefined>(undefined);

  // Calculate inventory stats
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.stock * item.unitPrice), 0).toFixed(2);
  const lowStockItems = items.filter(item => item.stock <= item.reorderLevel).length;
  
  const today = new Date();
  const expiringSoonItems = items.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90;
  }).length;

  const handleAddItem = (newItem: any) => {
    const id = Math.max(0, ...items.map(item => item.id)) + 1;
    const itemWithId = { ...newItem, id } as any;
    addItem(itemWithId);
    toast({
      title: "Item Added",
      description: "The new inventory item has been added successfully.",
    });
  };

  const handleEditItem = (updatedItem: any) => {
    if (!updatedItem.id) return;
    
    updateItem(updatedItem as any);
    
    toast({
      title: "Item Updated",
      description: "The inventory item has been updated successfully.",
    });
  };

  const handleDeleteItem = (id: number) => {
    deleteItem(id);
    toast({
      title: "Item Deleted",
      description: "The inventory item has been removed successfully.",
    });
  };

  const openEditDialog = (item: any) => {
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };

  const handleManageCategories = () => {
    setIsCategoriesDialogOpen(true);
  };
  
  const handleManageManufacturers = () => {
    setIsManufacturersDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleManageCategories}>
            <ListPlus className="mr-2 h-4 w-4" />
            Categories
          </Button>
          <Button variant="outline" onClick={handleManageManufacturers}>
            <ListPlus className="mr-2 h-4 w-4" />
            Manufacturers
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2 text-primary" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">items in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue}</div>
            <p className="text-xs text-muted-foreground">retail value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-red-500" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSoonItems}</div>
            <p className="text-xs text-muted-foreground">within next 90 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your pharmacy inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable 
            items={items} 
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
          />
        </CardContent>
      </Card>

      <InventoryFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddItem}
      />

      <InventoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditItem}
        item={currentItem}
      />
      
      <CategoryManagementDialog
        open={isCategoriesDialogOpen}
        onClose={() => setIsCategoriesDialogOpen(false)}
        type="categories"
      />
      
      <CategoryManagementDialog
        open={isManufacturersDialogOpen}
        onClose={() => setIsManufacturersDialogOpen(false)}
        type="manufacturers"
      />
    </div>
  );
};

export default Inventory;
