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
  const [statusFilter, setStatusFilter] = useState('');
  const { drivers, loading, error, addDriver, fetchDrivers } = useDriverManagement();

  const handleAddDriver = async (formData: any) => {
    try {
      await addDriver(formData);
      toast.success('Driver added successfully!');
      setIsModalOpen(false);
      fetchDrivers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add driver');
    }
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || (d.is_active ? 'ACTIVE' : 'INACTIVE') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: drivers.filter(d => d.is_active).length,
    suspended: drivers.filter(d => !d.is_active && d.role === 'DRIVER').length,
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

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search driver by name or phone..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <ActionButton
          label="+ Add Driver"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'user_id', label: 'ID', render: (v) => v?.substring(0, 8) || 'N/A' },
          { key: 'full_name', label: 'Name' },
          { key: 'phone_number', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'is_active', label: 'Status', render: (v) => (
            <span className={`px-3 py-1 rounded text-sm font-medium ${v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {v ? 'Active' : 'Inactive'}
            </span>
          )}
        ]}
        data={filteredDrivers}
      />

      {filteredDrivers.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No drivers found. Try adjusting your search or filters.</p>
        </div>
      )}

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

