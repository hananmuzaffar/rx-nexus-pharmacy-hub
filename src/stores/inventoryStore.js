
import { create } from 'zustand';
import { inventoryItems as initialItems } from '@/components/purchases/PurchaseData';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

// Add medicineType and tabletsPerStrip fields to initial data
const enhancedInitialItems = initialItems.map(item => ({
  ...item,
  medicineType: item.category === "Tablets" ? "strip" : "syrup",
  tabletsPerStrip: item.category === "Tablets" ? 10 : 0,
  unitPrice: item.unitPrice,
  stripPrice: item.category === "Tablets" ? item.unitPrice * 10 : 0
}));

// Predefined categories and manufacturers for selection
export const medicineCategories = [
  "Antibiotics",
  "Analgesics",
  "Antacids",
  "Antihypertensives",
  "Antipyretics",
  "Antihistamines",
  "Vitamins",
  "Antiseptics",
  "OTC",
  "Tablets",
  "Syrup",
  "Injection",
  "Capsules",
  "Topical",
  "Drops",
  "Inhaler"
];

export const medicineManufacturers = [
  "Sun Pharma",
  "Cipla",
  "Dr. Reddy's",
  "Lupin",
  "Zydus Cadila",
  "Aurobindo Pharma",
  "Alkem Laboratories",
  "Torrent Pharmaceuticals",
  "Mankind Pharma",
  "Glenmark Pharmaceuticals",
  "Other"
];

export const useInventoryStore = create(
  persist(
    (set, get) => ({
      items: enhancedInitialItems,
      categories: medicineCategories,
      manufacturers: medicineManufacturers,
      isLoading: false,
      
      // Fetch items from Supabase
      fetchItems: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('inventory_items')
            .select('*');
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            set({ items: data, isLoading: false });
          } else {
            // If no data in Supabase, use initial data
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Error fetching inventory:', error);
          set({ isLoading: false });
        }
      },
      
      addItem: async (item) => {
        // Calculate strip price if it's a strip type medicine
        const itemToAdd = { 
          ...item,
          strip_price: item.medicine_type === "strip" ? item.unit_price * (item.tablets_per_strip || 1) : 0
        };
        
        try {
          const { data, error } = await supabase
            .from('inventory_items')
            .insert([itemToAdd])
            .select()
            .single();
          
          if (error) throw error;
          
          set((state) => ({
            items: [...state.items, data]
          }));
        } catch (error) {
          console.error('Error adding item:', error);
          // Fallback to local state
          set((state) => ({
            items: [...state.items, itemToAdd]
          }));
        }
      },
      
      updateItem: (item) => {
        // Recalculate strip price if relevant fields changed
        const updatedItem = { 
          ...item,
          stripPrice: item.medicineType === "strip" ? item.unitPrice * (item.tabletsPerStrip || 1) : 0
        };
        
        set((state) => ({
          items: state.items.map((i) => 
            i.id === updatedItem.id ? updatedItem : i
          )
        }));
      },
      
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id)
        }));
      },
      
      getItemById: (id) => {
        return get().items.find(item => item.id === id);
      },
      
      getItemsByCategoryOrSearch: (term) => {
        const lowerTerm = term.toLowerCase();
        return get().items.filter(item => 
          item.name.toLowerCase().includes(lowerTerm) ||
          item.category.toLowerCase().includes(lowerTerm) ||
          item.sku.toLowerCase().includes(lowerTerm)
        );
      },

      // Function to update stock based on sales
      updateStockFromSale: (items) => {
        set((state) => ({
          items: state.items.map(item => {
            const soldItem = items.find(i => i.product === item.name);
            if (soldItem) {
              // If selling by tablet, calculate how much to reduce
              if (soldItem.sellByTablet && item.medicineType === "strip") {
                const tabletsSold = soldItem.tabletsCount;
                const stripsUsed = Math.ceil(tabletsSold / item.tabletsPerStrip);
                return {
                  ...item,
                  stock: Math.max(0, item.stock - stripsUsed)
                };
              } else {
                // Normal quantity reduction
                return {
                  ...item,
                  stock: Math.max(0, item.stock - soldItem.quantity)
                };
              }
            }
            return item;
          })
        }));
      },
      
      // Functions to manage categories and manufacturers
      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category]
        }));
      },
      
      addManufacturer: (manufacturer) => {
        set((state) => ({
          manufacturers: [...state.manufacturers, manufacturer]
        }));
      }
    }),
    {
      name: 'pharmacy-inventory-storage', // Name for localStorage
    }
  )
);
