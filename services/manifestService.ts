import { getSupabaseClient } from '@/lib/supabase';
import { Manifest } from '@/types';

export const manifestService = {
  // Get all manifests
  async getAllManifests(agencyId: string, filters?: any) {
    const client = getSupabaseClient();
    let query = client
      .from('manifests')
      .select(`
        *,
        vehicle:vehicle_id(plate_number, vehicle_type),
        driver:driver_id(full_name, phone_number),
        origin:origin_id(stop_name, city),
        destination:dest_id(stop_name, city),
        items:manifest_items(shipment_id, shipment:shipments(tracking_no, total_cost))
      `);

    if (filters?.status) query = query.eq('status', filters.status);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching manifests: ${error.message}`);
    return data;
  },

  // Create manifest
  async createManifest(manifest: Omit<Manifest, 'created_at'>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('manifests') as any)
      .insert([manifest])
      .select();
    if (error) throw new Error(`Error creating manifest: ${error.message}`);
    return data[0] as Manifest;
  },

  // Add shipment to manifest
  async addShipmentToManifest(manifestId: string, shipmentId: string) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('manifest_items') as any)
      .insert([{ manifest_id: manifestId, shipment_id: shipmentId }])
      .select();
    if (error) throw new Error(`Error adding shipment to manifest: ${error.message}`);
    return data[0];
  },

  // Remove shipment from manifest
  async removeShipmentFromManifest(manifestItemId: string) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('manifest_items')
      .delete()
      .eq('manifest_item_id', manifestItemId);
    if (error) throw new Error(`Error removing shipment: ${error.message}`);
  },

  // Update manifest status
  async updateManifestStatus(manifestId: string, status: string) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('manifests') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('manifest_id', manifestId)
      .select();
    if (error) throw new Error(`Error updating manifest: ${error.message}`);
    return data[0];
  },

  // Record arrival
  async recordArrival(manifestId: string) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('manifests') as any)
      .update({ arrival_time: new Date().toISOString() })
      .eq('manifest_id', manifestId)
      .select();
    if (error) throw new Error(`Error recording arrival: ${error.message}`);
    return data[0];
  },

  // Get manifest items
  async getManifestItems(manifestId: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('manifest_items')
      .select(`
        *,
        shipment:shipment_id(tracking_no, total_cost, status, sender:sender_id(full_name), receiver:receiver_id(full_name))
      `)
      .eq('manifest_id', manifestId);
    if (error) throw new Error(`Error fetching manifest items: ${error.message}`);
    return data;
  },
};
