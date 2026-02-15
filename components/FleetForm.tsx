'use client';

import React, { useState } from 'react';
import { User, Bicycle, Car, Truck, Image as ImageIcon } from 'phosphor-react';
import { FormInput, FormSelect } from '@/components/Form';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import toast from 'react-hot-toast';

interface FleetFormProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const FleetForm: React.FC<FleetFormProps> = ({ onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Vehicle Information
    fleetType: '',
    vehiclePlate: '',
    vehicleColor: '',
    
    // Owner/Driver Information
    ownerName: '',
    ownerPhone: '',
    
    // Location & Assignment
    region: '',
    city: '',
    assignedBranch: 'Douala',
    
    profileImage: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const branches = ['Douala', 'Yaoundé', 'Kribi', 'Bamenda', 'Esboewa'];

  const fleetTypes = [
    { id: 'foot', label: 'Foot delivery', icon: User },
    { id: 'bicycle', label: 'Bicycle', icon: Bicycle },
    { id: 'motorcycle', label: 'Motorcycle', icon: Car },
    { id: 'van', label: 'Van', icon: Truck }
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

  const handleFleetTypeSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      fleetType: type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.fleetType) {
        setError('Fleet type is required');
        setLoading(false);
        return;
      }

      if (!formData.vehiclePlate.trim()) {
        setError('Vehicle number plate is required');
        setLoading(false);
        return;
      }

      if (!formData.ownerName.trim()) {
        setError('Owner name is required');
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

      toast.success('Vehicle added successfully!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} />}

      {/* Vehicle Photo Section */}
      <div className="flex justify-center">
        <div className="relative w-full">
          <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center overflow-hidden border border-amber-200">
            {imagePreview ? (
              <img src={imagePreview} alt="Vehicle" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center flex flex-col items-center gap-2">
                <ImageIcon size={48} weight="duotone" className="text-amber-600" />
                <p className="text-sm text-amber-600 font-medium">Click to upload vehicle image</p>
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

      {/* Section 1: Fleet Type Selection */}
      <div className="bg-amber-50 p-4  border border-amber-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Fleet Type</h3>
        <div className="grid grid-cols-4 gap-3">
          {fleetTypes.map(type => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleFleetTypeSelect(type.id)}
                className={`p-4 border-2 rounded transition text-center ${
                  formData.fleetType === type.id
                    ? 'border-amber-600 bg-amber-100'
                    : 'border-amber-200 bg-white hover:bg-amber-50'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <IconComponent size={40} weight="duotone" className="text-amber-700" />
                </div>
                <p className="text-xs font-medium text-gray-700">{type.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Vehicle Information */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Vehicle Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Vehicle Number Plate"
            name="vehiclePlate"
            placeholder="LT-0125"
            value={formData.vehiclePlate}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Vehicle Color"
            name="vehicleColor"
            placeholder="White"
            value={formData.vehicleColor}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Section 3: Owner Information */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Owner / Driver Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Owner/Driver Name"
            name="ownerName"
            placeholder="John Doe"
            value={formData.ownerName}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Phone Number"
            name="ownerPhone"
            placeholder="+237 672 254 254"
            value={formData.ownerPhone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Section 4: Location & Assignment */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Location & Assignment</h3>
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
            name="assignedBranch"
            value={formData.assignedBranch}
            onChange={handleInputChange}
            options={branches.map(b => ({ value: b, label: b }))}
            required
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          isLoading={loading}
          className="flex-1"
        >
          {loading ? 'Adding Vehicle...' : '+ Add Fleet'}
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

export default FleetForm;
