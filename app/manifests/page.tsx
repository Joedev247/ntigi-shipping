'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Truck, Plus, MapPin, Calendar, Package, CheckCircle } from 'phosphor-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ManifestForm } from '@/components/ManifestForm';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ManifestDetailView } from '@/components/ManifestDetailView';

interface Manifest {
  id: string;
  tripName: string;
  vehicle: string;
  driver: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime?: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED';
  shipments: number;
  totalWeight: number;
}

export default function ManifestsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN_TRANSIT' | 'COMPLETED'>('ALL');
  const [manifests, setManifests] = useState<Manifest[]>([
    {
      id: 'MF001',
      tripName: 'Douala-Yaoundé Trip 001',
      vehicle: 'Bus 1 (KA-123-KE)',
      driver: 'Driver One',
      origin: 'Douala Branch',
      destination: 'Yaoundé Branch',
      departureTime: '2026-02-15 08:00',
      arrivalTime: '2026-02-15 11:45',
      status: 'IN_TRANSIT',
      shipments: 12,
      totalWeight: 450
    },
    {
      id: 'MF002',
      tripName: 'Yaoundé-Bamenda Trip 001',
      vehicle: 'Truck 1 (KA-456-LF)',
      driver: 'Driver Two',
      origin: 'Yaoundé Branch',
      destination: 'Bamenda Branch',
      departureTime: '2026-02-15 09:30',
      status: 'PENDING',
      shipments: 8,
      totalWeight: 320
    },
    {
      id: 'MF003',
      tripName: 'Douala-Buea Trip 005',
      vehicle: 'Van 1 (KA-789-MG)',
      driver: 'Driver Three',
      origin: 'Douala Branch',
      destination: 'Buea Branch',
      departureTime: '2026-02-14 14:00',
      arrivalTime: '2026-02-14 17:30',
      status: 'COMPLETED',
      shipments: 6,
      totalWeight: 180
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleAddManifest = () => {
    setIsModalOpen(true);
  };

  const handleViewDetails = (manifest: Manifest) => {
    setSelectedManifest(manifest);
  };

  const handleCloseDetails = () => {
    setSelectedManifest(null);
  };

  const handleManifestCreated = () => {
    // Refresh manifests
    toast.success('Trip manifest created successfully!');
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleStartTrip = (manifestId: string) => {
    setManifests(manifests.map(m =>
      m.id === manifestId ? { ...m, status: 'IN_TRANSIT' as const } : m
    ));
    toast.success('Trip started!');
  };

  const handleCompleteTrip = (manifestId: string) => {
    setManifests(manifests.map(m =>
      m.id === manifestId ? { ...m, status: 'COMPLETED' as const } : m
    ));
    toast.success('Trip completed!');
  };

  const filteredManifests = manifests.filter(m => {
    const matchesSearch = m.tripName.toLowerCase().includes(search.toLowerCase()) ||
                         m.vehicle.toLowerCase().includes(search.toLowerCase()) ||
                         m.driver.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: manifests.length,
    pending: manifests.filter(m => m.status === 'PENDING').length,
    inTransit: manifests.filter(m => m.status === 'IN_TRANSIT').length,
    completed: manifests.filter(m => m.status === 'COMPLETED').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Trip Manifests">
        <SkeletonLoader rows={5} columns={7} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Trip Manifests">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Truck size={40} className="text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-green-600">{stats.pending}</p>
            </div>
            <Calendar size={40} className="text-green-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.inTransit}</p>
            </div>
            <MapPin size={40} className="text-indigo-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle size={40} className="text-green-200" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by trip name, vehicle, or driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <Button onClick={handleAddManifest} className="flex items-center gap-2">
          <Plus size={20} />
          New Trip
        </Button>
      </div>

      {/* Manifests Table */}
      <div className="bg-white  border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trip Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Driver</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Departure</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Shipments</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredManifests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No manifests found
                  </td>
                </tr>
              ) : (
                filteredManifests.map((manifest) => (
                  <tr key={manifest.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{manifest.tripName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{manifest.vehicle}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{manifest.driver}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {manifest.origin} → {manifest.destination}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{manifest.departureTime}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-1">
                        <Package size={16} className="text-gray-400" />
                        {manifest.shipments}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(manifest.status)}`}>
                        {manifest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {manifest.status === 'PENDING' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleStartTrip(manifest.id)}
                          className="text-xs"
                        >
                          Start
                        </Button>
                      )}
                      {manifest.status === 'IN_TRANSIT' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleCompleteTrip(manifest.id)}
                          className="text-xs"
                        >
                          Complete
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="text-xs"
                        onClick={() => handleViewDetails(manifest)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manifest Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Trip Manifest"
        width="lg"
      >
        <ManifestForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleManifestCreated}
        />
      </Modal>

      {/* Manifest Detail Modal */}
      <Modal
        isOpen={selectedManifest !== null}
        onClose={handleCloseDetails}
        title={selectedManifest?.tripName || ''}
        width="xl"
      >
        {selectedManifest && (
          <ManifestDetailView
            id={selectedManifest.id}
            tripName={selectedManifest.tripName}
            vehicle={selectedManifest.vehicle}
            driver={selectedManifest.driver}
            origin={selectedManifest.origin}
            destination={selectedManifest.destination}
            departureTime={selectedManifest.departureTime}
            arrivalTime={selectedManifest.arrivalTime}
            status={selectedManifest.status}
            onClose={handleCloseDetails}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
