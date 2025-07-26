
// Sample suppliers
export const suppliers = [
  { id: 1, name: "PharmaSupply Inc.", contact: "(555) 234-5678", email: "orders@pharmasupply.com" },
  { id: 2, name: "MediWholesale Co.", contact: "(555) 876-5432", email: "sales@mediwholesale.com" },
  { id: 3, name: "HealthDist Partners", contact: "(555) 345-6789", email: "info@healthdist.com" },
];

// Sample products for purchasing
export const purchaseProducts = [
  { id: 1, name: "Paracetamol 500mg", sku: "PCM-500", category: "Analgesics", unitCost: 2.50 },
  { id: 2, name: "Amoxicillin 250mg", sku: "AMX-250", category: "Antibiotics", unitCost: 4.25 },
  { id: 3, name: "Cetirizine 10mg", sku: "CET-10", category: "Antihistamines", unitCost: 1.75 },
  { id: 4, name: "Omeprazole 20mg", sku: "OMP-20", category: "Gastrointestinal", unitCost: 3.45 },
];

// Sample purchase orders
export const initialPurchaseOrders = [
  { 
    id: "PO-2025-001", 
    supplier: "PharmaSupply Inc.", 
    date: "Apr 05, 2025",
    items: 42,
    total: 3560.75,
    status: "pending"
  },
  { 
    id: "PO-2025-002", 
    supplier: "MediWholesale Co.", 
    date: "Apr 03, 2025",
    items: 28,
    total: 2145.30,
    status: "delivered"
  },
];

// Inventory sample data
export const inventoryItems = [
  { 
    id: 1, 
    name: "Paracetamol 500mg", 
    sku: "PCM-500", 
    category: "Analgesics", 
    stock: 165,
    reorderLevel: 50,
    unitPrice: 4.99,
    expiryDate: "2026-01-15"
  },
  { 
    id: 2, 
    name: "Amoxicillin 250mg", 
    sku: "AMX-250", 
    category: "Antibiotics", 
    stock: 42,
    reorderLevel: 30,
    unitPrice: 8.50,
    expiryDate: "2025-11-20"
  },
  { 
    id: 3, 
    name: "Cetirizine 10mg", 
    sku: "CET-10", 
    category: "Antihistamines", 
    stock: 87,
    reorderLevel: 40,
    unitPrice: 3.25,
    expiryDate: "2025-08-30"
  },
  { 
    id: 4, 
    name: "Omeprazole 20mg", 
    sku: "OMP-20", 
    category: "Gastrointestinal", 
    stock: 15,
    reorderLevel: 25,
    unitPrice: 7.99,
    expiryDate: "2025-09-25"
  },
  { 
    id: 5, 
    name: "Ibuprofen 400mg", 
    sku: "IBU-400", 
    category: "Anti-inflammatory", 
    stock: 120,
    reorderLevel: 40,
    unitPrice: 5.49,
    expiryDate: "2026-03-10"
  }
];

// Sample customers
export const customers = [
  {
    id: 1,
    name: "Abdul Salaam,",
    email: "salaam@gmail.com",
    phone: "1234567890",
    address: "Srinagar",
    dateRegistered: "2024-01-15",
    prescriptions: 3,
    lastVisit: "2025-03-28"
  },
  {
    id: 2,
    name: "Basit",
    email: "basit@gmail.com",
    phone: "1234567890",
    address: "Srinagar",
    dateRegistered: "2023-11-10",
    prescriptions: 5,
    lastVisit: "2025-04-02"
  },
  {
    id: 3,
    name: "Nayeem",
    email: "nayeem@gmail.com",
    phone: "1234567890",
    address: "Srinagar",
    dateRegistered: "2024-02-22",
    prescriptions: 1,
    lastVisit: "2025-03-15"
  },
  {
    id: 4,
    name: "Hussain",
    email: "hussain@gmail.com",
    phone: "1234567890",
    address: "Srinagar",
    dateRegistered: "2023-09-05",
    prescriptions: 7,
    lastVisit: "2025-04-05"
  }
];

