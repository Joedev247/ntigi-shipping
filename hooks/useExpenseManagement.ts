import { useState, useEffect } from 'react';
import { expenseService } from '@/services/expenseService';

export const useExpenseManagement = (agencyId?: string, filters?: any) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getAllExpenses(agencyId, filters);
      setExpenses(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newExpense = await expenseService.createExpense({
        agency_id: agencyId || 'default-agency',
        ...expenseData,
      });
      setExpenses([newExpense, ...expenses]);
      return newExpense;
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (expenseId: string, expenseData: any) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await expenseService.updateExpense(expenseId, expenseData);
      setExpenses(expenses.map(e => e.expense_id === expenseId ? updated : e));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    setLoading(true);
    setError(null);
    try {
      await expenseService.deleteExpense(expenseId);
      setExpenses(expenses.filter(e => e.expense_id !== expenseId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [agencyId, filters]);

  return { expenses, loading, error, addExpense, updateExpense, deleteExpense, fetchExpenses };
};
