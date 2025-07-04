
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Customer } from '@/stores/customerStore';
import { usePrescriptionStore } from '@/components/prescriptions/PrescriptionData';
import { useSalesStore } from '@/stores/salesStore';

interface CustomerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onEdit: (customer: Customer) => void;
}

const CustomerViewDialog = ({ open, onOpenChange, customer, onEdit }: CustomerViewDialogProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const { getPrescriptionsByPatientId, getEPrescriptionsByPatientId } = usePrescriptionStore();
  const { getSalesByCustomerId } = useSalesStore();
  
  if (!customer) {
    return null;
  }
  
  // Get customer prescriptions and sales
  const prescriptions = getPrescriptionsByPatientId(customer.id);
  const ePrescriptions = getEPrescriptionsByPatientId(customer.id);
  const sales = getSalesByCustomerId(customer.id);

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Information</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="eprescriptions">E-Prescriptions</TabsTrigger>
            <TabsTrigger value="sales">Purchase History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{customer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{customer.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date Registered</p>
                <p>{customer.dateRegistered}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                <p>{customer.lastVisit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Prescriptions</p>
                <p>{prescriptions.length + ePrescriptions.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Purchases</p>
                <p>{sales.length}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onEdit(customer)}>
                Edit Customer
              </Button>
              <Button variant="outline" onClick={handleClose}>Close</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="prescriptions" className="py-4 space-y-4">
            {prescriptions.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Doctor</th>
                      <th className="py-2 px-4 text-left">Medications</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((prescription) => (
                      <tr key={prescription.id} className="border-t">
                        <td className="py-2 px-4">{prescription.date}</td>
                        <td className="py-2 px-4">{prescription.doctorName}</td>
                        <td className="py-2 px-4">
                          {prescription.medications.map(med => med.name).join(', ')}
                        </td>
                        <td className="py-2 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                            prescription.status === 'expired' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {prescription.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No prescriptions found for this customer.</p>
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClose}>Close</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="eprescriptions" className="py-4 space-y-4">
            {ePrescriptions.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Doctor</th>
                      <th className="py-2 px-4 text-left">Hospital</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ePrescriptions.map((prescription) => (
                      <tr key={prescription.id} className="border-t">
                        <td className="py-2 px-4">{prescription.date}</td>
                        <td className="py-2 px-4">{prescription.doctorName}</td>
                        <td className="py-2 px-4">{prescription.hospitalName}</td>
                        <td className="py-2 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            prescription.status === 'processed' ? 'bg-green-100 text-green-800' :
                            prescription.status === 'verified' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {prescription.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No e-prescriptions found for this customer.</p>
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClose}>Close</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="py-4 space-y-4">
            {sales.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Invoice #</th>
                      <th className="py-2 px-4 text-left">Items</th>
                      <th className="py-2 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="border-t">
                        <td className="py-2 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{sale.id}</td>
                        <td className="py-2 px-4">
                          {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="py-2 px-4 text-right">₹{sale.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t font-medium">
                      <td colSpan={3} className="py-2 px-4 text-right">Total</td>
                      <td className="py-2 px-4 text-right">
                        ₹{sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No purchase history found for this customer.</p>
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClose}>Close</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerViewDialog;
