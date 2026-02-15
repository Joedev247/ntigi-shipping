'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
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
      <div className="bg-green-600 text-white py-12">
        <Container>
          <h1 className="text-4xl font-bold mb-2">Track Your Shipment</h1>
          <p className="text-green-100">Enter your tracking number to monitor your delivery</p>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-12">
        {/* Search Form */}
        <Card className="max-w-lg mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <FormInput
              label="Tracking Number"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              placeholder="e.g., TRK-892L"
              required
            />
            <Button variant="primary" type="submit" className="w-full" isLoading={loading}>
              Search
            </Button>
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
            <TrackingDisplay
              tracking_no={shipment.tracking_no}
              status={shipment.status}
              lastUpdate={shipment.updated_at}
            />

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
