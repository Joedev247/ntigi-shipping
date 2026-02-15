import { supabase } from '@/lib/supabase';
import { TrackingLog, Transaction } from '@/types';

export const trackingService = {
  // Log vehicle location
  async logVehicleLocation(vehicleId: string, latitude: number, longitude: number) {
    const { data, error } = await supabase
      .from('tracking_logs')
      .insert([{ vehicle_id: vehicleId, latitude, longitude, timestamp: new Date().toISOString() }])
      .select();
    if (error) throw new Error(`Error logging location: ${error.message}`);
    return data[0] as TrackingLog;
  },

  // Get latest vehicle location
  async getLatestVehicleLocation(vehicleId: string) {
    const { data, error } = await supabase
      .from('tracking_logs')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as TrackingLog | null;
  },

  // Get vehicle tracking history
  async getVehicleTrackingHistory(vehicleId: string, limit = 100) {
    const { data, error } = await supabase
      .from('tracking_logs')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw new Error(`Error fetching tracking history: ${error.message}`);
    return data as TrackingLog[];
  },

  // Get shipment tracking route
  async getShipmentTrackingRoute(trackingNo: string) {
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select('*, manifest:manifest_id(vehicle_id, departure_time, arrival_time)')
      .eq('tracking_no', trackingNo)
      .single();

    if (shipmentError) throw new Error(`Error fetching shipment: ${shipmentError.message}`);

    if (!shipment.manifest) {
      return { tracking_no: trackingNo, status: 'PENDING', route: [] };
    }

    const { data: trackingLogs, error: logsError } = await supabase
      .from('tracking_logs')
      .select('*')
      .eq('vehicle_id', shipment.manifest.vehicle_id)
      .gte('timestamp', shipment.manifest.departure_time)
      .lte('timestamp', shipment.manifest.arrival_time || new Date().toISOString())
      .order('timestamp', { ascending: true });

    if (logsError) throw new Error(`Error fetching route: ${logsError.message}`);

    return {
      tracking_no: trackingNo,
      status: shipment.status,
      route: trackingLogs,
    };
  },

  // Get transaction
  async getTransaction(shipmentId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as Transaction | null;
  },
};

export const paymentService = {
  // Record transaction
  async recordTransaction(shipmentId: string, method: string, amount: number, taxAmount: number) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ shipment_id: shipmentId, method, amount, tax_amount: taxAmount }])
      .select();
    if (error) throw new Error(`Error recording transaction: ${error.message}`);
    return data[0] as Transaction;
  },

  // Get transactions by date range
  async getTransactionsByDateRange(agencyId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, shipment:shipment_id(tracking_no, total_cost)')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching transactions: ${error.message}`);
    return data;
  },

  // Calculate revenue
  async calculateRevenue(agencyId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, tax_amount')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw new Error(`Error calculating revenue: ${error.message}`);

    const totalRevenue = data.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalTax = data.reduce((sum, t) => sum + (t.tax_amount || 0), 0);

    return { totalRevenue, totalTax, transactionCount: data.length };
  },
};
