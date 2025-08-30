import { useEffect } from 'react';
import { useCustomerStore } from '@/stores/customerStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { usePrescriptionStore } from '@/stores/prescriptionStore';
import { useReturnsStore } from '@/stores/returnsStore';
import { useSalesStore } from '@/stores/salesStore';

export const useInitializeStores = () => {
  const { fetchCustomers } = useCustomerStore();
  const { fetchSuppliers } = useSupplierStore();
  const { fetchPrescriptions, fetchEPrescriptions } = usePrescriptionStore();
  const { fetchReturns } = useReturnsStore();
  const { fetchSales } = useSalesStore();

  useEffect(() => {
    // Initialize all stores with data from database
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchCustomers(),
          fetchSuppliers(),
          fetchPrescriptions(),
          fetchEPrescriptions(),
          fetchReturns(),
          fetchSales(),
        ]);
      } catch (error) {
        console.error('Error initializing stores:', error);
      }
    };

    initializeData();
  }, [fetchCustomers, fetchSuppliers, fetchPrescriptions, fetchEPrescriptions, fetchReturns, fetchSales]);
};