
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductList from "@/components/purchases/ProductList";
import OrderSummary from "@/components/purchases/OrderSummary";
import { Supplier } from '@/stores/supplierStore';

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitCost: number;
};

type OrderItem = Product & {
  quantity: number;
  total: number;
};

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

interface NewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  onCreateOrder: (order: PurchaseOrder) => void;
}

const NewOrderDialog: React.FC<NewOrderDialogProps> = ({
  open,
  onOpenChange,
  suppliers,
  onCreateOrder
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("products");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [productSearch, setProductSearch] = useState<string>("");

  // Mock products for demo
  const products: Product[] = [
    { id: 1, name: "Acetaminophen 500mg", sku: "MED001", category: "Pain Relief", unitCost: 25.99 },
    { id: 2, name: "Amoxicillin 250mg", sku: "ANT001", category: "Antibiotics", unitCost: 42.50 },
    { id: 3, name: "Lisinopril 10mg", sku: "CAR001", category: "Cardiovascular", unitCost: 18.95 },
    { id: 4, name: "Metformin 500mg", sku: "DIB001", category: "Diabetes", unitCost: 15.20 },
    { id: 5, name: "Atorvastatin 40mg", sku: "CHO001", category: "Cholesterol", unitCost: 19.95 },
    { id: 6, name: "Aspirin 81mg", sku: "PAI002", category: "Pain Relief", unitCost: 8.99 },
    { id: 7, name: "Ibuprofen 200mg", sku: "PAI003", category: "Pain Relief", unitCost: 12.45 },
    { id: 8, name: "Omeprazole 20mg", sku: "GAS001", category: "Gastrointestinal", unitCost: 29.75 },
  ];

  // Reset form when dialog opens
  useEffect(() => {
    if (!open) {
      setSelectedSupplier("");
      setOrderItems([]);
      setProductSearch("");
      setSelectedTab("products");
    }
  }, [open]);

  // Filtered products based on search
  const filteredProducts = productSearch 
    ? products.filter(product => 
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(productSearch.toLowerCase())
      )
    : products;

  // Handle adding product to order
  const addProductToOrder = (product: Product) => {
    const existingItem = orderItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitCost } 
          : item
      ));
    } else {
      setOrderItems([
        ...orderItems,
        { 
          ...product,
          quantity: 1,
          total: product.unitCost
        }
      ]);
    }
  };

  // Handle updating product quantity
  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setOrderItems(orderItems.map(item => 
      item.id === productId 
        ? { ...item, quantity, total: quantity * item.unitCost } 
        : item
    ));
  };

  // Handle removing product from order
  const removeProductFromOrder = (productId: number) => {
    setOrderItems(orderItems.filter(item => item.id !== productId));
  };

  // Calculate order total
  const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0);

  // Handle submitting the order
  const handleCreateOrder = () => {
    if (selectedSupplier && orderItems.length > 0) {
      const supplier = suppliers.find(s => s.id.toString() === selectedSupplier);
      
      if (!supplier) return;
      
      // Create a new PurchaseOrder object
      const newOrder: PurchaseOrder = {
        id: `PO-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString().slice(0, 10),
        supplier: supplier.name,
        status: "Pending",
        total: orderTotal,
        items: orderItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.unitCost,
          total: item.total
        }))
      };
      
      onCreateOrder(newOrder);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>New Purchase Order</DialogTitle>
          <DialogDescription>
            Create a new order to purchase products from suppliers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-4 items-start gap-4 py-4">
          <div className="col-span-4">
            <Label htmlFor="supplier" className="text-sm font-medium">Select Supplier</Label>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger id="supplier" className="mt-2">
                <SelectValue placeholder="Choose a supplier" />
              </SelectTrigger>
              <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.name}
                            </SelectItem>
                          ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedSupplier && (
            <div className="col-span-4">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="products">
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="order">
                    <FileText className="h-4 w-4 mr-2" />
                    Order Summary
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="products" className="space-y-4 pt-4">
                  <ProductList
                    products={filteredProducts}
                    searchTerm={productSearch}
                    onSearchChange={setProductSearch}
                    onAddProduct={addProductToOrder}
                  />
                </TabsContent>
                
                <TabsContent value="order" className="space-y-4 pt-4">
                  <OrderSummary
                    orderItems={orderItems}
                    onQuantityChange={updateProductQuantity}
                    onRemoveItem={removeProductFromOrder}
                    orderTotal={orderTotal}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleCreateOrder}
            disabled={!selectedSupplier || orderItems.length === 0}
          >
            Create Purchase Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewOrderDialog;
