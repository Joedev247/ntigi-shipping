'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { OrderForm } from '@/components/OrderForm';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-green-100 text-green-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
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
    setShowCreateModal(false);
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

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-lg font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-3 rounded">
          <p className="text-xs text-gray-600">Pending</p>
          <p className="text-lg font-bold text-green-900">{stats.pending}</p>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 p-3 rounded">
          <p className="text-xs text-gray-600">Confirmed</p>
          <p className="text-lg font-bold text-cyan-900">{stats.confirmed}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-3 rounded">
          <p className="text-xs text-gray-600">Completed</p>
          <p className="text-lg font-bold text-green-900">{stats.completed}</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-3 rounded">
          <p className="text-xs text-gray-600">Cancelled</p>
          <p className="text-lg font-bold text-red-900">{stats.cancelled}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by order ID or customer..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <ActionButton label="+ New Order" onClick={() => setShowCreateModal(true)} />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'Order ID' },
          { key: 'customer_name', label: 'Customer Name' },
          { key: 'order_date', label: 'Order Date', render: (v) => new Date(v).toLocaleDateString() },
          { key: 'total_amount', label: 'Total Amount', render: (v) => `XAF ${(parseFloat(v) || 0).toLocaleString()}` },
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

      {filteredOrders.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No orders found. Try adjusting your search or filters.</p>
        </div>
      )}

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
