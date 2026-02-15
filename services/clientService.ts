import { getSupabaseClient } from '@/lib/supabase';
import { Client } from '@/types';

export const clientService = {
  // Get all clients
  async getAllClients(agencyId?: string) {
    const client = getSupabaseClient();
    let query = client.from('clients').select('*');
    if (agencyId) query = query.eq('agency_id', agencyId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(`Error fetching clients: ${error.message}`);
    return data as Client[];
  },

  // Get client by ID
  async getClientById(clientId: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
      .single();
    if (error) throw new Error(`Error fetching client: ${error.message}`);
    return data as Client;
  },

  // Get or create client by phone
  async getOrCreateClient(phone: string, fullName: string, email?: string) {
    // First, try to get existing client
    const client = getSupabaseClient();
    const { data: existing, error: getError } = await client
      .from('clients')
      .select('*')
      .eq('phone_number', phone)
      .single();

    if (existing) return existing as Client;

    // Create new client if not found
    const { data: newClient, error: createError } = await (client
      .from('clients') as any)
      .insert([
        {
          phone_number: phone,
          full_name: fullName,
          email,
          is_verified: false,
        },
      ])
      .select();

    if (createError) throw new Error(`Error creating client: ${createError.message}`);
    return newClient[0] as Client;
  },

  // Update client
  async updateClient(clientId: string, updates: Partial<Client>) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('clients') as any)
      .update(updates)
      .eq('client_id', clientId)
      .select();
    if (error) throw new Error(`Error updating client: ${error.message}`);
    return data[0] as Client;
  },

  // Verify client phone
  async verifyClientPhone(clientId: string) {
    const client = getSupabaseClient();
    const { data, error } = await (client
      .from('clients') as any)
      .update({ is_verified: true })
      .eq('client_id', clientId)
      .select();
    if (error) throw new Error(`Error verifying client: ${error.message}`);
    return data[0] as Client;
  },

  // Search clients
  async searchClients(query: string, agencyId?: string) {
    const client = getSupabaseClient();
    let supabaseQuery = client
      .from('clients')
      .select('*')
      .or(`phone_number.ilike.%${query}%,full_name.ilike.%${query}%`);

    if (agencyId) supabaseQuery = supabaseQuery.eq('agency_id', agencyId);

    const { data, error } = await supabaseQuery;
    if (error) throw new Error(`Error searching clients: ${error.message}`);
    return data as Client[];
  },
};
