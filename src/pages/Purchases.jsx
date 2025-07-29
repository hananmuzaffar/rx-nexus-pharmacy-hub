
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PurchaseOrdersTable from '@/components/purchases/PurchaseOrdersTable';
import ProductList from '@/components/purchases/ProductList';
import OrderSummary from '@/components/purchases/OrderSummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSupplierStore } from '@/stores/supplierStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import PurchaseStats from '@/components/purchases/PurchaseStats';
import SupplierFormDialog from '@/components/purchases/SupplierFormDialog';

// Sample purchase orders data
const sampleOrders = [
  {
    id: 'PO-001',
    supplier: 'Sunshine Pharma Distributors',
    date: '2025-04-05',
    items: 12,
    total: 1250.00,
    status: 'delivered'
  },
  {
    id: 'PO-002',
    supplier: 'MD Pharma',
    date: '2025-04-03',
    items: 8,
    total: 950.00,
    status: 'delivered'
  },
  {
    id: 'PO-003',
    supplier: 'Healthcare Distributors',
    date: '2025-04-01',
    items: 15,
    total: 1680.00,
    status: 'pending'
  }
];

const Purchases = () => {
  const { suppliers, addSupplier, updateSupplier } = useSupplierStore();
  const { items: inventoryItems } = useInventoryStore();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Initialize products list from inventory
  useEffect(() => {
    if (inventoryItems) {
      const products = inventoryItems.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        unitCost: item.unitPrice * 0.7 // Example: cost is 70% of selling price
      }));
      setFilteredProducts(products);
    }
  }, [inventoryItems]);

  // Update filtered products based on search term
  useEffect(() => {
    if (inventoryItems) {
      if (!searchTerm) {
        const products = inventoryItems.map(item => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          unitCost: item.unitPrice * 0.7
        }));
        setFilteredProducts(products);
      } else {
        const term = searchTerm.toLowerCase();
        const filtered = inventoryItems
          .filter(item => 
            item.name.toLowerCase().includes(term) ||
            item.sku.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term)
          )
          .map(item => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            category: item.category,
            unitCost: item.unitPrice * 0.7
          }));
        setFilteredProducts(filtered);
      }
    }
  }, [searchTerm, inventoryItems]);

  // Calculate order total
  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + item.total, 0);
    setOrderTotal(total);
  }, [orderItems]);

  const handleAddProduct = (product) => {
    // Check if product already exists in order
    const existingItem = orderItems.find(item => item.id === product.id);
    if (existingItem) {
      // Increase quantity if product already exists
      handleQuantityChange(product.id, existingItem.quantity + 1);
    } else {
      // Add new product with quantity 1
      const newItem = {
        ...product,
        quantity: 1,
        total: product.unitCost
      };
      setOrderItems([...orderItems, newItem]);
    }
    
    toast({
      title: "Product Added",
      description: `${product.name} added to order.`,
    });
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    
    const updatedItems = orderItems.map(item => {
      if (item.id === productId) {
        const updatedQuantity = quantity;
        return {
          ...item,
          quantity: updatedQuantity,
          total: updatedQuantity * item.unitCost
        };
      }
      return item;
    });
    
    setOrderItems(updatedItems);
  };

  const handleRemoveItem = (productId) => {
    const updatedItems = orderItems.filter(item => item.id !== productId);
    setOrderItems(updatedItems);
    
    toast({
      title: "Product Removed",
      description: "Product removed from order.",
    });
  };

  const handleCreatePurchaseOrder = () => {
    if (!selectedSupplier) {
      toast({
        title: "Supplier Required",
        description: "Please select a supplier for this purchase order.",
        variant: "destructive",
      });
      return;
    }
    
    if (orderItems.length === 0) {
      toast({
        title: "No Products",
        description: "Please add at least one product to the order.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would save to a database
    toast({
      title: "Purchase Order Created",
      description: "Your purchase order has been created successfully.",
    });
    
    // Reset form
    setSelectedSupplier('');
    setOrderItems([]);
    setActiveTab('orders');
  };

  const handleSaveSupplier = (supplier) => {
    if (supplier.id) {
      // Update existing supplier
      updateSupplier(supplier);
      toast({
        title: "Supplier Updated",
        description: `${supplier.name} has been updated.`,
      });
    } else {
      // Add new supplier with generated ID
      const newSupplier = {
        ...supplier,
        id: suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1
      };
      addSupplier(newSupplier);
      toast({
        title: "Supplier Added",
        description: `${supplier.name} has been added to your suppliers.`,
      });
    }
  };

  const handleViewOrder = (orderId) => {
    // Find the order by ID
    const order = sampleOrders.find(order => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      // In a real app, this would fetch the order details
      toast({
        title: "Order Details",
        description: `Viewing details for order ${orderId}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Purchases</h1>
          <p className="text-muted-foreground">Manage purchase orders and suppliers</p>
        </div>
      </div>
      
      {/* Purchase Stats */}
      <PurchaseStats orders={sampleOrders} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="create">Create New Order</TabsTrigger>
        </TabsList>
        
        {/* Purchase Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                View and manage all purchase orders from suppliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseOrdersTable 
                purchaseOrders={sampleOrders}
                onViewOrder={handleViewOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Create New Order Tab */}
        <TabsContent value="create" className="space-y-4">
          {/* Supplier Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
              <CardDescription>
                Select a supplier for this purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="supplier">Select Supplier</Label>
                  <Select
                    value={selectedSupplier}
                    onValueChange={setSelectedSupplier}
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.name}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={() => setIsNewSupplierDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Supplier
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Product Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Search and add products to this purchase order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductList
                  products={filteredProducts}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onAddProduct={handleAddProduct}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review and edit your purchase order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <OrderSummary
                  orderItems={orderItems}
                  onQuantityChange={handleQuantityChange}
                  onRemoveItem={handleRemoveItem}
                  orderTotal={orderTotal}
                />
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleCreatePurchaseOrder} disabled={orderItems.length === 0 || !selectedSupplier}>
                    <Save className="mr-2 h-4 w-4" />
                    Create Purchase Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* New Supplier Dialog */}
      <SupplierFormDialog
        open={isNewSupplierDialogOpen}
        onOpenChange={setIsNewSupplierDialogOpen}
        onSave={handleSaveSupplier}
        title="Add New Supplier"
      />
    </div>
  );
};

export default Purchases;
