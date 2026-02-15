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
  const [typeFilter, setTypeFilter] = useState('');
  const { vehicles, loading, error, addVehicle, fetchVehicles } = useFleetManagement();

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
      fetchVehicles();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add vehicle');
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === '' || v.vehicle_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Get unique vehicle types for filter
  const vehicleTypes = [...new Set(vehicles.map(v => v.vehicle_type).filter(Boolean))].sort();

  const stats = {
    total: vehicles.length,
    trackable: vehicles.filter(v => v.is_trackable).length,
    non_trackable: vehicles.filter(v => !v.is_trackable).length
  };

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

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <p className="text-sm text-gray-600">Total Vehicles</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <p className="text-sm text-gray-600">Trackable</p>
          <p className="text-2xl font-bold text-green-900">{stats.trackable}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <p className="text-sm text-gray-600">Non-Trackable</p>
          <p className="text-2xl font-bold text-green-900">{stats.non_trackable}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar 
            placeholder="Search by plate number or type..." 
            onSearch={setSearchTerm}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Vehicle Types</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <ActionButton 
          label="+ New Vehicle" 
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'vehicle_id', label: 'ID', render: (v) => v?.substring(0, 8) || 'N/A' },
          { key: 'plate_number', label: 'License Plate' },
          { key: 'vehicle_type', label: 'Type' },
          { key: 'capacity_kg', label: 'Capacity (kg)', render: (v) => v?.toLocaleString() || 0 },
          { key: 'is_trackable', label: 'Trackable', render: (v) => (
            <span className={`px-3 py-1 rounded text-sm font-medium ${v ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {v ? 'Yes' : 'No'}
            </span>
          )}
        ]}
        data={filteredVehicles}
      />

      {filteredVehicles.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No vehicles found. Try adjusting your search or filters.</p>
        </div>
      )}

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

