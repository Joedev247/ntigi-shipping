'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { BranchForm } from '@/components/BranchForm';
import { useBranchManagement } from '@/hooks/useBranchManagement';
import toast from 'react-hot-toast';

export default function BranchesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const { branches, loading, error, addBranch, fetchBranches } = useBranchManagement();

  const handleAddBranch = async (formData: any) => {
    try {
      await addBranch(formData);
      toast.success('Branch added successfully!');
      setIsModalOpen(false);
      fetchBranches();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add branch');
    }
  };

  const filteredBranches = branches.filter(b => {
    const matchesSearch =
      b.stop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === '' || b.city === cityFilter;
    
    return matchesSearch && matchesCity;
  });

  // Get unique cities for filter
  const cities = [...new Set(branches.map(b => b.city).filter(Boolean))].sort();

  const stats = {
    total: branches.length,
    cities: cities.length
  };

  if (loading) {
    return (
      <DashboardLayout title="Branches">
        <SkeletonLoader rows={5} columns={4} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Branches">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <p className="text-sm text-gray-600">Total Branches</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <p className="text-sm text-gray-600">Cities Covered</p>
          <p className="text-2xl font-bold text-green-900">{stats.cities}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search branches by name or city..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <ActionButton
          label="+ new branch"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'stop_id', label: 'ID', render: (v) => v?.substring(0, 8) || 'N/A' },
          { key: 'stop_name', label: 'Branch Name' },
          { key: 'city', label: 'City' },
          { key: 'printer_type', label: 'Printer Type' }
        ]}
        data={filteredBranches}
      />

      {filteredBranches.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No branches found. Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Branch"
        width="lg"
      >
        <BranchForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddBranch}
        />
      </Modal>
    </DashboardLayout>
  );
}

