import { getSupabaseClient } from '@/lib/supabase';
import { Shipment, ShipmentPhoto } from '@/types';
import { generateTrackingNumber } from '@/utils/trackingUtils';

export const shipmentService = {
  // Get all shipments
  async getAllShipments(agencyId?: string, filters?: any) {
    const client = getSupabaseClient();
    let query = client.from('shipments').select(`
      *,
      sender:sender_id(full_name, phone_number),
      receiver:receiver_id(full_name, phone_number),
      origin:origin_id(stop_name, city),
      destination:dest_id(stop_name, city),
      package_type:package_type_id(label, unit_type, price_per_unit),
      photos:shipment_photos(photo_id, image_url, stage)
    `);

    if (agencyId) query = query.eq('agency_id', agencyId);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.senderId) query = query.eq('sender_id', filters.senderId);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching shipments: ${error.message}`);
    return data;
  },

  // Get shipment by tracking number
  async getShipmentByTracking(trackingNo: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('shipments')
      .select(`
        *,
        sender:sender_id(full_name, phone_number),
        receiver:receiver_id(full_name, phone_number),
        origin:origin_id(stop_name, city, latitude, longitude),
        destination:dest_id(stop_name, city, latitude, longitude),
        package_type:package_type_id(label, unit_type, price_per_unit),
        photos:shipment_photos(photo_id, image_url, stage, captured_at),
        transaction:transactions(txn_id, method, amount, tax_amount),
        tracking_logs:tracking_logs(latitude, longitude, timestamp)
      `)
      .eq('tracking_no', trackingNo)
      .single();
    if (error) throw new Error(`Error fetching shipment: ${error.message}`);
    return data;
  },

  // Create shipment
  async createShipment(shipmentData: Omit<Shipment, 'tracking_no' | 'created_at' | 'updated_at'> & { agency_id: string }) {
    const trackingNo = generateTrackingNumber();
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('shipments') as any)
      .insert([{ ...shipmentData, tracking_no: trackingNo }])
      .select() as Promise<{ data: any; error: any }>;
    if (error) throw new Error(`Error creating shipment: ${error.message}`);
    return (data?.[0] || {}) as any;
  },

  // Update shipment status
  async updateShipmentStatus(trackingNo: string, status: Shipment['status']) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('shipments') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('tracking_no', trackingNo)
      .select() as Promise<{ data: any; error: any }>;
    if (error) throw new Error(`Error updating shipment: ${error.message}`);
    return (data?.[0] || {}) as any;
  },

  // Upload shipment photo
  async uploadShipmentPhoto(shipmentId: string, file: File, stage: 'INTAKE' | 'DELIVERY') {
    const fileName = `${shipmentId}-${stage}-${Date.now()}.jpg`;
    const client = getSupabaseClient();
    const { data: uploadData, error: uploadError } = await client.storage
      .from('shipment-photos')
      .upload(fileName, file);

    if (uploadError) throw new Error(`Error uploading photo: ${uploadError.message}`);

    const photoRecord = {
      shipment_id: shipmentId,
      image_url: uploadData.path,
      stage,
      captured_at: new Date().toISOString(),
    };

    const { data: photoData, error: photoError } = await (client
      .from('shipment_photos') as any)
      .insert([photoRecord])
      .select() as Promise<{ data: any; error: any }>;

    if (photoError) throw new Error(`Error saving photo record: ${photoError.message}`);
    return (photoData?.[0] || {}) as any;
  },

  // Get shipment photos
  async getShipmentPhotos(trackingNo: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('shipment_photos')
      .select('*')
      .eq('shipment_id', trackingNo);
    if (error) throw new Error(`Error fetching photos: ${error.message}`);
    return data as ShipmentPhoto[];
  },

  // Calculate shipment cost
  async calculateShipmentCost(packageTypeId: string, quantity: number, weight?: number, volume?: number) {
    const client = getSupabaseClient();
    const { data: packageType, error: packageError } = await client
      .from('package_types')
      .select('*')
      .eq('type_id', packageTypeId)
      .single();

    if (packageError) throw new Error(`Error fetching package type: ${packageError.message}`);

    let cost = 0;
    switch ((packageType as any)?.unit_type) {
      case 'WEIGHT':
        cost = (weight || 1) * (packageType as any)?.price_per_unit;
        break;
      case 'VOLUME':
        cost = (volume || 1) * (packageType as any)?.price_per_unit;
        break;
      case 'ITEM_COUNT':
        cost = quantity * (packageType as any)?.price_per_unit;
        break;
      case 'FLAT_RATE':
        cost = (packageType as any)?.price_per_unit;
        break;
    }

    return cost;
  },
};
