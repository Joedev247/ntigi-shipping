'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, Container } from '@/components/Layout';
import { Card, Grid } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { Alert, LoadingSpinner } from '@/components/Alert';
import { FormInput, FormSelect } from '@/components/Form';
import { branchService } from '@/services/branchService';
import { formatDateTime } from '@/utils/formatUtils';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    stop_name: '',
    city: '',
    latitude: '',
    longitude: '',
    printer_type: 'THERMAL_80MM',
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await branchService.getAllBranches();
      setBranches(data);
    } catch (err) {
      setError('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // generate a simple unique stop_id for now (replace with proper ID generation in backend)
      const stopId = `stop_${Date.now()}`;

      await branchService.createBranch({
        stop_id: stopId,
        agency_id: '', // Should come from context
        stop_name: formData.stop_name,
        city: formData.city,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        printer_type: formData.printer_type as 'THERMAL_58MM' | 'THERMAL_80MM',
      });

      setSuccess('Branch created successfully!');
      setFormData({ stop_name: '', city: '', latitude: '', longitude: '', printer_type: 'THERMAL_80MM' });
      setShowForm(false);
      loadBranches();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create branch');
    }
  };

  return (
    <PageLayout title="Manage Branches">
      <Container>
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Add Branch Button */}
        <Card className="mb-6">
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'danger' : 'primary'}>
            {showForm ? '✕ Cancel' : '+ Add New Branch'}
          </Button>
        </Card>

        {/* Form */}
        {showForm && (
          <Card title="Add New Branch" className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Stop Name"
                  value={formData.stop_name}
                  onChange={(e) => setFormData({ ...formData, stop_name: e.target.value })}
                  placeholder="e.g., Mvan Station"
                  required
                />
                <FormInput
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g., Yaoundé"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  label="Latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  step="0.0001"
                  required
                />
                <FormInput
                  label="Longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  step="0.0001"
                  required
                />
                <FormSelect
                  label="Printer Type"
                  value={formData.printer_type}
                  onChange={(e) => setFormData({ ...formData, printer_type: e.target.value })}
                  options={[
                    { value: 'THERMAL_58MM', label: '58mm Thermal' },
                    { value: 'THERMAL_80MM', label: '80mm Thermal' },
                  ]}
                />
              </div>

              <Button variant="primary" type="submit">
                Create Branch
              </Button>
            </form>
          </Card>
        )}

        {/* Branches List */}
        <Card>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" text="Loading branches..." />
            </div>
          ) : branches.length === 0 ? (
            <p className="text-center py-8 text-gray-600">No branches found</p>
          ) : (
            <Table
              headers={['Stop Name', 'City', 'Coordinates', 'Printer', 'Created']}
              rows={branches.map((b) => [
                b.stop_name,
                b.city,
                `${b.latitude.toFixed(4)}, ${b.longitude.toFixed(4)}`,
                b.printer_type,
                formatDateTime(b.created_at),
              ])}
            />
          )}
        </Card>
      </Container>
    </PageLayout>
  );
}
