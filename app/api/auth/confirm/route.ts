import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id } = body || {};

    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
    }

    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRole || !supabaseUrl) {
      return new Response(JSON.stringify({ error: 'Server not configured with service role key or supabase url' }), { status: 500 });
    }

    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(user_id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
      },
      body: JSON.stringify({ email_confirmed_at: new Date().toISOString() }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data || 'Failed to confirm user' }), { status: res.status });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), { status: 500 });
  }
}

export const runtime = 'edge';
