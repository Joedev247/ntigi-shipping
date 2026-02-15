import { getSupabaseClient } from '@/lib/supabase';
import { AppUser } from '@/types';

export const userService = {
  // Get current user
  async getCurrentUser() {
    const client = getSupabaseClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (error) throw new Error(`Error fetching current user: ${error.message}`);
    return user;
  },

  // Get user by phone
  async getUserByPhone(phone: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('phone_number', phone)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as AppUser | null;
  },

  // Get all users in branch
  async getUsersByBranch(branchId: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('branch_id', branchId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching users: ${error.message}`);
    return data as AppUser[];
  },

  // Get all drivers
  async getDrivers(agencyId: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('users')
      .select('*, branch:branch_id(*)')
      .eq('role', 'DRIVER')
      .eq('branch.agency_id', agencyId);
    if (error) throw new Error(`Error fetching drivers: ${error.message}`);
    return data as (AppUser & { branch: any })[];
  },

  // Create user (for internal agents)
  async createUser(user: Omit<AppUser, 'created_at'>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('users') as any)
      .insert([user])
      .select();
    if (error) throw new Error(`Error creating user: ${error.message}`);
    return data[0] as AppUser;
  },

  // Update user
  async updateUser(userId: string, updates: Partial<AppUser>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('users') as any)
      .update(updates)
      .eq('user_id', userId)
      .select();
    if (error) throw new Error(`Error updating user: ${error.message}`);
    return data[0] as AppUser;
  },

  // Sign up
  async signUp(email: string, password: string) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });
    if (error) throw new Error(`Error signing up: ${error.message}`);
    return data;
  },

  // Sign in
  async signIn(email: string, password: string) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(`Error signing in: ${error.message}`);
    return data;
  },

  // Sign out
  async signOut() {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) throw new Error(`Error signing out: ${error.message}`);
  },

  // Reset password
  async resetPassword(email: string) {
    const client = getSupabaseClient();
    const { error } = await client.auth.resetPasswordForEmail(email);
    if (error) throw new Error(`Error resetting password: ${error.message}`);
  },
};
