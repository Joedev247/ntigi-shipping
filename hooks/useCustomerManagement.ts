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
        customerData.telephone || customerData.phone_number,
        customerData.full_name || `${customerData.firstName} ${customerData.lastName}`,
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

  const updateCustomer = async (clientId: string, customerData: any) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await clientService.updateClient(clientId, customerData);
      setCustomers(customers.map(c => c.client_id === clientId ? updated : c));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, error, addCustomer, updateCustomer, fetchCustomers };
};
