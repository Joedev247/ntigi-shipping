import { getSupabaseClient } from '@/lib/supabase';
import { Branch } from '@/types';

export const branchService = {
  // Get all branches
  async getAllBranches(agencyId?: string) {
    const client = getSupabaseClient();
    let query = client.from('branches').select('*');
    if (agencyId) query = query.eq('agency_id', agencyId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching branches: ${error.message}`);
    return data as Branch[];
  },

  // Get branch by ID
  async getBranchById(branchId: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('branches')
      .select('*')
      .eq('branch_id', branchId)
      .single();
    if (error) throw new Error(`Error fetching branch: ${error.message}`);
    return data as Branch;
  },

  // Create branch
  async createBranch(branch: Omit<Branch, 'created_at'>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('branches') as any)
      .insert([branch])
      .select();
    if (error) throw new Error(`Error creating branch: ${error.message}`);
    return data[0] as Branch;
  },

  // Update branch
  async updateBranch(branchId: string, updates: Partial<Branch>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('branches') as any)
      .update(updates)
      .eq('branch_id', branchId)
      .select();
    if (error) throw new Error(`Error updating branch: ${error.message}`);
    return data[0] as Branch;
  },

  // Delete branch
  async deleteBranch(branchId: string) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('branches')
      .delete()
      .eq('branch_id', branchId);
    if (error) throw new Error(`Error deleting branch: ${error.message}`);
  },

  // Get branches by city
  async getBranchesByCity(city: string, agencyId?: string) {
    const client = getSupabaseClient();
    let query = client.from('branches').select('*').eq('city', city);
    if (agencyId) query = query.eq('agency_id', agencyId);
    const { data, error } = await query;
    if (error) throw new Error(`Error fetching branches by city: ${error.message}`);
    return data as Branch[];
  },
};
