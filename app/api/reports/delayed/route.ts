import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

function toCsv(rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const lines = rows.map(r => keys.map(k => {
    const v = r[k] ?? '';
    const s = String(v).replace(/"/g, '""');
    return `"${s.replace(/\n/g, ' ')}"`;
  }).join(','));
  return [header, ...lines].join('\n');
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const url = new URL(req.url);
    const format = (url.searchParams.get('format') || 'csv').toLowerCase();
    const thresholdHours = Number(url.searchParams.get('thresholdHours') || '48');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Fetch shipments with related manifest and client/branch info
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        tracking_no,
        status,
        created_at,
        updated_at,
        manifest:manifest_id(manifest_id, departure_time, arrival_time),
        sender:sender_id(full_name, phone_number),
        receiver:receiver_id(full_name, phone_number),
        origin:origin_id(stop_name, city),
        destination:dest_id(stop_name, city)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const now = new Date();
    const thresholdMs = thresholdHours * 3600 * 1000;

    let rows = (data || []).filter((s: any) => {
      if (!s) return false;
      if (s.status === 'DELIVERED' || s.status === 'CANCELLED') return false;
      const manifest = s.manifest;
      if (manifest?.arrival_time) {
        return new Date(manifest.arrival_time).getTime() < now.getTime();
      }
      if (manifest?.departure_time) {
        return new Date(manifest.departure_time).getTime() + thresholdMs < now.getTime();
      }
      // fallback: created_at older than threshold
      if (s.created_at) {
        return new Date(s.created_at).getTime() + thresholdMs < now.getTime();
      }
      return false;
    });

    // Apply optional date filters (created_at)
    if (startDate) {
      const sd = new Date(startDate).getTime();
      rows = rows.filter((r: any) => new Date(r.created_at).getTime() >= sd);
    }
    if (endDate) {
      const ed = new Date(endDate).getTime();
      rows = rows.filter((r: any) => new Date(r.created_at).getTime() <= ed);
    }

    const mapped = rows.map((r: any) => ({
      tracking_no: r.tracking_no,
      status: r.status,
      created_at: r.created_at,
      updated_at: r.updated_at,
      manifest_departure: r.manifest?.departure_time || '',
      manifest_arrival: r.manifest?.arrival_time || '',
      origin: r.origin?.stop_name || '',
      origin_city: r.origin?.city || '',
      destination: r.destination?.stop_name || '',
      destination_city: r.destination?.city || '',
      sender_name: r.sender?.full_name || '',
      sender_phone: r.sender?.phone_number || '',
      receiver_name: r.receiver?.full_name || '',
      receiver_phone: r.receiver?.phone_number || ''
    }));

    if (format === 'csv') {
      const csv = toCsv(mapped);
      const filename = `delayed-shipments-${new Date().toISOString().replace(/[:.]/g,'-')}.csv`;
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

    // default JSON
    return NextResponse.json({ count: mapped.length, rows: mapped });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
