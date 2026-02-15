'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageLayout, Container } from '@/components/Layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { Alert, LoadingSpinner } from '@/components/Alert';
import { FormInput, FormSelect } from '@/components/Form';
import { vehicleService } from '@/services/vehicleService';
import { formatDateTime } from '@/utils/formatUtils';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    plate_number: '',
    vehicle_type: 'VAN',
    capacity_kg: '',
    is_trackable: false,
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      // Note: Need agencyId from context
      const data = await vehicleService.getAllVehicles('');
      setVehicles(data);
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // generate a simple vehicle id for now
      const vehicleId = `veh_${Date.now()}`;

      await vehicleService.createVehicle({
        vehicle_id: vehicleId,
        agency_id: '', // Should come from context
        plate_number: formData.plate_number,
        vehicle_type: formData.vehicle_type as any,
        capacity_kg: formData.capacity_kg ? parseFloat(formData.capacity_kg) : undefined,
        is_trackable: formData.is_trackable,
      });

      setSuccess('Vehicle added successfully!');
      setFormData({ plate_number: '', vehicle_type: 'VAN', capacity_kg: '', is_trackable: false });
      setShowForm(false);
      loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add vehicle');
    }
  };

  return (
    <PageLayout title="Fleet Management">
      <Container>
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Add Vehicle Button */}
        <Card className="mb-6">
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'danger' : 'primary'}>
            {showForm ? '✕ Cancel' : '+ Register Vehicle'}
          </Button>
        </Card>

        {/* Form */}
        {showForm && (
          <Card title="Register New Vehicle" className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="License Plate"
                value={formData.plate_number}
                onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                placeholder="e.g., CA 123 AB"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Vehicle Type"
                  value={formData.vehicle_type}
                  onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                  options={[
                    { value: 'BIKE', label: 'Motorcycle/Bike' },
                    { value: 'VAN', label: 'Van' },
                    { value: 'BUS', label: 'Bus' },
                    { value: 'TRUCK', label: 'Truck' },
                  ]}
                />

                <FormInput
                  label="Capacity (kg)"
                  type="number"
                  value={formData.capacity_kg}
                  onChange={(e) => setFormData({ ...formData, capacity_kg: e.target.value })}
                  placeholder="e.g., 5000"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trackable"
                  checked={formData.is_trackable}
                  onChange={(e) => setFormData({ ...formData, is_trackable: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="trackable" className="text-sm text-gray-700">
                  Enable GPS Tracking
                </label>
              </div>

              <Button variant="primary" type="submit">
                Register Vehicle
              </Button>
            </form>
          </Card>
        )}

        {/* Vehicles List */}
        <Card>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" text="Loading vehicles..." />
            </div>
          ) : vehicles.length === 0 ? (
            <p className="text-center py-8 text-gray-600">No vehicles registered</p>
          ) : (
            <Table
              headers={['Plate Number', 'Type', 'Capacity', 'Trackable', 'Registered']}
              rows={vehicles.map((v) => [
                v.plate_number,
                v.vehicle_type,
                v.capacity_kg ? `${v.capacity_kg} kg` : 'N/A',
                v.is_trackable ? '✓ Yes' : '✗ No',
                formatDateTime(v.created_at),
              ])}
            />
          )}
        </Card>
      </Container>
    </PageLayout>
  );
}
