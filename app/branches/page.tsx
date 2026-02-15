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
  const { branches, loading, error, addBranch } = useBranchManagement();

  const handleAddBranch = async (formData: any) => {
    try {
      await addBranch(formData);
      toast.success('Branch added successfully!');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add branch');
    }
  };

  const filteredBranches = branches.filter(b =>
    b.stop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      <div className="flex justify-between items-center mb-6">
        <SearchBar
          placeholder="Search branches..."
          onSearch={setSearchTerm}
        />
        <ActionButton
          label="+ new branch"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'stop_id', label: 'ID' },
          { key: 'stop_name', label: 'Branch Name' },
          { key: 'city', label: 'City' },
          { key: 'printer_type', label: 'Printer Type' }
        ]}
        data={filteredBranches}
      />

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
 
