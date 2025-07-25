
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Sample data for e-prescriptions
const initialEPrescriptions = [
  {
    id: "ERX00456",
    patient: "Maria Rodriguez",
    provider: "Dr. Anthony Miller",
    medication: "Metformin 500mg",
    received: "Today, 9:45 AM",
    priority: "high",
    status: "new"
  },
  {
    id: "ERX00455",
    patient: "James Wilson",
    provider: "Dr. Sarah Johnson",
    medication: "Lisinopril 10mg",
    received: "Today, 9:30 AM",
    priority: "medium",
    status: "new"
  },
  {
    id: "ERX00454",
    patient: "Robert Taylor",
    provider: "Dr. Lisa Wong",
    medication: "Atorvastatin 20mg",
    received: "Today, 9:15 AM",
    priority: "low",
    status: "processing"
  }
];

const EPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState(initialEPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Count prescriptions by status
  const newCount = prescriptions.filter(p => p.status === 'new').length;
  const processingCount = prescriptions.filter(p => p.status === 'processing').length;
  const readyCount = prescriptions.filter(p => p.status === 'ready').length;
  const completedCount = prescriptions.filter(p => p.status === 'completed').length;
  
  // Handle sync button
  const handleSync = () => {
    toast({
      title: "Syncing E-Prescriptions",
      description: "Retrieving latest prescription data...",
    });
    
    // Simulate receiving new prescriptions
    setTimeout(() => {
      const newPrescription = {
        id: `ERX00${Math.floor(Math.random() * 1000)}`,
        patient: "Alex Johnson",
        provider: "Dr. Michael Smith",
        medication: "Amoxicillin 500mg",
        received: "Just now",
        priority: "medium",
        status: "new"
      };
      
      setPrescriptions([newPrescription, ...prescriptions]);
      
      toast({
        title: "Sync Complete",
        description: "1 new e-prescription received",
      });
    }, 1500);
  };
  
  // Handle prescription process
  const handleProcess = (id) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === id ? { ...p, status: 'processing' } : p
    ));
    
    toast({
      title: "Prescription Processing",
      description: `Prescription ${id} is now being processed`,
    });
  };
  
  // Handle prescription complete
  const handleComplete = (id) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === id ? { ...p, status: 'ready' } : p
    ));
    
    toast({
      title: "Prescription Ready",
      description: `Prescription ${id} is now ready for pickup`,
    });
  };
  
  // Handle searching prescriptions
  const handleSearch = (e) => {
    e.preventDefault();
    toast({
      title: "Searching Prescriptions",
      description: `Searching for "${searchQuery}"...`,
    });
  };
  
  // Filter prescriptions based on search and status
  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.medication.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">E-Prescription Management</h1>
        <Button onClick={handleSync}>Sync E-Prescriptions</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New E-Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingCount}</div>
            <p className="text-xs text-muted-foreground">Being prepared</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting patient pickup</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully dispensed</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search prescriptions..." 
            className="pl-8 w-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[150px]"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              toast({
                title: "Filter Applied",
                description: `Showing ${e.target.value === 'all' ? 'all' : e.target.value} e-prescriptions`,
              });
            }}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>E-Prescriptions Queue</CardTitle>
          <CardDescription>Manage digital prescriptions from healthcare providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-10 px-4 text-left align-middle font-medium">Rx Number</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Patient</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Provider</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Medication</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Received</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Priority</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredPrescriptions.map((rx) => (
                  <tr key={rx.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-2 align-middle">{rx.id}</td>
                    <td className="p-2 align-middle">{rx.patient}</td>
                    <td className="p-2 align-middle">{rx.provider}</td>
                    <td className="p-2 align-middle">{rx.medication}</td>
                    <td className="p-2 align-middle">{rx.received}</td>
                    <td className="p-2 align-middle">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                        rx.priority === "high"
                          ? "bg-red-500 text-white"
                          : rx.priority === "medium"
                            ? "bg-amber-500 text-white"
                            : "bg-green-500 text-white"
                      }`}>
                        {rx.priority === "high" ? "High" : rx.priority === "medium" ? "Medium" : "Low"}
                      </span>
                    </td>
                    <td className="p-2 align-middle">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                        rx.status === "new"
                          ? "bg-blue-500 text-white"
                          : rx.status === "processing"
                            ? "bg-amber-500 text-white"
                            : rx.status === "ready"
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                      }`}>
                        {rx.status === "new" ? "New" : 
                         rx.status === "processing" ? "Processing" : 
                         rx.status === "ready" ? "Ready" : "Completed"}
                      </span>
                    </td>
                    <td className="p-2 align-middle">
                      {rx.status === "new" && (
                        <Button variant="outline" size="sm" onClick={() => handleProcess(rx.id)}>
                          Process
                        </Button>
                      )}
                      {rx.status === "processing" && (
                        <Button variant="outline" size="sm" onClick={() => handleComplete(rx.id)}>
                          Complete
                        </Button>
                      )}
                      {rx.status === "ready" && (
                        <Button variant="outline" size="sm" onClick={() => {
                          setPrescriptions(prescriptions.map(p => 
                            p.id === rx.id ? { ...p, status: 'completed' } : p
                          ));
                          toast({
                            title: "Prescription Dispensed",
                            description: `${rx.id} has been dispensed to patient`,
                          });
                        }}>
                          Dispense
                        </Button>
                      )}
                      {rx.status === "completed" && (
                        <Button variant="ghost" size="sm" disabled>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EPrescriptions;
