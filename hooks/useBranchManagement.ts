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
        stop_name: branchData.branchName || branchData.stop_name,
        city: branchData.city,
        latitude: branchData.latitude || 0,
        longitude: branchData.longitude || 0,
        printer_type: (branchData.printerType || branchData.printer_type || 'THERMAL_58MM') as 'THERMAL_58MM' | 'THERMAL_80MM'
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

  const updateBranch = async (branchId: string, branchData: any) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await branchService.updateBranch(branchId, branchData);
      setBranches(branches.map(b => b.stop_id === branchId ? updated : b));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBranch = async (branchId: string) => {
    setLoading(true);
    setError(null);
    try {
      await branchService.deleteBranch(branchId);
      setBranches(branches.filter(b => b.stop_id !== branchId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [agencyId]);

  return { branches, loading, error, addBranch, updateBranch, deleteBranch, fetchBranches };
};
