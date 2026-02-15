'use client';

import React, { useState } from 'react';
import { User, Car } from 'phosphor-react';
import { FormInput, FormSelect, FormTextarea } from '@/components/Form';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import toast from 'react-hot-toast';

interface DriverFormProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const DriverForm: React.FC<DriverFormProps> = ({ onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // License & Compliance
    licenseNumber: '',
    licenseExpiry: '',
    licenseType: 'HEAVY',
    
    // Assignment
    branch: 'Douala',
    vehicleAssignment: '',
    status: 'ACTIVE',
    
    // Additional Information
    notes: '',
  });

  const branches = ['Douala', 'Yaoundé', 'Kribi', 'Bamenda', 'Esboewa'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('First and last names are required');
        setLoading(false);
        return;
      }

      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Valid email address is required');
        setLoading(false);
        return;
      }

      if (!formData.phone.trim()) {
        setError('Phone number is required');
        setLoading(false);
        return;
      }

      if (!formData.licenseNumber.trim()) {
        setError('License number is required');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSubmit) {
        onSubmit(formData);
      }

      toast.success('Driver added successfully!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add driver');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} />}

      {/* Section 1: Personal Information */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-green-600" />
          <h3 className="font-semibold text-gray-800">Personal Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter first name"
            required
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter last name"
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="driver@example.com"
            required
          />
          <FormInput
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+237 XXX XX XX XX"
            required
          />
          <FormInput
            label="Emergency Contact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="Contact name"
          />
          <FormInput
            label="Emergency Phone"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleInputChange}
            placeholder="+237 XXX XX XX XX"
          />
        </div>
      </div>

      {/* Section 2: License & Compliance */}
      <div className="bg-green-50 p-4  border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Car size={20} className="text-green-600" />
          <h3 className="font-semibold text-gray-800">License & Compliance</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="License Number"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            placeholder="e.g., CM123456789"
            required
          />
          <FormInput
            label="License Expiry Date"
            name="licenseExpiry"
            type="date"
            value={formData.licenseExpiry}
            onChange={handleInputChange}
          />
          <FormSelect
            label="License Type"
            name="licenseType"
            value={formData.licenseType}
            onChange={handleInputChange}
            options={[
              { value: 'LIGHT', label: 'Light Vehicles' },
              { value: 'HEAVY', label: 'Heavy Vehicles' },
              { value: 'BOTH', label: 'Light & Heavy' },
            ]}
          />
        </div>
      </div>

      {/* Section 3: Job Assignment */}
      <div className="bg-green-50 p-4  border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Car size={20} className="text-green-600" />
          <h3 className="font-semibold text-gray-800">Job Assignment</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Assigned Branch"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            options={branches.map(b => ({ value: b, label: b }))}
            required
          />
          <FormInput
            label="Vehicle Assignment"
            name="vehicleAssignment"
            value={formData.vehicleAssignment}
            onChange={handleInputChange}
            placeholder="License plate or vehicle ID"
          />
          <FormSelect
            label="Employment Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'LEAVE', label: 'On Leave' },
              { value: 'SUSPENDED', label: 'Suspended' },
            ]}
          />
        </div>
      </div>

      {/* Section 4: Additional Information */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Additional Information</h3>
        <FormTextarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Additional notes about driver..."
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Adding Driver...' : 'Add Driver'}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-300 hover:bg-gray-400"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
