import { supabase } from '@/lib/supabase';
import { PackageType } from '@/types';

export const packageTypeService = {
  // Get all package types
  async getAllPackageTypes(agencyId: string) {
    const { data, error } = await supabase
      .from('package_types')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching package types: ${error.message}`);
    return data as PackageType[];
  },

  // Get package type by ID
  async getPackageTypeById(typeId: string) {
    const { data, error } = await supabase
      .from('package_types')
      .select('*')
      .eq('type_id', typeId)
      .single();
    if (error) throw new Error(`Error fetching package type: ${error.message}`);
    return data as PackageType;
  },

  // Create package type
  async createPackageType(packageType: Omit<PackageType, 'created_at'>) {
    const { data, error } = await supabase
      .from('package_types')
      .insert([packageType])
      .select();
    if (error) throw new Error(`Error creating package type: ${error.message}`);
    return data[0] as PackageType;
  },

  // Update package type
  async updatePackageType(typeId: string, updates: Partial<PackageType>) {
    const { data, error } = await supabase
      .from('package_types')
      .update(updates)
      .eq('type_id', typeId)
      .select();
    if (error) throw new Error(`Error updating package type: ${error.message}`);
    return data[0] as PackageType;
  },

  // Delete package type
  async deletePackageType(typeId: string) {
    const { error } = await supabase
      .from('package_types')
      .delete()
      .eq('type_id', typeId);
    if (error) throw new Error(`Error deleting package type: ${error.message}`);
  },
};
