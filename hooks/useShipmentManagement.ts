import { useState, useEffect } from 'react';
import { shipmentService } from '@/services/shipmentService';

export const useShipmentManagement = (agencyId?: string) => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shipmentService.getAllShipments(agencyId);
      setShipments(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const addShipment = async (shipmentData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newShipment = await shipmentService.createShipment(shipmentData);
      setShipments([newShipment, ...shipments]);
      return newShipment;
    } catch (err: any) {
      setError(err.message || 'Failed to create shipment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getShipmentByTracking = async (trackingNo: string) => {
    try {
      const data = await shipmentService.getShipmentByTracking(trackingNo);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shipment');
      return null;
    }
  };

  const updateShipment = async (trackingNo: string, updates: any) => {
    setLoading(true);
    try {
      const updated = await shipmentService.updateShipmentStatus(trackingNo, updates.status);
      setShipments(shipments.map(s => s.tracking_no === trackingNo ? updated : s));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update shipment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [agencyId]);

  return { shipments, loading, error, addShipment, updateShipment, getShipmentByTracking, fetchShipments };
};
