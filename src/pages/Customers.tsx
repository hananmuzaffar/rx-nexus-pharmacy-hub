
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, UserCheck, Clock } from "lucide-react";
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerFormDialog from '@/components/customers/CustomerFormDialog';
import CustomerViewDialog from '@/components/customers/CustomerViewDialog';
import { useCustomers } from '@/hooks/useCustomers';

const Customers = () => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(undefined);

  // Calculate customer stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(customer => {
    if (!customer.last_visit) return false;
    const lastVisit = new Date(customer.last_visit);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastVisit >= thirtyDaysAgo;
  }).length;

  const newCustomers = customers.filter(customer => {
    if (!customer.date_registered) return false;
    const registered = new Date(customer.date_registered);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return registered >= thirtyDaysAgo;
  }).length;

  const handleAddCustomer = async (newCustomer) => {
    try {
      await addCustomer(newCustomer);
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleEditCustomer = async (updatedCustomer) => {
    if (!updatedCustomer.id) return;
    
    try {
      await updateCustomer(updatedCustomer.id, updatedCustomer);
      setIsEditDialogOpen(false);
      setCurrentCustomer(undefined);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const openEditDialog = (customer) => {
    setCurrentCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (customer) => {
    setCurrentCustomer(customer);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading customers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">registered customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserCheck className="h-4 w-4 mr-2 text-green-500" />
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">visited in last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              New Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCustomers}</div>
            <p className="text-xs text-muted-foreground">registered this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your pharmacy customers</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTable 
            customers={customers} 
            onEdit={openEditDialog}
            onDelete={handleDeleteCustomer}
            onView={openViewDialog}
          />
        </CardContent>
      </Card>

      <CustomerFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddCustomer}
      />

      <CustomerFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditCustomer}
        customer={currentCustomer}
      />

      {currentCustomer && (
        <CustomerViewDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          customer={{
            ...currentCustomer,
            dateRegistered: currentCustomer.date_registered,
            lastVisit: currentCustomer.last_visit
          }}
        />
      )}
    </div>
  );
};

export default Customers;
