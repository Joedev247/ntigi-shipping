'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard, DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { DriverForm } from '@/components/DriverForm';
import { useDriverManagement } from '@/hooks/useDriverManagement';
import toast from 'react-hot-toast';

export default function DriversPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { drivers, loading, error, addDriver } = useDriverManagement();

  const handleAddDriver = async (formData: any) => {
    try {
      await addDriver(formData);
      toast.success('Driver added successfully!');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add driver');
    }
  };

  const filteredDrivers = drivers.filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    active: drivers.length,
    suspended: 0,
    inactive: 0,
    total: drivers.length
  };

  if (loading) {
    return (
      <DashboardLayout title="Drivers">
        <SkeletonLoader rows={5} columns={5} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Drivers">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatsCard label="Active" value={stats.active} color="green" />
        <StatsCard label="Suspended" value={stats.suspended} color="orange" />
        <StatsCard label="Inactive" value={stats.inactive} color="purple" />
        <StatsCard label="Total" value={stats.total} color="green" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <SearchBar
          placeholder="Search driver..."
          onSearch={setSearchTerm}
        />
        <ActionButton
          label="+ new Driver"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'vehicle', label: 'Vehicle' },
          { key: 'branch', label: 'Branch' },
          { key: 'status', label: 'Status' }
        ]}
        data={filteredDrivers}
      />

      {/* Driver Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Driver"
        width="lg"
      >
        <DriverForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddDriver}
        />
      </Modal>
    </DashboardLayout>
  );
}
 
