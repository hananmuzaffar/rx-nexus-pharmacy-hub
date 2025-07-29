import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, FileText, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Sample prescription data
const initialPrescriptions = [
  { 
    id: "RX00123", 
    patient: "Hussain", 
    doctor: "Dr. Haseeb", 
    medication: "Amoxicillin 500mg",
    dosage: "1 tablet three times daily",
    quantity: 30,
    refills: 1,
    issueDate: "2025-03-28", 
    expiryDate: "2025-04-28", 
    status: "active",
    notes: "Take with food"
  },
  { 
    id: "RX00124", 
    patient: "Basit", 
    doctor: "Dr. M. Ashraf Khan", 
    medication: "Lisinopril 10mg",
    dosage: "1 tablet daily",
    quantity: 30,
    refills: 3,
    issueDate: "2025-04-02", 
    expiryDate: "2025-07-02", 
    status: "active",
    notes: "Take in the morning"
  },
];

// Sample patients
const patients = [
  { id: 1, name: "Abdul Salaam", dob: "1980-06-15" },
  { id: 2, name: "Basit", dob: "1975-03-22" },
  { id: 3, name: "Nayeem", dob: "1992-11-08" },
  { id: 4, name: "Hussain", dob: "1988-09-30" },
];

// Sample doctors
const doctors = [
  { id: 1, name: "Dr. Amaan" },
  { id: 2, name: "Dr. Naseer Mir" },
  { id: 3, name: "Dr. Haseeb" },
  { id: 4, name: "Dr. M. Ashraf Khan" },
];