// Sample prescriptions
export const prescriptions = [
  {
    id: "RX-2025-001",
    patient: "Abdul Salaam",
    doctor: "Dr. Amaan",
    medication: "Amoxicillin 250mg",
    dosage: "1 tablet 3 times daily",
    quantity: 30,
    date: "2025-03-28",
    status: "filled",
    refillsRemaining: 2
  },
  {
    id: "RX-2025-002",
    patient: "Nayeem",
    doctor: "Dr. Naseer Mir",
    medication: "Lisinopril 10mg",
    dosage: "1 tablet daily",
    quantity: 30,
    date: "2025-04-02",
    status: "filled",
    refillsRemaining: 5
  },
  {
    id: "RX-2025-003",
    patient: "Basit",
    doctor: "Dr. M. Ashraf Khan",
    medication: "Metformin 500mg",
    dosage: "1 tablet twice daily",
    quantity: 60,
    date: "2025-03-15",
    status: "pending",
    refillsRemaining: 3
  },
  {
    id: "RX-2025-004",
    patient: "Hussain",
    doctor: "Dr. Haseeb",
    medication: "Atorvastatin 20mg",
    dosage: "1 tablet at bedtime",
    quantity: 30,
    date: "2025-04-05",
    status: "filled",
    refillsRemaining: 2
  }
];

// Sample returns data
export const returns = [
  {
    id: "RTN-2025-001",
    product: "Paracetamol 500mg",
    customer: "Abdul Salaam",
    quantity: 10,
    reason: "Expired product",
    date: "2025-03-30",
    status: "processed",
    refundAmount: 49.90
  },
  {
    id: "RTN-2025-002",
    product: "Cetirizine 10mg",
    customer: "Hussain",
    quantity: 5,
    reason: "Wrong medication",
    date: "2025-04-01",
    status: "pending",
    refundAmount: 16.25
  },
  {
    id: "RTN-2025-003",
    product: "Amoxicillin 250mg",
    customer: "Nayeem",
    quantity: 15,
    reason: "Adverse reaction",
    date: "2025-04-03",
    status: "pending",
    refundAmount: 127.50
  }
];

// Sample sales data
export const sales = [
  {
    id: "SL-2025-001",
    date: "2025-04-05",
    customer: "Abdul Salaam",
    items: [
      { product: "Paracetamol 500mg", quantity: 2, price: 4.99, total: 9.98 },
      { product: "Cetirizine 10mg", quantity: 1, price: 3.25, total: 3.25 }
    ],
    totalAmount: 13.23,
    paymentMethod: "Credit Card"
  },
  {
    id: "SL-2025-002",
    date: "2025-04-05",
    customer: "Hussain",
    items: [
      { product: "Amoxicillin 250mg", quantity: 1, price: 8.50, total: 8.50 },
      { product: "Ibuprofen 400mg", quantity: 1, price: 5.49, total: 5.49 }
    ],
    totalAmount: 13.99,
    paymentMethod: "Cash"
  },
  {
    id: "SL-2025-003",
    date: "2025-04-04",
    customer: "Nayeem",
    items: [
      { product: "Omeprazole 20mg", quantity: 1, price: 7.99, total: 7.99 }
    ],
    totalAmount: 7.99,
    paymentMethod: "Debit Card"
  },
  {
    id: "SL-2025-004",
    date: "2025-04-04",
    customer: "Basit",
    items: [
      { product: "Paracetamol 500mg", quantity: 3, price: 4.99, total: 14.97 },
      { product: "Ibuprofen 400mg", quantity: 2, price: 5.49, total: 10.98 }
    ],
    totalAmount: 25.95,
    paymentMethod: "Insurance"
  }
];

// Sample compliance documents
export const complianceDocuments = [
  {
    id: 1,
    name: "Pharmacy License",
    type: "License",
    issueDate: "2025-01-01",
    expiryDate: "2025-12-31",
    status: "active",
    issuingAuthority: "State Board of Pharmacy"
  },
  {
    id: 2,
    name: "DEA Registration",
    type: "Registration",
    issueDate: "2024-07-15",
    expiryDate: "2025-07-14",
    status: "active",
    issuingAuthority: "Drug Enforcement Administration"
  },
  {
    id: 3,
    name: "HIPAA Compliance Certification",
    type: "Certification",
    issueDate: "2024-10-01",
    expiryDate: "2025-09-30",
    status: "active",
    issuingAuthority: "Department of Health"
  },
  {
    id: 4,
    name: "Controlled Substance Inventory",
    type: "Report",
    issueDate: "2025-01-15",
    expiryDate: "2025-07-15",
    status: "pending review",
    issuingAuthority: "Internal Audit"
  }
];
