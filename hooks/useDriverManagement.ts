import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export const useDriverManagement = (agencyId?: string) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch drivers with DRIVER role
      const data = await userService.getDrivers(agencyId || 'default-agency');
      setDrivers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (driverData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newDriver = await userService.createUser({
        full_name: driverData.full_name || driverData.name,
        phone_number: driverData.phone_number || driverData.phone,
        email: driverData.email || '',
        branch_id: driverData.branch_id || '',
        role: 'DRIVER',
        is_active: true,
      });
      setDrivers([newDriver, ...drivers]);
      return newDriver;
    } catch (err: any) {
      setError(err.message || 'Failed to create driver');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDriver = async (driverId: string, driverData: any) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await userService.updateUser(driverId, driverData);
      setDrivers(drivers.map(d => d.user_id === driverId ? updated : d));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update driver');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (driverId: string) => {
    setLoading(true);
    setError(null);
    try {
      // For soft delete, update is_active to false
      await userService.updateUser(driverId, { is_active: false });
      setDrivers(drivers.filter(d => d.user_id !== driverId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete driver');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [agencyId]);

  return { drivers, loading, error, addDriver, updateDriver, deleteDriver, fetchDrivers };
};
