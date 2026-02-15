import { useState, useEffect } from 'react';
import { clientService } from '@/services/clientService';

export const useCustomerManagement = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getAllClients();
      setCustomers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await clientService.getOrCreateClient(
        customerData.telephone,
        `${customerData.firstName} ${customerData.lastName}`,
        customerData.email
      );
      setCustomers([newCustomer, ...customers]);
      return newCustomer;
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, error, addCustomer, fetchCustomers };
};
