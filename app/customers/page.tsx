'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { CustomerForm } from '@/components/CustomerForm';
import { useCustomerManagement } from '@/hooks/useCustomerManagement';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { customers, loading, error, addCustomer } = useCustomerManagement();

  const handleAddCustomer = async (formData: any) => {
    try {
      await addCustomer(formData);
      toast.success('Customer added successfully!');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add customer');
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Customers">
        <SkeletonLoader rows={5} columns={4} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Customers">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <SearchBar
          placeholder="Search customer..."
          onSearch={setSearchTerm}
        />
        <ActionButton
          label="+ New Customer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'client_id', label: 'ID' },
          { key: 'full_name', label: 'Name' },
          { key: 'phone_number', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'is_verified', label: 'Verified', render: (v) => v ? 'Yes' : 'No' }
        ]}
        data={filteredCustomers}
      />

      {/* Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Customer"
        width="lg"
      >
        <CustomerForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddCustomer}
        />
      </Modal>
    </DashboardLayout>
  );
}
 
