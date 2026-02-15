'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
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
import { shipmentService } from '@/services/shipmentService';
import { userService } from '@/services/userService';
import { branchService } from '@/services/branchService';
import { clientService } from '@/services/clientService';
import { paymentService } from '@/services/trackingService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeDrivers: 0,
    totalClients: 0
  });

  const [shipmentData, setShipmentData] = useState<any[]>([]);
  const [branchPerformance, setBranchPerformance] = useState<any[]>([]);
  const [orderTrend, setOrderTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch shipments
        const shipments = await shipmentService.getAllShipments();
        
        // Fetch users (drivers)
        const drivers = await userService.getDrivers('default-agency');
        
        // Fetch branches
        const branches = await branchService.getAllBranches();
        
        // Fetch clients
        const clients = await clientService.getAllClients();

        // Calculate stats
        const statuses = shipments.reduce((acc: any, s: any) => {
          const status = s.status || 'PENDING';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // Calculate total revenue from shipments
        const totalRevenue = shipments.reduce((sum: number, s: any) => sum + (s.total_cost || 0), 0);

        setStats({
          totalRevenue,
          totalOrders: shipments.length,
          activeDrivers: drivers.filter((d: any) => d.is_active).length,
          totalClients: clients.length
        });

        // Prepare shipment status data for pie chart
        const shipmentChartData = Object.entries(statuses).map(([status, count]: [string, any]) => ({
          name: status,
          value: count,
          color: {
            'DELIVERED': '#059669',
            'PENDING': '#d97706',
            'IN_TRANSIT': '#0ea5e9',
            'CANCELLED': '#dc2626',
            'ARRIVED': '#8b5cf6'
          }[status] || '#64748b'
        }));

        setShipmentData(shipmentChartData);

        // Prepare branch performance data
        const branchData = branches.slice(0, 5).map((b: any) => {
          const branchShipments = shipments.filter((s: any) => s.origin_id === b.stop_id);
          return {
            branch: b.stop_name || 'Unknown',
            orders: branchShipments.length,
            revenue: branchShipments.reduce((sum: number, s: any) => sum + (s.total_cost || 0), 0)
          };
        });

        setBranchPerformance(branchData);

        // Prepare order trend (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });

        const trendData = last7Days.map((day, idx) => {
          const dayShipments = shipments.slice(idx * 4, (idx + 1) * 4);
          return {
            day,
            orders: dayShipments.length,
            revenue: dayShipments.reduce((sum: number, s: any) => sum + (s.total_cost || 0), 0)
          };
        });

        setOrderTrend(trendData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatsCard
          label="Total Revenue"
          value={`XAF ${stats.totalRevenue.toLocaleString()}`}
          icon={Coins}
          color="green"
        />
        <StatsCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          color="green"
        />
        <StatsCard
          label="Active Drivers"
          value={stats.activeDrivers}
          icon={Truck}
          color="purple"
        />
        <StatsCard
          label="Total Customers"
          value={stats.totalClients}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Order Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 border border-gray-200 shadow-sm ">
          <div className="flex items-center gap-2 mb-4">
            <TrendUp size={20} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-900">Order Trends</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={orderTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
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
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 4 }}
                activeDot={{ r: 6 }}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Status Pie Chart */}
        <div className="bg-white p-6 border border-gray-200 shadow-sm ">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Shipment Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={shipmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {shipmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value} shipments`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Performance Chart */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 border border-gray-200 shadow-sm ">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-green-600" />
            <h2 className="text-sm font-semibold text-gray-900">Branch Performance</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={branchPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                </linearGradient>
              </defs>
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
                formatter={(value) => [`${value} orders`, 'Orders']}
              />
              <Bar 
                dataKey="orders" 
                fill="url(#colorOrders)" 
                name="Orders" 
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}
