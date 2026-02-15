'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, Package } from 'phosphor-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FormInput, FormSelect, FormTextarea } from '@/components/Form';
import { Alert } from '@/components/Alert';
import { manifestService } from '@/services/manifestService';

interface ManifestFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const ManifestForm: React.FC<ManifestFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Trip Information
    tripName: '',
    
    // Vehicle & Driver Assignment
    vehicleId: '',
    driverId: '',
    
    // Route
    originId: '',
    destId: '',
    
    // Timeline
    departureTime: '',
    
    // Notes
    notes: ''
  });

  // Sample data - in production, fetch from services
  const vehicles = [
    { value: 'VH001', label: 'Bus 1 (KA-123-KE)' },
    { value: 'VH002', label: 'Truck 1 (KA-456-LF)' },
    { value: 'VH003', label: 'Van 1 (KA-789-MG)' },
    { value: 'VH004', label: 'Bike 1 (KA-012-NH)' }
  ];

  const drivers = [
    { value: 'DR001', label: 'Driver One - +237690264022' },
    { value: 'DR002', label: 'Driver Two - +237690264023' },
    { value: 'DR003', label: 'Driver Three - +237690264024' }
  ];

  const branches = [
    { value: 'BR001', label: 'Douala Branch - Littoral' },
    { value: 'BR002', label: 'Yaoundé Branch - Centre' },
    { value: 'BR003', label: 'Bamenda Branch - North West' },
    { value: 'BR004', label: 'Buea Branch - South West' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.tripName) {
        setError('Trip name is required');
        setLoading(false);
        return;
      }

      if (!formData.vehicleId) {
        setError('Vehicle assignment is required');
        setLoading(false);
        return;
      }

      if (!formData.driverId) {
        setError('Driver assignment is required');
        setLoading(false);
        return;
      }

      if (!formData.originId || !formData.destId) {
        setError('Route (origin and destination) is required');
        setLoading(false);
        return;
      }

      if (!formData.departureTime) {
        setError('Departure time is required');
        setLoading(false);
        return;
      }

      // Simulate API call (in production, use manifestService.createManifest)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess('Manifest created successfully!');
      
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create manifest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Trip Information */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Trip Information</h3>
          </div>
          <FormInput
            label="Trip Name/ID"
            name="tripName"
            value={formData.tripName}
            onChange={handleInputChange}
            placeholder="e.g., Douala-Yaoundé Trip 001"
            required
          />
        </div>

        {/* Section 2: Vehicle & Driver Assignment */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Package size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Vehicle & Driver Assignment</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Vehicle Assignment"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleInputChange}
              options={vehicles}
              required
            />
            <FormSelect
              label="Driver Assignment"
              name="driverId"
              value={formData.driverId}
              onChange={handleInputChange}
              options={drivers}
              required
            />
          </div>
        </div>

        {/* Section 3: Route */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-purple-600" />
            <h3 className="font-semibold text-gray-800">Route</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Origin Branch"
              name="originId"
              value={formData.originId}
              onChange={handleInputChange}
              options={branches}
              required
            />
            <FormSelect
              label="Destination Branch"
              name="destId"
              value={formData.destId}
              onChange={handleInputChange}
              options={branches}
              required
            />
          </div>
        </div>

        {/* Section 4: Timeline */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-amber-600" />
            <h3 className="font-semibold text-gray-800">Timeline</h3>
          </div>
          <FormInput
            label="Departure Time"
            name="departureTime"
            type="datetime-local"
            value={formData.departureTime}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Section 5: Additional Notes */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Additional Notes</h3>
          <FormTextarea
            label="Trip Notes (optional)"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Special instructions, route details, etc."
            rows={3}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button variant="primary" type="submit" isLoading={loading}>
            Create Trip
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ManifestForm;
