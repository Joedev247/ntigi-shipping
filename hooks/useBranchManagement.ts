import { useState, useEffect } from 'react';
import { branchService } from '@/services/branchService';

export const useBranchManagement = (agencyId?: string) => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await branchService.getAllBranches(agencyId);
      setBranches(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const addBranch = async (branchData: any) => {
    setLoading(true);
    setError(null);
    try {
      const stopId = `stop_${Date.now()}`;
      const newBranch = await branchService.createBranch({
        stop_id: stopId,
        agency_id: agencyId || 'default-agency',
        stop_name: branchData.branchName,
        city: branchData.city,
        latitude: 0,
        longitude: 0,
        printer_type: (branchData.printerType || 'THERMAL_58MM') as 'THERMAL_58MM' | 'THERMAL_80MM'
      });
      setBranches([newBranch, ...branches]);
      return newBranch;
    } catch (err: any) {
      setError(err.message || 'Failed to create branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [agencyId]);

  return { branches, loading, error, addBranch, fetchBranches };
};
