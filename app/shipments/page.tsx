'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { CreateShipmentForm } from '@/components/CreateShipmentForm';
import { useShipmentManagement } from '@/hooks/useShipmentManagement';
import toast from 'react-hot-toast';

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { shipments, loading, error, fetchShipments } = useShipmentManagement();

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = 
      s.tracking_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sender?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.receiver?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || s.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-green-100 text-green-800',
      'IN_TRANSIT': 'bg-blue-100 text-blue-800',
      'ARRIVED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const shipmentStats = {
    total: shipments.length,
    pending: shipments.filter(s => s.status === 'PENDING').length,
    in_transit: shipments.filter(s => s.status === 'IN_TRANSIT').length,
    delivered: shipments.filter(s => s.status === 'DELIVERED').length,
    cancelled: shipments.filter(s => s.status === 'CANCELLED').length
  };

  if (loading) {
    return (
      <DashboardLayout title="Shipments">
        <SkeletonLoader rows={5} columns={7} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Shipments">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-lg font-bold text-blue-900">{shipmentStats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-3 rounded">
          <p className="text-xs text-gray-600">Pending</p>
          <p className="text-lg font-bold text-green-900">{shipmentStats.pending}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
          <p className="text-xs text-gray-600">In Transit</p>
          <p className="text-lg font-bold text-blue-900">{shipmentStats.in_transit}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-3 rounded">
          <p className="text-xs text-gray-600">Delivered</p>
          <p className="text-lg font-bold text-green-900">{shipmentStats.delivered}</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-3 rounded">
          <p className="text-xs text-gray-600">Cancelled</p>
          <p className="text-lg font-bold text-red-900">{shipmentStats.cancelled}</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by tracking no, sender, or receiver..."
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
            <option value="PENDING">Pending</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="ARRIVED">Arrived</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <ActionButton label="+ New Shipment" onClick={() => setShowCreateModal(true)} />
      </div>

      <DataTable
        columns={[
          { key: 'tracking_no', label: 'Tracking No' },
          { key: 'sender', label: 'Sender', render: (v, r) => r.sender?.full_name || 'N/A' },
          { key: 'receiver', label: 'Receiver', render: (v, r) => r.receiver?.full_name || 'N/A' },
          { key: 'origin_id', label: 'Origin', render: (v, r) => r.origin?.stop_name || 'N/A' },
          { key: 'dest_id', label: 'Destination', render: (v, r) => r.destination?.stop_name || 'N/A' },
          {
            key: 'status',
            label: 'Status',
            render: (v) => (
              <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(v)}`}>
                {v}
              </span>
            )
          },
          { key: 'total_cost', label: 'Cost', render: (v) => `XAF ${v?.toLocaleString() || 0}` }
        ]}
        data={filteredShipments}
      />

      {filteredShipments.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No shipments found. Try adjusting your search or filters.</p>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Shipment"
        width="lg"
      >
        <CreateShipmentForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchShipments();
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
