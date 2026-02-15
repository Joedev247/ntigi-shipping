import { useState, useEffect } from 'react';

export const useExpenseManagement = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement expense service
      setExpenses([
        { id: '1', date: '2024-01-12', description: 'Fuel', amount: '8000', category: 'Fuel', memo: 'ABC123' },
        { id: '2', date: '2024-01-11', description: 'Maintenance', amount: '5000', category: 'Maintenance', memo: 'XYZ789' }
      ]);
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
      const newExpense = { id: Date.now().toString(), ...expenseData };
      setExpenses([newExpense, ...expenses]);
      return newExpense;
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, loading, error, addExpense, fetchExpenses };
};
