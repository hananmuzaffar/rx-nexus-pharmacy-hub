
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitCost: number;
}

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  searchTerm, 
  onSearchChange, 
  onAddProduct 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search-products">Search Products</Label>
        <Input
          id="search-products"
          placeholder="Search by name or SKU"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-2"
        />
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr>
              <th className="h-10 px-4 text-left align-middle font-medium">Product</th>
              <th className="h-10 px-4 text-left align-middle font-medium">SKU</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Category</th>
              <th className="h-10 px-4 text-right align-middle font-medium">Unit Cost</th>
              <th className="h-10 px-4 text-center align-middle font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.sku}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2 text-right">₹{product.unitCost.toFixed(2)}</td>
                  <td className="p-2 text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onAddProduct(product)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
