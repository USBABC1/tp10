import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções para gerenciar dados dos pacientes
export const patientService = {
  // Criar novo paciente
  async createPatient(patientData) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Buscar todos os pacientes
  async getPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar paciente por ID
  async getPatient(id) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar paciente
  async updatePatient(id, patientData) {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Deletar paciente
  async deletePatient(id) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Funções para gerenciar odontogramas
export const odontogramaService = {
  // Salvar odontograma
  async saveOdontograma(patientId, teethStatus, observations) {
    const { data, error } = await supabase
      .from('odontogramas')
      .insert([{
        patient_id: patientId,
        teeth_status: teethStatus,
        observations: observations,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Buscar odontogramas de um paciente
  async getOdontogramas(patientId) {
    const { data, error } = await supabase
      .from('odontogramas')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar último odontograma de um paciente
  async getLatestOdontograma(patientId) {
    const { data, error } = await supabase
      .from('odontogramas')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Atualizar odontograma
  async updateOdontograma(id, teethStatus, observations) {
    const { data, error } = await supabase
      .from('odontogramas')
      .update({
        teeth_status: teethStatus,
        observations: observations,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

