'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { FormSelect, FormInput } from '@/components/Form';
import { Alert } from '@/components/Alert';
import { Package, CheckCircle, Clock } from 'phosphor-react';
import toast from 'react-hot-toast';

interface ShipmentAssignmentFormProps {
  manifestId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ShipmentAssignmentForm: React.FC<ShipmentAssignmentFormProps> = ({
  manifestId,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    shipmentId: '',
    notes: ''
  });

  // Sample shipments available for assignment
  const availableShipments = [
    { value: 'TRK001AB', label: 'TRK001AB - Douala to Yaoundé (15 kg)' },
    { value: 'TRK002CD', label: 'TRK002CD - Douala to Bamenda (8 kg)' },
    { value: 'TRK003EF', label: 'TRK003EF - Douala to Buea (12 kg)' },
    { value: 'TRK004GH', label: 'TRK004GH - Douala to Yaoundé (20 kg)' },
    { value: 'TRK005IJ', label: 'TRK005IJ - Douala to Bamenda (5 kg)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.shipmentId) {
        setError('Please select a shipment');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Shipment assigned to manifest!');
      setFormData({ shipmentId: '', notes: '' });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to assign shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <Package size={20} className="text-blue-600" />
          <h3 className="font-semibold text-gray-800">Assign Shipment to Trip</h3>
        </div>

        <FormSelect
          label="Select Shipment"
          name="shipmentId"
          value={formData.shipmentId}
          onChange={handleInputChange}
          options={availableShipments}
          required
        />

        <FormInput
          label="Notes (Optional)"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Special handling instructions..."
        />

        <div className="flex gap-3 pt-4">
          <Button variant="primary" type="submit" isLoading={loading} className="flex-1">
            Assign Shipment
          </Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentAssignmentForm;
