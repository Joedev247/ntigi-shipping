import { supabase } from '@/lib/supabase';
import { Agency } from '@/types';

export const agencyService = {
  // Get all agencies
  async getAllAgencies() {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching agencies: ${error.message}`);
    return data as Agency[];
  },

  // Get agency by ID
  async getAgencyById(agencyId: string) {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('agency_id', agencyId)
      .single();
    if (error) throw new Error(`Error fetching agency: ${error.message}`);
    return data as Agency;
  },

  // Create agency
  async createAgency(agency: Omit<Agency, 'created_at'>) {
    const { data, error } = await supabase
      .from('agencies')
      .insert([agency])
      .select();
    if (error) throw new Error(`Error creating agency: ${error.message}`);
    return data[0] as Agency;
  },

  // Update agency
  async updateAgency(agencyId: string, updates: Partial<Agency>) {
    const { data, error } = await supabase
      .from('agencies')
      .update(updates)
      .eq('agency_id', agencyId)
      .select();
    if (error) throw new Error(`Error updating agency: ${error.message}`);
    return data[0] as Agency;
  },

  // Delete agency
  async deleteAgency(agencyId: string) {
    const { error } = await supabase
      .from('agencies')
      .delete()
      .eq('agency_id', agencyId);
    if (error) throw new Error(`Error deleting agency: ${error.message}`);
  },
};