// Sample medications
const medications = [
  "Amoxicillin 500mg",
  "Lisinopril 10mg",
  "Atorvastatin 20mg",
  "Levothyroxine 50mcg",
  "Metformin 500mg",
  "Simvastatin 40mg",
  "Omeprazole 20mg",
  "Amlodipine 5mg",
  "Sertraline 50mg",
  "Albuterol Inhaler 90mcg"
];

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [isRefillDialogOpen, setIsRefillDialogOpen] = useState(false);
  
  const [newPrescription, setNewPrescription] = useState({
    patient: "",
    doctor: "",
    medication: "",
    dosage: "",
    quantity: 0,
    refills: 0,
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    expiryDate: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
    status: "active",
    notes: ""
  });

  // Filter prescriptions based on search term and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && prescription.status === statusFilter;
    }
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    toast({
      title: "Filter Applied",
      description: `Showing ${e.target.value === 'all' ? 'all' : e.target.value} prescriptions`,
    });
  };

  // Update new prescription field
  const updateNewPrescription = (field, value) => {
    if (field === 'quantity' || field === 'refills') {
      value = Number(value);
    }
    
    setNewPrescription({
      ...newPrescription,
      [field]: value
    });
  };

  // Handle adding a new prescription
  const handleAddPrescription = () => {
    const requiredFields = ['patient', 'doctor', 'medication', 'dosage', 'quantity'];
    const missingFields = requiredFields.filter(field => !newPrescription[field] && newPrescription[field] !== 0);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}.`,
        variant: "destructive",
      });
      return;
    }
    
    // Generate new prescription ID
    const lastId = prescriptions.length > 0 
      ? parseInt(prescriptions[prescriptions.length - 1].id.substring(2))
      : 0;
    const newId = `RX${String(lastId + 1).padStart(5, '0')}`;
    
    const prescription = {
      id: newId,
      ...newPrescription,
      quantity: Number(newPrescription.quantity),
      refills: Number(newPrescription.refills)
    };
    
    setPrescriptions([...prescriptions, prescription]);
    setIsAddDialogOpen(false);
    
    // Reset the form
    setNewPrescription({
      patient: "",
      doctor: "",
      medication: "",
      dosage: "",
      quantity: 0,
      refills: 0,
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      expiryDate: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
      status: "active",
      notes: ""
    });
    
    toast({
      title: "Prescription Added",
      description: `Prescription ${newId} has been created successfully.`,
    });
  };

  // View prescription details
  const viewPrescription = (id) => {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
      setCurrentPrescription(prescription);
      setIsViewDialogOpen(true);
    }
  };

  // Mark prescription as completed
  const markAsCompleted = (id) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === id ? { ...p, status: "completed" } : p
    ));
    
    setIsViewDialogOpen(false);
    
    toast({
      title: "Prescription Completed",
      description: `Prescription ${id} has been marked as completed.`,
    });
  };

  // Show refill dialog
  const openRefillDialog = (prescription) => {
    if (prescription.refills > 0) {
      setCurrentPrescription(prescription);
      setIsRefillDialogOpen(true);
      setIsViewDialogOpen(false);
    } else {
      toast({
        title: "No Refills Available",
        description: "This prescription has no refills remaining.",
        variant: "destructive",
      });
    }
  };

  // Process refill
  const processRefill = () => {
    setPrescriptions(prescriptions.map(p => 
      p.id === currentPrescription.id 
        ? { ...p, refills: p.refills - 1 } 
        : p
    ));
    
    setIsRefillDialogOpen(false);
    
    toast({
      title: "Refill Processed",
      description: `Refill for prescription ${currentPrescription.id} has been processed.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Prescription Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Prescription
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search prescriptions..." 
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[150px]"
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Prescriptions</CardTitle>
          <CardDescription>Manage patient prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-10 px-4 text-left align-middle font-medium">ID</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Patient</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Doctor</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Medication</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Issue Date</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Expiry Date</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-2 align-middle">{prescription.id}</td>
                      <td className="p-2 align-middle">{prescription.patient}</td>
                      <td className="p-2 align-middle">{prescription.doctor}</td>
                      <td className="p-2 align-middle">{prescription.medication}</td>
                      <td className="p-2 align-middle">
                        {new Date(prescription.issueDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 align-middle">
                        {new Date(prescription.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 align-middle">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                          prescription.status === "active"
                            ? "bg-green-500 text-white"
                            : prescription.status === "completed"
                            ? "bg-blue-500 text-white"
                            : "bg-red-500 text-white"
                        }`}>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-2 align-middle">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewPrescription(prescription.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-muted-foreground">
                      No prescriptions found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add New Prescription Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Prescription</DialogTitle>
            <DialogDescription>
              Enter details to create a new prescription.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient">Patient*</Label>
              <Select
                value={newPrescription.patient}
                onValueChange={(value) => updateNewPrescription('patient', value)}
              >
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.name}>
                      {patient.name} (DOB: {new Date(patient.dob).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doctor">Prescribing Doctor*</Label>
              <Select
                value={newPrescription.doctor}
                onValueChange={(value) => updateNewPrescription('doctor', value)}
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medication">Medication*</Label>
              <Select
                value={newPrescription.medication}
                onValueChange={(value) => updateNewPrescription('medication', value)}
              >
                <SelectTrigger id="medication">
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  {medications.map((medication, index) => (
                    <SelectItem key={index} value={medication}>
                      {medication}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dosage">Dosage Instructions*</Label>
              <Input
                id="dosage"
                value={newPrescription.dosage}
                onChange={(e) => updateNewPrescription('dosage', e.target.value)}
                placeholder="e.g., 1 tablet three times daily"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity*</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newPrescription.quantity}
                  onChange={(e) => updateNewPrescription('quantity', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="refills">Refills</Label>
                <Input
                  id="refills"
                  type="number"
                  min="0"
                  value={newPrescription.refills}
                  onChange={(e) => updateNewPrescription('refills', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={newPrescription.issueDate}
                  onChange={(e) => updateNewPrescription('issueDate', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newPrescription.expiryDate}
                  onChange={(e) => updateNewPrescription('expiryDate', e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={newPrescription.notes}
                onChange={(e) => updateNewPrescription('notes', e.target.value)}
                placeholder="Additional instructions or notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddPrescription}>
              Add Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Prescription Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              Prescription ID: {currentPrescription?.id}
            </DialogDescription>
          </DialogHeader>
          {currentPrescription && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Patient:</div>
                  <div className="col-span-2">{currentPrescription.patient}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Doctor:</div>
                  <div className="col-span-2">{currentPrescription.doctor}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Medication:</div>
                  <div className="col-span-2">{currentPrescription.medication}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Dosage:</div>
                  <div className="col-span-2">{currentPrescription.dosage}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Quantity:</div>
                  <div className="col-span-2">{currentPrescription.quantity}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Refills:</div>
                  <div className="col-span-2">{currentPrescription.refills} remaining</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Issue Date:</div>
                  <div className="col-span-2">{new Date(currentPrescription.issueDate).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Expiry Date:</div>
                  <div className="col-span-2">{new Date(currentPrescription.expiryDate).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Status:</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                      currentPrescription.status === "active"
                        ? "bg-green-500 text-white"
                        : currentPrescription.status === "completed"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
                    }`}>
                      {currentPrescription.status.charAt(0).toUpperCase() + currentPrescription.status.slice(1)}
                    </span>
                  </div>
                </div>
                {currentPrescription.notes && (
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Notes:</div>
                    <div className="col-span-2">{currentPrescription.notes}</div>
                  </div>
                )}
              </div>
              
              {currentPrescription.status === "active" && (
                <div className="mt-6 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => openRefillDialog(currentPrescription)}
                    disabled={currentPrescription.refills <= 0}
                  >
                    Process Refill ({currentPrescription.refills} left)
                  </Button>
                  <Button 
                    onClick={() => markAsCompleted(currentPrescription.id)}
                  >
                    Mark as Completed
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Refill Dialog */}
      <Dialog open={isRefillDialogOpen} onOpenChange={setIsRefillDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refill</DialogTitle>
            <DialogDescription>
              Confirm refill for {currentPrescription?.medication}
            </DialogDescription>
          </DialogHeader>
          {currentPrescription && (
            <div className="py-4">
              <div className="mb-4">
                <div className="font-medium">Patient: {currentPrescription.patient}</div>
                <div className="text-sm text-muted-foreground">
                  Prescription: {currentPrescription.id}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <Label className="font-medium">Confirm Refill Details</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Medication:</span>
                      <span>{currentPrescription.medication}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{currentPrescription.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refills Remaining:</span>
                      <span>{currentPrescription.refills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>After This Refill:</span>
                      <span>{currentPrescription.refills - 1}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="font-medium mb-2 block">Processing Method</Label>
                  <RadioGroup defaultValue="pickup" className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Pickup In-Store</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Home Delivery</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsRefillDialogOpen(false);
              setIsViewDialogOpen(true);
            }}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={processRefill}>
              <Check className="mr-2 h-4 w-4" />
              Confirm Refill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Prescriptions;
