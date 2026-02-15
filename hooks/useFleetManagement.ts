import { useState, useEffect } from 'react';
import { vehicleService } from '@/services/vehicleService';

export const useFleetManagement = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: pass actual agencyId from context when available
      const data = await vehicleService.getAllVehicles('');
      setVehicles(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newVehicle = await vehicleService.createVehicle(vehicleData);
      setVehicles([newVehicle, ...vehicles]);
      return newVehicle;
    } catch (err: any) {
      setError(err.message || 'Failed to create vehicle');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return { vehicles, loading, error, addVehicle, fetchVehicles };
};
