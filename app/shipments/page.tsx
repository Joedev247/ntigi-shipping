'use client';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { shipments, loading, error } = useShipmentManagement();

  const filteredShipments = shipments.filter(s =>
    s.tracking_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sender?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.receiver?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_TRANSIT': 'bg-green-100 text-green-800',
      'ARRIVED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

      <div className="flex justify-between items-center mb-6">
        <SearchBar
          placeholder="Search shipment..."
          onSearch={setSearchTerm}
        />
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
          { key: 'total_cost', label: 'Cost', render: (v) => `XAF ${v}` }
        ]}
        data={filteredShipments}
      />

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        <p className="text-sm text-green-800">
          <strong>Tip:</strong> Click on any shipment to view tracking details, photos, and transaction information.
        </p>
      </div>

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
            // Optionally refresh the shipments list
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
