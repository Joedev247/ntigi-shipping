'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container, PageLayout } from '@/components/Layout';
import { Card } from '@/components/Card';
import { FormInput, FormSelect } from '@/components/Form';
import { Button } from '@/components/Button';
import { Alert, LoadingSpinner } from '@/components/Alert';
import { TrackingDisplay } from '@/components/ShipmentComponents';
import { shipmentService } from '@/services/shipmentService';
import { formatCurrency } from '@/utils/formatUtils';

export default function PublicTrackingPage() {
  const [trackingNo, setTrackingNo] = useState('');
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShipment(null);
    setLoading(true);

    try {
      const data = await shipmentService.getShipmentByTracking(trackingNo.toUpperCase());
      if (data) {
        setShipment(data);
      } else {
        setError('Shipment not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-12 shadow-md">
        <Container>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">Track Your Shipment</h1>
              <p className="text-green-100 max-w-2xl">Quickly find live updates, locations and delivery details using your tracking number.</p>
            </div>
            <div className="hidden sm:flex gap-2 items-center">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-medium transition"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm font-medium transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-12">
        {/* Search Form */}
        <Card className="max-w-xl mx-auto mb-8 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-4 p-6">
            <FormInput
              label="Tracking Number"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              placeholder="e.g., TRK-892L"
              required
            />
            <div className="flex gap-3">
              <Button variant="primary" type="submit" className="flex-1" isLoading={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button variant="secondary" type="button" onClick={() => { setTrackingNo(''); setShipment(null); setError(''); }}>
                Clear
              </Button>
            </div>
          </form>
        </Card>

        {/* Error Message */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Searching..." />
          </div>
        )}

        {/* Results */}
        {shipment && !loading && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="text-2xl font-mono font-bold text-gray-900">{shipment.tracking_no}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last update</p>
                  <p className="font-medium text-sm text-gray-700">{new Date(shipment.updated_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <TrackingDisplay
                  tracking_no={shipment.tracking_no}
                  status={shipment.status}
                  lastUpdate={shipment.updated_at}
                />
              </div>
            </div>

            {/* Shipment Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="From">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">{shipment.sender?.full_name}</p>
                  <p className="text-gray-600">{shipment.origin?.stop_name}</p>
                  <p className="text-gray-600">{shipment.origin?.city}</p>
                </div>
              </Card>

              <Card title="To">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">{shipment.receiver?.full_name}</p>
                  <p className="text-gray-600">{shipment.destination?.stop_name}</p>
                  <p className="text-gray-600">{shipment.destination?.city}</p>
                </div>
              </Card>

              <Card title="Package Details">
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-500">Type:</span> {shipment.package_type?.label}
                  </p>
                  <p>
                    <span className="text-gray-500">Description:</span> {shipment.description}
                  </p>
                  {shipment.total_weight && (
                    <p>
                      <span className="text-gray-500">Weight:</span> {shipment.total_weight} kg
                    </p>
                  )}
                </div>
              </Card>

              <Card title="Cost">
                <p className="text-3xl font-bold text-green-600">{formatCurrency(shipment.total_cost, 'XAF')}</p>
              </Card>
            </div>
          </div>
        )}

        {/* No Search */}
        {!shipment && !loading && !error && (
          <Card className="text-center py-12">
            <p className="text-gray-600">Enter a tracking number to get started</p>
          </Card>
        )}
      </Container>
    </div>
  );
}
