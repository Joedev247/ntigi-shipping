'use client';

export const dynamic = 'force-dynamic';

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
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const { customers, loading, error, addCustomer, fetchCustomers } = useCustomerManagement();

  const handleAddCustomer = async (formData: any) => {
    try {
      await addCustomer(formData);
      toast.success('Customer added successfully!');
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add customer');
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVerification = verifiedFilter === '' || 
      (verifiedFilter === 'verified' ? c.is_verified : !c.is_verified);
    
    return matchesSearch && matchesVerification;
  });

  const stats = {
    total: customers.length,
    verified: customers.filter(c => c.is_verified).length,
    unverified: customers.filter(c => !c.is_verified).length
  };

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

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <p className="text-sm text-gray-600">Verified</p>
          <p className="text-2xl font-bold text-green-900">{stats.verified}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <p className="text-sm text-gray-600">Unverified</p>
          <p className="text-2xl font-bold text-green-900">{stats.unverified}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search customer by name, phone, or email..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Customers</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
        <ActionButton
          label="+ New Customer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'client_id', label: 'ID', render: (v) => v?.substring(0, 8) || 'N/A' },
          { key: 'full_name', label: 'Name' },
          { key: 'phone_number', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'is_verified', label: 'Status', render: (v) => (
            <span className={`px-3 py-1 rounded text-sm font-medium ${v ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}>
              {v ? 'Verified' : 'Unverified'}
            </span>
          )}
        ]}
        data={filteredCustomers}
      />

      {filteredCustomers.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No customers found. Try adjusting your search or filters.</p>
        </div>
      )}

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
 
