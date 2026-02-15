'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/Dashboard';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendUp,
  Package,
  Users,
  Truck,
  MapPin,
  Coins
} from 'phosphor-react';

export default function Dashboard() {
  const [orderTrend] = useState([
    { day: 'Mon', orders: 120, revenue: 2400 },
    { day: 'Tue', orders: 150, revenue: 2210 },
    { day: 'Wed', orders: 200, revenue: 2290 },
    { day: 'Thu', orders: 175, revenue: 2000 },
    { day: 'Fri', orders: 220, revenue: 2181 },
    { day: 'Sat', orders: 198, revenue: 2500 },
    { day: 'Sun', orders: 160, revenue: 2100 }
  ]);

  const [shipmentData] = useState([
    { name: 'Delivered', value: 45, color: '#10b981' },
    { name: 'Pending', value: 30, color: '#f59e0b' },
    { name: 'In Transit', value: 20, color: '#3b82f6' },
    { name: 'Cancelled', value: 5, color: '#ef4444' }
  ]);

  const [branchPerformance] = useState([
    { branch: 'Douala', orders: 456, revenue: 45000 },
    { branch: 'Yaounde', orders: 320, revenue: 32000 },
    { branch: 'Bamenda', orders: 210, revenue: 21000 },
    { branch: 'Kribi', orders: 180, revenue: 18000 },
    { branch: 'Esboewa', orders: 145, revenue: 14500 }
  ]);

  const [categoryBreakdown] = useState([
    { name: 'Electronics', value: 28, color: '#8b5cf6' },
    { name: 'Clothing', value: 22, color: '#ec4899' },
    { name: 'Food', value: 25, color: '#f59e0b' },
    { name: 'Books', value: 15, color: '#6366f1' },
    { name: 'Other', value: 10, color: '#64748b' }
  ]);

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatsCard
          label="Total Revenue"
          value="XAF 285,500"
          icon={Coins}
          color="green"
        />
        <StatsCard
          label="Total Orders"
          value="1,311"
          icon={Package}
          color="green"
        />
        <StatsCard
          label="Active Drivers"
          value="47"
          icon={Truck}
          color="purple"
        />
        <StatsCard
          label="Total Customers"
          value="234"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Order Trend Chart */}
        <div className="lg:col-span-2 bg-white p-4  border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendUp size={20} className="text-green-600" />
            <h2 className="text-sm font-semibold text-gray-900">Order Trends</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={orderTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Status Pie Chart */}
        <div className="bg-white p-4  border border-gray-200 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Shipment Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={shipmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {shipmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Branch Performance */}
        <div className="bg-white p-4  border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-green-600" />
            <h2 className="text-sm font-semibold text-gray-900">Branch Performance</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={branchPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="branch" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="orders" fill="#10b981" name="Orders" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-4  border border-gray-200 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">By Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
