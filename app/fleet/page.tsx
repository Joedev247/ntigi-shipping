'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { FleetForm } from '@/components/FleetForm';
import { useFleetManagement } from '@/hooks/useFleetManagement';
import toast from 'react-hot-toast';

export default function FleetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { vehicles, loading, error, addVehicle } = useFleetManagement();

  const handleAddFleet = async (formData: any) => {
    try {
      const vehicleData = {
        plate_number: formData.vehiclePlate,
        vehicle_type: formData.fleetType.toUpperCase(),
        capacity_kg: 1000, // Default capacity
        is_trackable: true,
        agency_id: 'default-agency' // Should come from context/session
      };
      
      await addVehicle(vehicleData);
      toast.success('Vehicle added successfully!');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add vehicle');
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Fleet">
        <SkeletonLoader rows={5} columns={4} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Fleet">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <SearchBar 
          placeholder="Search vehicles..." 
          onSearch={setSearchTerm}
        />
        <ActionButton 
          label="+ New Vehicle" 
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'vehicle_id', label: 'ID' },
          { key: 'plate_number', label: 'License Plate' },
          { key: 'vehicle_type', label: 'Type' },
          { key: 'capacity_kg', label: 'Capacity (kg)' },
          { key: 'is_trackable', label: 'Trackable', render: (v) => v ? 'Yes' : 'No' }
        ]}
        data={filteredVehicles}
      />

      {/* Fleet Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Vehicle"
        width="lg"
      >
        <FleetForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddFleet}
        />
      </Modal>
    </DashboardLayout>
  );
}
