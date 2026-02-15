'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, User, Truck, Camera } from 'phosphor-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/Form';
import { Alert } from '@/components/Alert';
import { shipmentService } from '@/services/shipmentService';
import { clientService } from '@/services/clientService';
import { branchService } from '@/services/branchService';
import { packageTypeService } from '@/services/packageTypeService';
import { PhotoUpload } from '@/components/MapComponents';

// Cameroon Regions
const cameroonRegions = [
  'Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North',
  'North West', 'South', 'South West', 'West'
];

// Cameroon Cities by Region
const cameroonCities: { [key: string]: string[] } = {
  'Adamawa': ['Ngaoundéré', 'Garoua', 'Meiganga'],
  'Centre': ['Yaoundé', 'Bafia', 'Mbalmayo'],
  'East': ['Bertoua', 'Batouri', 'Kontcha'],
  'Far North': ['Maroua', 'Garoua', 'Kaele'],
  'Littoral': ['Douala', 'Edéa', 'Bafoussam'],
  'North': ['Garoua', 'Ngaoundéré', 'Meiganga'],
  'North West': ['Bamenda', 'Kumba', 'Menchum'],
  'South': ['Ebolowa', 'Sangmelima', 'Kribi'],
  'South West': ['Buea', 'Kumba', 'Limbe'],
  'West': ['Bafoussam', 'Dschang', 'Foumban']
};

interface CreateShipmentFormProps {
  onClose?: () => void;
  onSuccess?: (tracking_no: string) => void;
}

