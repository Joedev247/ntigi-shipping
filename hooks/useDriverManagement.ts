import { useState, useEffect } from 'react';

export const useDriverManagement = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Can use userService for drivers with DRIVER role
      setDrivers([
        { id: '1', name: 'Driver One', phone: '+237690264022', vehicle: 'KA-123-KE', branch: 'Douala', status: 'Active' },
        { id: '2', name: 'Driver Two', phone: '+237690264023', vehicle: 'KA-456-LF', branch: 'Yaounde', status: 'Active' }
      ]);
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
      const newDriver = { id: Date.now().toString(), ...driverData };
      setDrivers([newDriver, ...drivers]);
      return newDriver;
    } catch (err: any) {
      setError(err.message || 'Failed to create driver');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return { drivers, loading, error, addDriver, fetchDrivers };
};
