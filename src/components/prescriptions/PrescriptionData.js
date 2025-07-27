
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCustomerStore } from '@/stores/customerStore';

// Sample prescription data
const initialPrescriptions = [
  {
    id: "1",
    patientName: "Abdul Salaam",
    patientId: 1,
    doctorName: "Dr. Amaan",
    date: "2023-12-15",
    status: "active",
    medications: [
      { id: 1, name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
      { id: 2, name: "Paracetamol", dosage: "650mg", frequency: "As needed", duration: "5 days" }
    ],
    notes: "Take with food. Complete full course."
  },
  {
    id: "2",
    patientName: "Hussain",
    patientId: 2,
    doctorName: "Dr. Haseeb",
    date: "2023-12-10",
    status: "completed",
    medications: [
      { id: 1, name: "Losartan", dosage: "50mg", frequency: "Once daily", duration: "30 days" }
    ],
    notes: "Blood pressure medication. Follow up in 30 days."
  },
  {
    id: "3",
    patientName: "Nayeem",
    patientId: 3,
    doctorName: "Dr. Naseer Mir",
    date: "2023-12-12",
    status: "active",
    medications: [
      { id: 1, name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "90 days" },
      { id: 2, name: "Atorvastatin", dosage: "10mg", frequency: "Once daily at bedtime", duration: "90 days" },
      { id: 3, name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "90 days" }
    ],
    notes: "Take with meals. Monitor blood glucose regularly."
  },
  {
    id: "4",
    patientName: "Abdul Salaam",
    patientId: 4,
    doctorName: "Dr. Haseeb",
    date: "2023-12-05",
    status: "expired",
    medications: [
      { id: 1, name: "Prednisone", dosage: "20mg", frequency: "Once daily", duration: "7 days, then taper" }
    ],
    notes: "Taper schedule: 15mg for 3 days, 10mg for 3 days, 5mg for 3 days."
  },
  {
    id: "5",
    patientName: "Basit",
    patientId: 5,
    doctorName: "Dr. M. Ashraf Khan",
    date: "2023-12-14",
    status: "pending",
    medications: [
      { id: 1, name: "Ciprofloxacin", dosage: "500mg", frequency: "Twice daily", duration: "10 days" },
      { id: 2, name: "Ibuprofen", dosage: "400mg", frequency: "Every 6 hours as needed", duration: "5 days" }
    ],
    notes: "Complete entire course of antibiotics. No alcohol."
  }
];

// E-prescription data
const initialEPrescriptions = [
  {
    id: "e1",
    patientName: "Nayeem",
    patientId: 1,
    doctorName: "Dr. Amaam",
    hospitalName: "City Hospital",
    date: "2023-12-16",
    status: "pending",
    medications: [
      { id: 1, name: "Cephalexin", dosage: "250mg", frequency: "Four times daily", duration: "10 days" },
      { id: 2, name: "Promethazine", dosage: "25mg", frequency: "At bedtime", duration: "5 days" }
    ],
    notes: "Take with plenty of water. May cause drowsiness."
  },
  {
    id: "e2",
    patientName: "Hussain",
    patientId: 2,
    doctorName: "Dr. Naseer Mir",
    hospitalName: "University Medical Center",
    date: "2023-12-15",
    status: "verified",
    medications: [
      { id: 1, name: "Simvastatin", dosage: "20mg", frequency: "Once daily at bedtime", duration: "30 days" },
      { id: 2, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" }
    ],
    notes: "Monitor blood pressure weekly. Report any muscle pain."
  },
  {
    id: "e3",
    patientName: "Abdul Salaam",
    patientId: 5,
    doctorName: "Dr. M. Ashraf Khan",
    hospitalName: "Community Health Partners",
    date: "2023-12-14",
    status: "processing",
    medications: [
      { id: 1, name: "Gabapentin", dosage: "300mg", frequency: "Three times daily", duration: "30 days" }
    ],
    notes: "May cause dizziness. Avoid operating machinery."
  }
];

// Prescription store
export const usePrescriptionStore = create(
  persist(
    (set, get) => ({
      prescriptions: initialPrescriptions,
      ePrescriptions: initialEPrescriptions,
      
      addPrescription: (prescription) => {
        set((state) => ({
          prescriptions: [...state.prescriptions, {
            ...prescription,
            id: uuidv4(),
            date: prescription.date || new Date().toISOString().split('T')[0]
          }]
        }));
      },
      
      updatePrescription: (updatedPrescription) => {
        set((state) => ({
          prescriptions: state.prescriptions.map((prescription) => 
            prescription.id === updatedPrescription.id ? updatedPrescription : prescription
          )
        }));
      },
      
      deletePrescription: (id) => {
        set((state) => ({
          prescriptions: state.prescriptions.filter((prescription) => prescription.id !== id)
        }));
      },
      
      // E-prescription functions
      addEPrescription: (prescription) => {
        set((state) => ({
          ePrescriptions: [...state.ePrescriptions, {
            ...prescription,
            id: `e${uuidv4()}`,
            date: prescription.date || new Date().toISOString().split('T')[0],
            status: prescription.status || 'pending'
          }]
        }));
      },
      
      updateEPrescription: (updatedPrescription) => {
        set((state) => ({
          ePrescriptions: state.ePrescriptions.map((prescription) => 
            prescription.id === updatedPrescription.id ? updatedPrescription : prescription
          )
        }));
      },
      
      deleteEPrescription: (id) => {
        set((state) => ({
          ePrescriptions: state.ePrescriptions.filter((prescription) => prescription.id !== id)
        }));
      },
      
      // Convert E-prescription to regular prescription
      convertToPrescription: (ePrescriptionId) => {
        const ePrescription = get().ePrescriptions.find(p => p.id === ePrescriptionId);
        
        if (ePrescription) {
          // Add as a regular prescription
          get().addPrescription({
            patientName: ePrescription.patientName,
            patientId: ePrescription.patientId,
            doctorName: ePrescription.doctorName,
            date: new Date().toISOString().split('T')[0],
            status: "active",
            medications: ePrescription.medications,
            notes: `Converted from e-prescription. Original notes: ${ePrescription.notes}`
          });
          
          // Update e-prescription status
          get().updateEPrescription({
            ...ePrescription,
            status: "processed"
          });
        }
      },
      
      // Get prescriptions by patient ID
      getPrescriptionsByPatientId: (patientId) => {
        return get().prescriptions.filter(prescription => 
          prescription.patientId === patientId
        );
      },
      
      // Get e-prescriptions by patient ID
      getEPrescriptionsByPatientId: (patientId) => {
        return get().ePrescriptions.filter(prescription => 
          prescription.patientId === patientId
        );
      },
      
      // Get number of active prescriptions
      getActivePrescriptionsCount: () => {
        return get().prescriptions.filter(p => p.status === 'active').length;
      },
      
      // Get number of pending e-prescriptions
      getPendingEPrescriptionsCount: () => {
        return get().ePrescriptions.filter(p => p.status === 'pending' || p.status === 'verified').length;
      }
    }),
    {
      name: 'pharmacy-prescriptions-storage', // Name for localStorage
    }
  )
);
