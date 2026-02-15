import { getSupabaseClient } from '@/lib/supabase';
import { Vehicle } from '@/types';

export const vehicleService = {
  // Get all vehicles
  async getAllVehicles(agencyId: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('vehicles')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching vehicles: ${error.message}`);
    return data as Vehicle[];
  },

  // Get vehicle by ID
  async getVehicleById(vehicleId: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('vehicles')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .single();
    if (error) throw new Error(`Error fetching vehicle: ${error.message}`);
    return data as Vehicle;
  },

  // Create vehicle
  async createVehicle(vehicle: Omit<Vehicle, 'created_at'>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('vehicles') as any)
      .insert([vehicle])
      .select();
    if (error) throw new Error(`Error creating vehicle: ${error.message}`);
    return data[0] as Vehicle;
  },

  // Update vehicle
  async updateVehicle(vehicleId: string, updates: Partial<Vehicle>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('vehicles') as any)
      .update(updates)
      .eq('vehicle_id', vehicleId)
      .select();
    if (error) throw new Error(`Error updating vehicle: ${error.message}`);
    return data[0] as Vehicle;
  },

  // Delete vehicle
  async deleteVehicle(vehicleId: string) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('vehicles')
      .delete()
      .eq('vehicle_id', vehicleId);
    if (error) throw new Error(`Error deleting vehicle: ${error.message}`);
  },

  // Get vehicles by type
  async getVehiclesByType(agencyId: string, type: Vehicle['vehicle_type']) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('vehicles')
      .select('*')
      .eq('agency_id', agencyId)
      .eq('vehicle_type', type);
    if (error) throw new Error(`Error fetching vehicles: ${error.message}`);
    return data as Vehicle[];
  },
};
