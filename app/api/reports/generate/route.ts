import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, format = 'csv', thresholdHours = 48, startDate, endDate } = body || {};

    if (!type) {
      return NextResponse.json({ error: 'Missing report type' }, { status: 400 });
    }

    // For now we support only delayed shipments; this endpoint acts as a "job" creator
    if (type === 'DELAYED_SHIPMENTS') {
      // In a production system this would enqueue a background job. Here we return
      // a ready-to-download URL which calls the delayed generator route.
      const params = new URLSearchParams();
      params.set('format', format);
      params.set('thresholdHours', String(thresholdHours));
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const downloadUrl = `/api/reports/delayed?${params.toString()}`;

      // Return a simple job object (synchronously completed)
      const jobId = `job-${Date.now()}`;
      return NextResponse.json({ jobId, status: 'completed', downloadUrl });
    }

    return NextResponse.json({ error: 'Unsupported report type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