export const CreateShipmentForm: React.FC<CreateShipmentFormProps> = ({ onClose, onSuccess }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [branches, setBranches] = useState<any[]>([]);
  const [packageTypes, setPackageTypes] = useState<any[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    // Sender Information
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderRegion: 'Littoral',
    senderCity: 'Douala',
    
    // Receiver Information
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverRegion: 'Littoral',
    receiverCity: 'Douala',
    
    // Route
    originId: '',
    destId: '',
    
    // Package Details
    packageTypeId: '',
    description: '',
    weight: '',
    volume: '',
    quantity: '',
    
    // Documentation
    takePhoto: false,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const branchesData = await branchService.getAllBranches();
      setBranches(branchesData);

      const packageTypesData = await packageTypeService.getAllPackageTypes('');
      setPackageTypes(packageTypesData);
    } catch (err) {
      setError('Failed to load branch data');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      setPhotoFile(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const sender = await clientService.getOrCreateClient(
        formData.senderPhone,
        formData.senderName,
        formData.senderEmail
      );

      const receiver = await clientService.getOrCreateClient(
        formData.receiverPhone,
        formData.receiverName,
        formData.receiverEmail
      );

      const cost = await shipmentService.calculateShipmentCost(
        formData.packageTypeId,
        parseInt(formData.quantity) || 1,
        parseFloat(formData.weight),
        parseFloat(formData.volume)
      );

      const shipment = await shipmentService.createShipment({
        sender_id: sender.client_id,
        receiver_id: receiver.client_id,
        origin_id: formData.originId,
        dest_id: formData.destId,
        package_type_id: formData.packageTypeId,
        description: formData.description,
        total_weight: formData.weight ? parseFloat(formData.weight) : undefined,
        total_volume: formData.volume ? parseFloat(formData.volume) : undefined,
        quantity: formData.quantity ? parseInt(formData.quantity) : 1,
        total_cost: cost,
        status: 'PENDING',
        agency_id: '',
      });

      if (photoFile && formData.takePhoto) {
        await shipmentService.uploadShipmentPhoto(shipment.tracking_no, photoFile, 'INTAKE');
      }

      setSuccess(`Shipment created successfully! Tracking: ${shipment.tracking_no}`);
      if (onSuccess) onSuccess(shipment.tracking_no);
      if (!onSuccess) setTimeout(() => router.push(`/tracking/${shipment.tracking_no}`), 1200);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Sender Information */}
        <div className="bg-green-50 p-4  border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Sender Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              placeholder="Sender's full name"
              required
            />
            <FormInput
              label="Phone Number"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleInputChange}
              placeholder="+237 6XX XXX XXX"
              required
            />
            <FormInput
              label="Email (Optional)"
              name="senderEmail"
              type="email"
              value={formData.senderEmail}
              onChange={handleInputChange}
              placeholder="sender@example.com"
            />
            <FormSelect
              label="Region"
              name="senderRegion"
              value={formData.senderRegion}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  senderRegion: e.target.value,
                  senderCity: cameroonCities[e.target.value]?.[0] || '',
                });
              }}
              options={cameroonRegions.map((r) => ({ value: r, label: r }))}
              required
            />
            <FormSelect
              label="City"
              name="senderCity"
              value={formData.senderCity}
              onChange={handleInputChange}
              options={cameroonCities[formData.senderRegion]?.map((c) => ({ value: c, label: c })) || []}
              required
            />
          </div>
        </div>

        {/* Section 2: Receiver Information */}
        <div className="bg-green-50 p-4  border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Receiver Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleInputChange}
              placeholder="Receiver's full name"
              required
            />
            <FormInput
              label="Phone Number"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleInputChange}
              placeholder="+237 6XX XXX XXX"
              required
            />
            <FormInput
              label="Email (Optional)"
              name="receiverEmail"
              type="email"
              value={formData.receiverEmail}
              onChange={handleInputChange}
              placeholder="receiver@example.com"
            />
            <FormSelect
              label="Region"
              name="receiverRegion"
              value={formData.receiverRegion}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  receiverRegion: e.target.value,
                  receiverCity: cameroonCities[e.target.value]?.[0] || '',
                });
              }}
              options={cameroonRegions.map((r) => ({ value: r, label: r }))}
              required
            />
            <FormSelect
              label="City"
              name="receiverCity"
              value={formData.receiverCity}
              onChange={handleInputChange}
              options={cameroonCities[formData.receiverRegion]?.map((c) => ({ value: c, label: c })) || []}
              required
            />
          </div>
        </div>

        {/* Section 3: Route & Locations */}
        <div className="bg-purple-50 p-4  border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-purple-600" />
            <h3 className="font-semibold text-gray-800">Route & Locations</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Pickup Location (Origin)"
              name="originId"
              value={formData.originId}
              onChange={handleInputChange}
              options={branches.map((b) => ({ value: b.stop_id, label: `${b.stop_name}, ${b.city}` }))}
              required
            />
            <FormSelect
              label="Delivery Location (Destination)"
              name="destId"
              value={formData.destId}
              onChange={handleInputChange}
              options={branches.map((b) => ({ value: b.stop_id, label: `${b.stop_name}, ${b.city}` }))}
              required
            />
          </div>
        </div>

        {/* Section 4: Package Details */}
        <div className="bg-amber-50 p-4  border border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={20} className="text-amber-600" />
            <h3 className="font-semibold text-gray-800">Package Details</h3>
          </div>
          <FormSelect
            label="Package Type"
            name="packageTypeId"
            value={formData.packageTypeId}
            onChange={handleInputChange}
            options={packageTypes.map((p) => ({ value: p.type_id, label: p.label }))}
            required
          />
          <FormTextarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="What are you shipping?"
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.1"
            />
            <FormInput
              label="Volume (m³)"
              name="volume"
              type="number"
              value={formData.volume}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
            />
            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="1"
              min="1"
            />
          </div>
        </div>

        {/* Section 5: Documentation */}
        <div className="bg-indigo-50 p-4  border border-indigo-200">
          <div className="flex items-center gap-2 mb-4">
            <Camera size={20} className="text-indigo-600" />
            <h3 className="font-semibold text-gray-800">Documentation</h3>
          </div>
          <FormCheckbox
            label="Attach Intake Photo"
            name="takePhoto"
            checked={formData.takePhoto}
            onChange={handleCheckboxChange}
          />
          {formData.takePhoto && (
            <div className="mt-4">
              <PhotoUpload stage="INTAKE" onUpload={handlePhotoUpload} isLoading={uploading} />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button variant="primary" type="submit" isLoading={loading}>
            Create Shipment
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (onClose) onClose();
              else router.back();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateShipmentForm;
