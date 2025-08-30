import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export type Medication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export type Prescription = {
  id: string;
  patient_name: string;
  patient_id?: number;
  doctor_name: string;
  date: string;
  status: string;
  medications: Medication[];
  notes?: string;
}

export type EPrescription = {
  id: string;
  patient_name: string;
  patient_id?: number;
  doctor_name: string;
  hospital_name: string;
  date: string;
  status: string;
  medications: Medication[];
  notes?: string;
}

type PrescriptionStore = {
  prescriptions: Prescription[];
  ePrescriptions: EPrescription[];
  isLoading: boolean;
  
  // Prescription methods
  fetchPrescriptions: () => Promise<void>;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => Promise<void>;
  updatePrescription: (prescription: Prescription) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>;
  
  // E-Prescription methods
  fetchEPrescriptions: () => Promise<void>;
  addEPrescription: (prescription: Omit<EPrescription, 'id'>) => Promise<void>;
  updateEPrescription: (prescription: EPrescription) => Promise<void>;
  deleteEPrescription: (id: string) => Promise<void>;
  
  // Utility methods
  convertToPrescription: (ePrescriptionId: string) => Promise<void>;
  getPrescriptionsByPatientId: (patientId: number) => Prescription[];
  getEPrescriptionsByPatientId: (patientId: number) => EPrescription[];
  getActivePrescriptionsCount: () => number;
  getPendingEPrescriptionsCount: () => number;
}

export const usePrescriptionStore = create<PrescriptionStore>((set, get) => ({
  prescriptions: [],
  ePrescriptions: [],
  isLoading: false,
  
  // Prescription methods
  fetchPrescriptions: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedPrescriptions = data.map(p => ({
          ...p,
          medications: Array.isArray(p.medications) ? p.medications as Medication[] : []
        }));
        set({ prescriptions: formattedPrescriptions, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      set({ isLoading: false });
    }
  },
  
  addPrescription: async (prescriptionData) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .insert({
          patient_name: prescriptionData.patient_name,
          doctor_name: prescriptionData.doctor_name,
          medications: prescriptionData.medications,
          status: prescriptionData.status || 'active',
          notes: prescriptionData.notes,
          date: prescriptionData.date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedPrescription = {
        ...data,
        medications: Array.isArray(data.medications) ? data.medications as Medication[] : []
      };
      
      set((state) => ({
        prescriptions: [formattedPrescription, ...state.prescriptions]
      }));
    } catch (error) {
      console.error('Error adding prescription:', error);
      throw error;
    }
  },
  
  updatePrescription: async (prescription) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({
          patient_name: prescription.patient_name,
          patient_id: prescription.patient_id,
          doctor_name: prescription.doctor_name,
          date: prescription.date,
          status: prescription.status,
          medications: prescription.medications,
          notes: prescription.notes,
        })
        .eq('id', prescription.id);
      
      if (error) throw error;
      
      set((state) => ({
        prescriptions: state.prescriptions.map((p) => 
          p.id === prescription.id ? prescription : p
        )
      }));
    } catch (error) {
      console.error('Error updating prescription:', error);
      throw error;
    }
  },
  
  deletePrescription: async (id) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        prescriptions: state.prescriptions.filter((p) => p.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  },
  
  // E-Prescription methods
  fetchEPrescriptions: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('e_prescriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedEPrescriptions = data.map(p => ({
          ...p,
          medications: Array.isArray(p.medications) ? p.medications as Medication[] : []
        }));
        set({ ePrescriptions: formattedEPrescriptions, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching e-prescriptions:', error);
      set({ isLoading: false });
    }
  },
  
  addEPrescription: async (prescriptionData) => {
    try {
      const { data, error } = await supabase
        .from('e_prescriptions')
        .insert({
          patient_name: prescriptionData.patient_name,
          doctor_name: prescriptionData.doctor_name,
          hospital_name: prescriptionData.hospital_name,
          medications: prescriptionData.medications,
          status: prescriptionData.status || 'pending',
          notes: prescriptionData.notes,
          date: prescriptionData.date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedEPrescription = {
        ...data,
        medications: Array.isArray(data.medications) ? data.medications as Medication[] : []
      };
      
      set((state) => ({
        ePrescriptions: [formattedEPrescription, ...state.ePrescriptions]
      }));
    } catch (error) {
      console.error('Error adding e-prescription:', error);
      throw error;
    }
  },
  
  updateEPrescription: async (prescription) => {
    try {
      const { error } = await supabase
        .from('e_prescriptions')
        .update({
          patient_name: prescription.patient_name,
          patient_id: prescription.patient_id,
          doctor_name: prescription.doctor_name,
          hospital_name: prescription.hospital_name,
          date: prescription.date,
          status: prescription.status,
          medications: prescription.medications,
          notes: prescription.notes,
        })
        .eq('id', prescription.id);
      
      if (error) throw error;
      
      set((state) => ({
        ePrescriptions: state.ePrescriptions.map((p) => 
          p.id === prescription.id ? prescription : p
        )
      }));
    } catch (error) {
      console.error('Error updating e-prescription:', error);
      throw error;
    }
  },
  
  deleteEPrescription: async (id) => {
    try {
      const { error } = await supabase
        .from('e_prescriptions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        ePrescriptions: state.ePrescriptions.filter((p) => p.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting e-prescription:', error);
      throw error;
    }
  },
  
  // Convert E-prescription to regular prescription
  convertToPrescription: async (ePrescriptionId) => {
    const ePrescription = get().ePrescriptions.find(p => p.id === ePrescriptionId);
    
    if (ePrescription) {
      try {
        // Add as a regular prescription
        await get().addPrescription({
          patient_name: ePrescription.patient_name,
          patient_id: ePrescription.patient_id,
          doctor_name: ePrescription.doctor_name,
          date: new Date().toISOString().split('T')[0],
          status: "active",
          medications: ePrescription.medications,
          notes: `Converted from e-prescription. Original notes: ${ePrescription.notes || ''}`
        });
        
        // Update e-prescription status
        await get().updateEPrescription({
          ...ePrescription,
          status: "processed"
        });
      } catch (error) {
        console.error('Error converting e-prescription:', error);
        throw error;
      }
    }
  },
  
  // Get prescriptions by patient ID
  getPrescriptionsByPatientId: (patientId) => {
    return get().prescriptions.filter(prescription => 
      prescription.patient_id === patientId
    );
  },
  
  // Get e-prescriptions by patient ID
  getEPrescriptionsByPatientId: (patientId) => {
    return get().ePrescriptions.filter(prescription => 
      prescription.patient_id === patientId
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
}));