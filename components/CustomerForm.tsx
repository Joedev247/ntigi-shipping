'use client';

import React, { useState } from 'react';
import { User, Image as ImageIcon } from 'phosphor-react';
import { FormInput, FormSelect, FormTextarea } from '@/components/Form';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import toast from 'react-hot-toast';

interface CustomerFormProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    alternatePhone: '',
    
    // Company Information
    companyName: '',
    businessType: '',
    taxId: '',
    
    // Location Information
    region: '',
    city: '',
    branch: 'Douala',
    
    // Address Details
    streetAddress: '',
    neighborhood: '',
    postalCode: '',
    
    // Additional Information
    preferredContact: 'PHONE',
    notes: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cameroon Regions
  const cameroonRegions = [
    'Adamaoua',
    'Centre',
    'East',
    'Far North',
    'Littoral',
    'North',
    'North-West',
    'South',
    'South-West',
    'West'
  ];

  // Cameroon Major Cities
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

  const branches = ['Douala', 'Yaoundé', 'Kribi', 'Bamenda', 'Esboewa'];
  
  const businessTypes = [
    'Individual',
    'Sole Proprietor',
    'Partnership',
    'Limited Company',
    'Corporation',
    'NGO/Non-profit',
    'Government Agency',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

      if (!formData.telephone.trim()) {
        setError('Telephone number is required');
        setLoading(false);
        return;
      }

      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Valid email address is required');
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
      
      toast.success('Customer added successfully!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <Alert type="error" message={error} />}

      {/* Profile Photo Section */}
      <div className="flex justify-center">
        <div className="relative w-full">
          <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center overflow-hidden border border-green-200">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center flex flex-col items-center gap-2">
                <ImageIcon size={48} weight="duotone" className="text-green-600" />
                <p className="text-sm text-green-600 font-medium">Click to upload customer image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Section 1: Personal Information */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Primary Phone"
            name="telephone"
            placeholder="+237 672 254 254"
            value={formData.telephone}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Alternate Phone"
            name="alternatePhone"
            placeholder="+237 670 123 456"
            value={formData.alternatePhone}
            onChange={handleInputChange}
          />
          <FormSelect
            label="Preferred Contact"
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleInputChange}
            options={[
              { value: 'PHONE', label: 'Phone' },
              { value: 'EMAIL', label: 'Email' },
              { value: 'BOTH', label: 'Both' }
            ]}
          />
        </div>
      </div>

      {/* Section 2: Company Information */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Company Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Company Name"
            name="companyName"
            placeholder="Your Company Ltd."
            value={formData.companyName}
            onChange={handleInputChange}
          />
          <FormSelect
            label="Business Type"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            options={businessTypes.map(type => ({ value: type, label: type }))}
          />
          <FormInput
            label="Tax ID / NIF"
            name="taxId"
            placeholder="NIF-*****"
            value={formData.taxId}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Section 3: Location & Branch Assignment */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Location & Branch</h3>
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
          <FormSelect
            label="Assigned Branch"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            options={branches.map(b => ({ value: b, label: b }))}
            required
          />
        </div>
      </div>

      {/* Section 4: Address Details */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Address Details</h3>
        <div className="space-y-4">
          <FormInput
            label="Street Address"
            name="streetAddress"
            placeholder="Street name and number"
            value={formData.streetAddress}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Neighborhood / District"
              name="neighborhood"
              placeholder="New Bell, Akwa..."
              value={formData.neighborhood}
              onChange={handleInputChange}
            />
            <FormInput
              label="Postal Code"
              name="postalCode"
              placeholder="e.g., 8000"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Section 5: Additional Notes */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Additional Information</h3>
        <FormTextarea
          label="Notes"
          name="notes"
          placeholder="Add any special notes or preferences..."
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
          {loading ? 'Adding Customer...' : '+ Add Customer'}
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

export default CustomerForm;
