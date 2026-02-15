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

  // Get current session
  async getSession() {
    const client = getSupabaseClient();
    const { data: { session }, error } = await client.auth.getSession();
    if (error) throw new Error(`Error fetching session: ${error.message}`);
    return session;
  },

  // Get current user with profile
  async getCurrentUserProfile() {
    const client = getSupabaseClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return null;
    
    try {
      const { data: profile } = await client
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return profile || null;
    } catch (err) {
      return null;
    }
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
  async createUser(user: Omit<AppUser, 'created_at' | 'user_id'>) {
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

  // Sign up with user profile
  async signUp(email: string, password: string, fullName?: string, phoneNumber?: string) {
    const client = getSupabaseClient();
    
    // Create auth user
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });
    // Debug log signup response in development
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('Supabase signUp response:', { data, error });
    }
    
    if (error) {
      const status = (error as any)?.status;
      const msg = (error as any)?.message || '';
      if (status === 429 || msg.includes('Too Many Requests') || msg.includes('429')) {
        throw new Error('Too many requests to the authentication service. Please wait a minute and try again.');
      }
      throw new Error(`Error signing up: ${error.message}`);
    }
    
    // Create user profile in database if we have the user ID
    if (data.user?.id) {
      try {
        await (client.from('users') as any).insert([{
          user_id: data.user.id,
          full_name: fullName || email.split('@')[0],
          phone_number: phoneNumber || '',
          email: email,
          branch_id: 'default-branch',
          role: 'AGENT',
          is_active: true
        }]).select();
      } catch (err) {
        console.error('Error creating user profile:', err);
        // Don't throw, as auth was successful
      }
    }
    
    // If Supabase already returned a session (no email confirmation required), return that
    if (data.session) {
      return data;
    }

    // Otherwise, attempt server-side auto-confirmation (requires SUPABASE_SERVICE_ROLE_KEY in server env)
    try {
      if (data.user?.id) {
        try {
          const confirmResp = await fetch('/api/auth/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: data.user.id }),
          });
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug('Auto-confirm response:', await confirmResp.clone().json().catch(() => ({})), 'status', confirmResp.status);
          }
          // If confirmation succeeded, try signing in
          if (confirmResp.ok) {
            const signInResult = await client.auth.signInWithPassword({ email, password });
            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.debug('Supabase signIn after auto-confirm response:', signInResult);
            }
            if (signInResult.data?.session) return signInResult.data;
          }
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug('Auto-confirm attempt failed:', err);
          }
        }
      }
      // Fallback: return the original signUp data
      return data;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('Error attempting signIn after signUp:', err);
      }
      return data;
    }
  },

  // Sign in
  async signIn(email: string, password: string) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    // Temporary debug logging for development: log Supabase auth response
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('Supabase signIn response:', { data, error });
    }
    if (error) {
      const status = (error as any)?.status;
      const msg = (error as any)?.message || '';
      if (status === 429 || msg.includes('Too Many Requests') || msg.includes('429')) {
        throw new Error('Too many requests to the authentication service. Please wait a minute and try again.');
      }
      throw new Error(`Error signing in: ${error.message}`);
    }
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
