import { getSupabaseClient } from '@/lib/supabase';

export interface Expense {
  expense_id?: string;
  agency_id: string;
  vehicle_id?: string;
  branch_id?: string;
  category: 'FUEL' | 'MAINTENANCE' | 'TOLLS' | 'OTHER';
  amount: number;
  description: string;
  receipt_url?: string;
  expense_date: string;
  created_at?: string;
  updated_at?: string;
}

export const expenseService = {
  // Get all expenses
  async getAllExpenses(agencyId?: string, filters?: any) {
    const client = getSupabaseClient();
    let query = client.from('expenses').select('*');

    if (agencyId) query = query.eq('agency_id', agencyId);
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.vehicleId) query = query.eq('vehicle_id', filters.vehicleId);
    if (filters?.startDate) query = query.gte('expense_date', filters.startDate);
    if (filters?.endDate) query = query.lte('expense_date', filters.endDate);

    const { data, error } = await query.order('expense_date', { ascending: false });
    if (error) throw new Error(`Error fetching expenses: ${error.message}`);
    return data as Expense[];
  },

  // Get expense by ID
  async getExpenseById(expenseId: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('expenses')
      .select('*')
      .eq('expense_id', expenseId)
      .single();
    if (error) throw new Error(`Error fetching expense: ${error.message}`);
    return data as Expense;
  },

  // Create expense
  async createExpense(expense: Omit<Expense, 'expense_id' | 'created_at' | 'updated_at'>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('expenses') as any)
      .insert([expense])
      .select();
    if (error) throw new Error(`Error creating expense: ${error.message}`);
    return (data?.[0] || {}) as Expense;
  },

  // Update expense
  async updateExpense(expenseId: string, updates: Partial<Expense>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('expenses') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('expense_id', expenseId)
      .select();
    if (error) throw new Error(`Error updating expense: ${error.message}`);
    return (data?.[0] || {}) as Expense;
  },

  // Delete expense
  async deleteExpense(expenseId: string) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('expenses')
      .delete()
      .eq('expense_id', expenseId);
    if (error) throw new Error(`Error deleting expense: ${error.message}`);
  },

  // Get expenses by vehicle
  async getExpensesByVehicle(vehicleId: string, agencyId?: string) {
    const client = getSupabaseClient();
    let query = client.from('expenses').select('*').eq('vehicle_id', vehicleId);
    if (agencyId) query = query.eq('agency_id', agencyId);
    const { data, error } = await query.order('expense_date', { ascending: false });
    if (error) throw new Error(`Error fetching vehicle expenses: ${error.message}`);
    return data as Expense[];
  },

  // Get expenses by category
  async getExpensesByCategory(category: string, agencyId?: string) {
    const client = getSupabaseClient();
    let query = client.from('expenses').select('*').eq('category', category);
    if (agencyId) query = query.eq('agency_id', agencyId);
    const { data, error } = await query.order('expense_date', { ascending: false });
    if (error) throw new Error(`Error fetching expenses: ${error.message}`);
    return data as Expense[];
  },

  // Calculate total expenses
  async calculateTotalExpenses(agencyId?: string, startDate?: string, endDate?: string) {
    const client = getSupabaseClient();
    let query = client.from('expenses').select('amount');

    if (agencyId) query = query.eq('agency_id', agencyId);
    if (startDate) query = query.gte('expense_date', startDate);
    if (endDate) query = query.lte('expense_date', endDate);

    const { data, error } = await query;
    if (error) throw new Error(`Error calculating total: ${error.message}`);

    const total = (data || []).reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    return total;
  },
};
