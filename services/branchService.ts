import { supabase } from '@/lib/supabase';
import { Branch } from '@/types';

export const branchService = {
  // Get all branches
  async getAllBranches(agencyId?: string) {
    let query = supabase.from('branches').select('*');
    if (agencyId) query = query.eq('agency_id', agencyId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching branches: ${error.message}`);
    return data as Branch[];
  },

  // Get branch by ID
  async getBranchById(branchId: string) {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('stop_id', branchId)
      .single();
    if (error) throw new Error(`Error fetching branch: ${error.message}`);
    return data as Branch;
  },

  // Create branch
  async createBranch(branch: Omit<Branch, 'created_at'>) {
    const { data, error } = await supabase
      .from('branches')
      .insert([branch])
      .select();
    if (error) throw new Error(`Error creating branch: ${error.message}`);
    return data[0] as Branch;
  },

  // Update branch
  async updateBranch(branchId: string, updates: Partial<Branch>) {
    const { data, error } = await supabase
      .from('branches')
      .update(updates)
      .eq('stop_id', branchId)
      .select();
    if (error) throw new Error(`Error updating branch: ${error.message}`);
    return data[0] as Branch;
  },

  // Delete branch
  async deleteBranch(branchId: string) {
    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('stop_id', branchId);
    if (error) throw new Error(`Error deleting branch: ${error.message}`);
  },

  // Get branches by city
  async getBranchesByCity(city: string, agencyId?: string) {
    let query = supabase.from('branches').select('*').eq('city', city);
    if (agencyId) query = query.eq('agency_id', agencyId);
    const { data, error } = await query;
    if (error) throw new Error(`Error fetching branches by city: ${error.message}`);
    return data as Branch[];
  },
};
