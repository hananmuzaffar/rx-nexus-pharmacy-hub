
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useInventoryStore } from '@/stores/inventoryStore';
import { Checkbox } from "@/components/ui/checkbox";
import { useCustomerStore } from '@/stores/customerStore';

const NewSaleForm = ({ onCreateSale, onCancel }) => {
  const { items: inventoryItems, updateStockFromSale } = useInventoryStore();
  
  const [newSaleCustomer, setNewSaleCustomer] = useState('');
  const [newSaleItems, setNewSaleItems] = useState([
    { 
      product: '',
      quantity: 1,
      price: 0,
      total: 0,
      sellByTablet: false,
      tabletsCount: 1,
      medicineType: '',
      tabletsPerStrip: 0
    }
  ]);
  const [newSalePaymentMethod, setNewSalePaymentMethod] = useState('Cash');

  // Get real customers from customer store
  const { customers } = useCustomerStore();
  
  useEffect(() => {
    // Customers are already available from the store
  }, []);

  const addItemToSale = () => {
    setNewSaleItems(prev => [...prev, { 
      product: '', 
      quantity: 1, 
      price: 0, 
      total: 0,
      sellByTablet: false,
      tabletsCount: 1,
      medicineType: '',
      tabletsPerStrip: 0
    }]);
  };
  
  const updateNewSaleItem = (index, field, value) => {
    const updatedItems = [...newSaleItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // If selecting a product from dropdown, update related fields
    if (field === 'product') {
      const selectedProduct = inventoryItems.find(p => p.name === value);
      if (selectedProduct) {
        updatedItems[index].price = selectedProduct.unitPrice;
        updatedItems[index].medicineType = selectedProduct.medicineType;
        updatedItems[index].tabletsPerStrip = selectedProduct.tabletsPerStrip || 0;
        
        // Calculate total based on selling method
        if (updatedItems[index].sellByTablet && selectedProduct.medicineType === 'strip') {
          updatedItems[index].total = (selectedProduct.unitPrice / selectedProduct.tabletsPerStrip) * 
            updatedItems[index].tabletsCount;
        } else {
          updatedItems[index].total = selectedProduct.unitPrice * updatedItems[index].quantity;
        }
      }
    }
    
    // If changing quantity, update total
    if (field === 'quantity' || field === 'tabletsCount') {
      const selectedProduct = inventoryItems.find(p => p.name === updatedItems[index].product);
      
      if (selectedProduct) {
        // If selling by tablet
        if (updatedItems[index].sellByTablet && selectedProduct.medicineType === 'strip') {
          updatedItems[index].total = (selectedProduct.unitPrice / selectedProduct.tabletsPerStrip) * 
            updatedItems[index].tabletsCount;
        } else {
          // If selling by unit/strip
          updatedItems[index].total = selectedProduct.unitPrice * updatedItems[index].quantity;
        }
      } else {
        updatedItems[index].total = updatedItems[index].price * updatedItems[index].quantity;
      }
    }
    
    // If toggling the sellByTablet checkbox
    if (field === 'sellByTablet') {
      const selectedProduct = inventoryItems.find(p => p.name === updatedItems[index].product);
      
      if (selectedProduct && selectedProduct.medicineType === 'strip') {
        if (value) {
          // Switching to tablet-wise, set default 1 tablet
          updatedItems[index].tabletsCount = 1;
          updatedItems[index].total = (selectedProduct.unitPrice / selectedProduct.tabletsPerStrip) * 
            updatedItems[index].tabletsCount;
        } else {
          // Switching to strip-wise, set default 1 strip
          updatedItems[index].quantity = 1;
          updatedItems[index].total = selectedProduct.unitPrice * updatedItems[index].quantity;
        }
      }
    }
    
    setNewSaleItems(updatedItems);
  };
  
  const removeItemFromSale = (index) => {
    if (newSaleItems.length > 1) {
      setNewSaleItems(prev => prev.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Cannot Remove Item",
        description: "Sale must have at least one item",
        variant: "destructive"
      });
    }
  };
  
  const calculateNewSaleTotal = () => {
    return newSaleItems.reduce((sum, item) => sum + item.total, 0);
  };
  
  const handleSaveNewSale = () => {
    if (!newSaleCustomer) {
      toast({
        title: "Missing Information",
        description: "Please enter a customer name",
        variant: "destructive"
      });
      return;
    }
    
    if (newSaleItems.some(item => !item.product || (item.sellByTablet ? item.tabletsCount <= 0 : item.quantity <= 0))) {
      toast({
        title: "Invalid Items",
        description: "Please fill in all product details correctly",
        variant: "destructive"
      });
      return;
    }
    
    // Create the sale object
    const sale = {
      id: `SALE-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toISOString(),
      customer: newSaleCustomer,
      items: newSaleItems.map(item => ({
        product: item.product,
        quantity: item.sellByTablet ? item.tabletsCount : item.quantity,
        price: item.sellByTablet ? 
          (item.price / item.tabletsPerStrip) : 
          item.price,
        total: item.total,
        sellByTablet: item.sellByTablet,
        tabletsCount: item.sellByTablet ? item.tabletsCount : 0
      })),
      totalAmount: calculateNewSaleTotal(),
      paymentMethod: newSalePaymentMethod
    };
    
    // Update inventory stock
    updateStockFromSale(newSaleItems);
    
    // Pass the sale to parent component
    onCreateSale(sale);
    
    toast({
      title: "Sale Created",
      description: `Sale #${sale.id} has been created successfully`,
    });
  };
  
  return (
    <div className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Select 
            value={newSaleCustomer}
            onValueChange={setNewSaleCustomer}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.name}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment">Payment Method</Label>
          <Select 
            value={newSalePaymentMethod}
            onValueChange={setNewSalePaymentMethod}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="Debit Card">Debit Card</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Items</h3>
          <Button size="sm" variant="outline" onClick={addItemToSale}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
        
        <div className="border rounded-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-2 px-3 text-left">Product</th>
                <th className="py-2 px-3 text-center">Sell By</th>
                <th className="py-2 px-3 text-center w-24">Quantity</th>
                <th className="py-2 px-3 text-right w-32">Price</th>
                <th className="py-2 px-3 text-right w-32">Total</th>
                <th className="py-2 px-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {newSaleItems.map((item, index) => {
                // Find product info for additional details
                const productInfo = inventoryItems.find(p => p.name === item.product);
                const isStripMedicine = productInfo && productInfo.medicineType === 'strip';
                
                return (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-3">
                      <Select 
                        value={item.product}
                        onValueChange={(value) => updateNewSaleItem(index, 'product', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems
                            .filter(product => {
                              // Filter out out-of-stock items
                              if (product.stock <= 0) return false;
                              
                              // Filter out expired items
                              if (product.expiry_date || product.expiryDate) {
                                const expiryDate = new Date(product.expiry_date || product.expiryDate);
                                const today = new Date();
                                if (expiryDate <= today) return false;
                              }
                              
                              return true;
                            })
                            .map(product => (
                            <SelectItem key={product.id} value={product.name}>
                              {product.name} - ₹{(product.unit_price || product.unitPrice || 0).toFixed(2)} 
                              {(product.medicine_type || product.medicineType) === 'strip' && ` (${product.tablets_per_strip || product.tabletsPerStrip || 0} tablets)`}
                              {product.stock <= 10 && ` - Low Stock: ${product.stock}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {isStripMedicine && (
                        <div className="flex items-center space-x-2 justify-center">
                          <Checkbox
                            checked={item.sellByTablet}
                            onCheckedChange={(checked) => 
                              updateNewSaleItem(index, 'sellByTablet', checked)
                            }
                            id={`tablet-${index}`}
                          />
                          <Label htmlFor={`tablet-${index}`}>Tablet</Label>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {item.sellByTablet && isStripMedicine ? (
                        <Input 
                          type="number"
                          min="1"
                          value={item.tabletsCount}
                          onChange={(e) => updateNewSaleItem(
                            index, 'tabletsCount', parseInt(e.target.value) || 1
                          )}
                          className="text-center"
                        />
                      ) : (
                        <Input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateNewSaleItem(
                            index, 'quantity', parseInt(e.target.value) || 1
                          )}
                          className="text-center"
                        />
                      )}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {item.sellByTablet && isStripMedicine ? 
                        `₹${((productInfo?.unitPrice || 0) / (productInfo?.tabletsPerStrip || 1)).toFixed(2)}/tablet` : 
                        `₹${item.price.toFixed(2)}`
                      }
                    </td>
                    <td className="py-2 px-3 text-right font-medium">
                      ₹{item.total.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeItemFromSale(index)}
                        className="h-8 w-8 p-0"
                      >
                        &times;
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <tr className="font-medium">
                <td className="py-3 px-3 text-right" colSpan={4}>Total:</td>
                <td className="py-3 px-3 text-right">₹{calculateNewSaleTotal().toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveNewSale}>
          Create Sale
        </Button>
      </div>
    </div>
  );
};

export default NewSaleForm;
