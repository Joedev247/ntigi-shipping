'use client';

import React, { useState } from 'react';
import { MapPin } from 'phosphor-react';
import { FormInput, FormSelect, FormTextarea } from '@/components/Form';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import toast from 'react-hot-toast';

interface BranchFormProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const BranchForm: React.FC<BranchFormProps> = ({ onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Branch Identification
    branchCode: '',
    branchName: '',
    status: 'ACTIVE',
    
    // Manager Information
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    
    // Contact Information
    branchPhone: '',
    branchEmail: '',
    
    // Location
    region: '',
    city: '',
    
    // Address
    streetAddress: '',
    
    // Operations
    printerType: '58mm',
    operatingHours: '',
    
    // Additional
    notes: '',
  });

  // Cameroon Regions
  const cameroonRegions = [
    'Adamaoua', 'Centre', 'East', 'Far North', 'Littoral',
    'North', 'North-West', 'South', 'South-West', 'West'
  ];

  const cameroonCities: { [key: string]: string[] } = {
    'Littoral': ['Douala', 'Edéa', 'Manfe', 'Nkongamba'],
    'Centre': ['Yaoundé', 'Soa', 'Mbalmayo', 'Awae'],
    'West': ['Bafoussam', 'Mbouda', 'Dschang', 'Foumban'],
    'North-West': ['Bamenda', 'Kumbo', 'Bui', 'Wum'],
    'North': ['Ngaoundéré', 'Garoua', 'Meiganga', 'Tibati'],
    'Far North': ['Maroua', 'Garoua', 'Kaele', 'Kousseri'],
    'East': ['Bertoua', 'Batouri', 'Lombard', 'Abong-Mbang'],
    'South': ['Ebolowa', 'Sangmelima', 'Djoum', 'Kribi'],
    'South-West': ['Buea', 'Limbé', 'Kumba', 'Mamfe'],
    'Adamaoua': ['Ngaoundéré', 'Meiganga', 'Tibati', 'Rey Bouba']
  };

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
      if (!formData.branchCode.trim()) {
        setError('Branch code is required');
        setLoading(false);
        return;
      }

      if (!formData.branchName.trim()) {
        setError('Branch name is required');
        setLoading(false);
        return;
      }

      if (!formData.managerName.trim()) {
        setError('Manager name is required');
        setLoading(false);
        return;
      }

      if (!formData.branchPhone.trim() || !formData.branchEmail.trim()) {
        setError('Branch contact information is required');
        setLoading(false);
        return;
      }

      if (!formData.region || !formData.city) {
        setError('Region and city are required');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSubmit) {
        onSubmit(formData);
      }

      toast.success('Branch added successfully!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add branch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} />}

      {/* Section 1: Branch Identification */}
      <div className="bg-green-50 p-4  border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-green-600" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Branch Identification</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Branch Code"
            name="branchCode"
            placeholder="BR-001"
            value={formData.branchCode}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Branch Name"
            name="branchName"
            placeholder="Douala Main Branch"
            value={formData.branchName}
            onChange={handleInputChange}
            required
          />
          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' }
            ]}
          />
        </div>
      </div>

      {/* Section 2: Manager Information */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Manager Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Manager Name"
            name="managerName"
            placeholder="John Doe"
            value={formData.managerName}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Manager Phone"
            name="managerPhone"
            placeholder="+237 672 254 254"
            value={formData.managerPhone}
            onChange={handleInputChange}
          />
          <FormInput
            label="Manager Email"
            name="managerEmail"
            type="email"
            placeholder="manager@example.com"
            value={formData.managerEmail}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Section 3: Branch Contact Information */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Branch Contact</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Branch Phone"
            name="branchPhone"
            placeholder="+237 690 264 022"
            value={formData.branchPhone}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Branch Email"
            name="branchEmail"
            type="email"
            placeholder="branch@example.com"
            value={formData.branchEmail}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Section 4: Location */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Region"
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            options={cameroonRegions.map(r => ({ value: r, label: r }))}
            required
          />
          <FormSelect
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            options={
              formData.region
                ? cameroonCities[formData.region]?.map(c => ({ value: c, label: c })) || []
                : []
            }
            required
          />
          <div className="col-span-2">
            <FormInput
              label="Street Address"
              name="streetAddress"
              placeholder="Street name and number"
              value={formData.streetAddress}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Section 5: Operations */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Operations</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Printer Type"
            name="printerType"
            value={formData.printerType}
            onChange={handleInputChange}
            options={[
              { value: '58mm', label: '58mm Thermal' },
              { value: '80mm', label: '80mm Thermal' },
              { value: 'INKJET', label: 'Inkjet' }
            ]}
          />
          <FormInput
            label="Operating Hours"
            name="operatingHours"
            placeholder="09:00 - 18:00"
            value={formData.operatingHours}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Section 6: Additional Notes */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Additional Information</h3>
        <FormTextarea
          label="Notes"
          name="notes"
          placeholder="Add any special notes or requirements for this branch..."
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          isLoading={loading}
          className="flex-1"
        >
          {loading ? 'Adding Branch...' : '+ Add Branch'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BranchForm;
