'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { OrderForm } from '@/components/OrderForm';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredOrders = orders.filter(o =>
    o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'PROCESSING': 'bg-purple-100 text-purple-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleOrderSubmit = (formData: any) => {
    // Add new order to the list
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...formData,
      created_at: new Date().toISOString()
    };
    setOrders([...orders, newOrder]);
    toast.success('Order created successfully');
  };

  if (loading) {
    return (
      <DashboardLayout title="Orders">
        <SkeletonLoader rows={5} columns={5} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Orders">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <SearchBar
          placeholder="Search order..."
          onSearch={setSearchTerm}
        />
        <ActionButton label="+ New Order" onClick={() => setShowCreateModal(true)} />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'Order ID' },
          { key: 'customer_name', label: 'Customer Name' },
          { key: 'order_date', label: 'Order Date', render: (v) => new Date(v).toLocaleDateString() },
          { key: 'total_amount', label: 'Total Amount', render: (v) => `XAF ${v}` },
          {
            key: 'status',
            label: 'Status',
            render: (v) => (
              <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(v)}`}>
                {v}
              </span>
            )
          },
          { key: 'items_count', label: 'Items', render: (v) => v || '0' }
        ]}
        data={filteredOrders}
      />

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        <p className="text-sm text-green-800">
          <strong>Tip:</strong> Create and manage orders efficiently. Track order status and items in real-time.
        </p>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Order"
        width="lg"
      >
        <OrderForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleOrderSubmit}
        />
      </Modal>
    </DashboardLayout>
  );
}
