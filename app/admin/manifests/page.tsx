'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageLayout, Container } from '@/components/Layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { Alert, LoadingSpinner, Badge } from '@/components/Alert';
import { FormSelect } from '@/components/Form';
import { manifestService } from '@/services/manifestService';
import { vehicleService } from '@/services/vehicleService';
import { userService } from '@/services/userService';
import { formatDateTime, formatCurrency } from '@/utils/formatUtils';

export default function ManifestsPage() {
  const [manifests, setManifests] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const manifestsData = await manifestService.getAllManifests('');
      setManifests(manifestsData);

      const vehiclesData = await vehicleService.getAllVehicles('');
      setVehicles(vehiclesData);

      const driversData = await userService.getDrivers('');
      setDrivers(driversData);
    } catch (err) {
      setError('Failed to load manifests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Manifests">
      <Container>
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Filter */}
        <Card className="mb-6">
          <FormSelect
            label="Filter by Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: '', label: 'All Manifests' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'IN_TRANSIT', label: 'In Transit' },
              { value: 'COMPLETED', label: 'Completed' },
            ]}
          />
        </Card>

        {/* Manifests */}
        <Card>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" text="Loading manifests..." />
            </div>
          ) : manifests.length === 0 ? (
            <p className="text-center py-8 text-gray-600">No manifests found</p>
          ) : (
            <Table
              headers={['ID', 'Vehicle', 'Driver', 'Route', 'Status', 'Items', 'Total', 'Departure']}
              rows={(manifests as any[]).map((m) => [
                m.manifest_id.slice(0, 8),
                m.vehicle?.plate_number || 'N/A',
                m.driver?.full_name || 'N/A',
                `${m.origin?.city} → ${m.destination?.city}`,
                <Badge key={m.manifest_id} text={m.status || 'PENDING'} variant="info" />,
                m.items?.length || 0,
                formatCurrency(m.items?.reduce((sum: number, i: any) => sum + (i.shipment?.total_cost || 0), 0) || 0, 'XAF'),
                formatDateTime(m.departure_time),
              ])}
            />
          )}
        </Card>
      </Container>
    </PageLayout>
  );
}
