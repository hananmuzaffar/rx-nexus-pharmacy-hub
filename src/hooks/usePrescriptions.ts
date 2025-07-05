
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export type Prescription = {
  id: string;
  patient_name: string;
  patient_id: number;
  doctor_name: string;
  date: string;
  status: string;
  medications: any[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type EPrescription = {
  id: string;
  patient_name: string;
  patient_id: number;
  doctor_name: string;
  hospital_name: string;
  date: string;
  status: string;
  medications: any[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export const usePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [ePrescriptions, setEPrescriptions] = useState<EPrescription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    try {
      const [prescriptionsResult, ePrescriptionsResult] = await Promise.all([
        supabase.from('prescriptions').select('*').order('created_at', { ascending: false }),
        supabase.from('e_prescriptions').select('*').order('created_at', { ascending: false })
      ]);

      if (prescriptionsResult.error) throw prescriptionsResult.error;
      if (ePrescriptionsResult.error) throw ePrescriptionsResult.error;

      // Transform the data to match our types
      const transformedPrescriptions: Prescription[] = (prescriptionsResult.data || []).map(item => ({
        ...item,
        medications: Array.isArray(item.medications) ? item.medications : []
      }));

      const transformedEPrescriptions: EPrescription[] = (ePrescriptionsResult.data || []).map(item => ({
        ...item,
        medications: Array.isArray(item.medications) ? item.medications : []
      }));

      setPrescriptions(transformedPrescriptions);
      setEPrescriptions(transformedEPrescriptions);
    } catch (error: any) {
      console.error('Error fetching prescriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prescriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPrescription = async (prescription: Omit<Prescription, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .insert([prescription])
        .select()
        .single();

      if (error) throw error;
      
      const transformedData: Prescription = {
        ...data,
        medications: Array.isArray(data.medications) ? data.medications : []
      };
      
      setPrescriptions(prev => [transformedData, ...prev]);
      toast({
        title: "Success",
        description: "Prescription added successfully",
      });
      return transformedData;
    } catch (error: any) {
      console.error('Error adding prescription:', error);
      toast({
        title: "Error",
        description: "Failed to add prescription",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addEPrescription = async (prescription: Omit<EPrescription, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('e_prescriptions')
        .insert([prescription])
        .select()
        .single();

      if (error) throw error;
      
      const transformedData: EPrescription = {
        ...data,
        medications: Array.isArray(data.medications) ? data.medications : []
      };
      
      setEPrescriptions(prev => [transformedData, ...prev]);
      toast({
        title: "Success",
        description: "E-Prescription added successfully",
      });
      return transformedData;
    } catch (error: any) {
      console.error('Error adding e-prescription:', error);
      toast({
        title: "Error",
        description: "Failed to add e-prescription",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPrescriptionsByPatientId = (patientId: number) => {
    return prescriptions.filter(p => p.patient_id === patientId);
  };

  const getEPrescriptionsByPatientId = (patientId: number) => {
    return ePrescriptions.filter(p => p.patient_id === patientId);
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return {
    prescriptions,
    ePrescriptions,
    loading,
    addPrescription,
    addEPrescription,
    getPrescriptionsByPatientId,
    getEPrescriptionsByPatientId,
    refetch: fetchPrescriptions
  };
};
