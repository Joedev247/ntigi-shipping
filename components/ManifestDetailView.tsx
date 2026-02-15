'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Truck, MapPin, Calendar, Package, User, CheckCircle, Clock, X, Plus } from 'phosphor-react';
import { GPSTracking } from '@/components/GPSTracking';
import { ShipmentAssignmentForm } from '@/components/ShipmentAssignmentForm';
import toast from 'react-hot-toast';

interface AssignedShipment {
  id: string;
  trackingNo: string;
  weight: number;
  sender: string;
  receiver: string;
  status: string;
}

interface ManifestDetailsProps {
  id: string;
  tripName: string;
  vehicle: string;
  driver: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime?: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED';
  onClose: () => void;
}

export const ManifestDetailView: React.FC<ManifestDetailsProps> = ({
  id,
  tripName,
  vehicle,
  driver,
  origin,
  destination,
  departureTime,
  arrivalTime,
  status,
  onClose
}) => {
  const [showShipmentAssignment, setShowShipmentAssignment] = useState(false);
  const [assignedShipments, setAssignedShipments] = useState<AssignedShipment[]>([
    {
      id: '1',
      trackingNo: 'TRK001AB',
      weight: 15,
      sender: 'John Doe',
      receiver: 'Jane Smith',
      status: 'IN_TRANSIT'
    },
    {
      id: '2',
      trackingNo: 'TRK002CD',
      weight: 8,
      sender: 'ABC Corp',
      receiver: 'XYZ Store',
      status: 'IN_TRANSIT'
    }
  ]);

  // Sample GPS tracking data
  const trackingPoints = [
    { timestamp: '2026-02-15 08:00', latitude: 4.0511, longitude: 9.7679, speed: 0, status: 'Departed Douala' },
    { timestamp: '2026-02-15 09:15', latitude: 4.2234, longitude: 10.1234, speed: 85, status: 'On Route' },
    { timestamp: '2026-02-15 10:30', latitude: 4.4156, longitude: 10.5678, speed: 90, status: 'On Route' },
    { timestamp: '2026-02-15 11:45', latitude: 3.8667, longitude: 11.5167, speed: 0, status: 'Arrived Yaoundé' }
  ];

  const handleRemoveShipment = (shipmentId: string) => {
    setAssignedShipments(assignedShipments.filter(s => s.id !== shipmentId));
    toast.success('Shipment removed from manifest');
  };

  const handleShipmentAssigned = () => {
    setShowShipmentAssignment(false);
    toast.success('New shipment assigned!');
    // Refresh the list in production
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const totalWeight = assignedShipments.reduce((sum, s) => sum + s.weight, 0);

  return (
    <div className="space-y-6 max-h-[90vh] overflow-y-auto pb-4">
      {/* Header with Status */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{tripName}</h2>
          <p className="text-sm text-gray-600 mt-1">Manifest ID: {id}</p>
        </div>
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Trip Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle & Driver */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Truck size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">Vehicle Assignment</p>
                <p className="font-semibold text-gray-900">{vehicle}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">Driver</p>
                <p className="font-semibold text-gray-900">{driver}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Route */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={24} className="text-purple-600 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">From</p>
                <p className="font-semibold text-gray-900">{origin}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pl-9 relative">
              <div className="absolute left-2 top-0 w-0.5 h-full bg-purple-300"></div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">To</p>
                <p className="font-semibold text-gray-900">{destination}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-amber-600" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600">Departure</p>
              <p className="font-semibold text-gray-900">{new Date(departureTime).toLocaleString()}</p>
            </div>
          </div>
          {arrivalTime && (
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">Arrival</p>
                <p className="font-semibold text-gray-900">{new Date(arrivalTime).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* GPS Tracking */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">GPS Tracking</h3>
        <GPSTracking
          vehicleId={vehicle}
          trackingPoints={trackingPoints}
          currentLocation={trackingPoints[trackingPoints.length - 1]}
        />
      </div>

      {/* Assigned Shipments */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Assigned Shipments ({assignedShipments.length})
            </h3>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowShipmentAssignment(true)}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Add Shipment
          </Button>
        </div>

        {/* Shipment Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50  border border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Total Shipments</p>
            <p className="text-2xl font-bold text-gray-900">{assignedShipments.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Weight</p>
            <p className="text-2xl font-bold text-gray-900">{totalWeight} kg</p>
          </div>
        </div>

        {/* Shipments List */}
        {assignedShipments.length === 0 ? (
          <div className="text-center py-8">
            <Package size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No shipments assigned yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignedShipments.map((shipment) => (
              <div key={shipment.id} className="flex items-start justify-between p-3 border border-gray-200  hover:bg-gray-50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono font-semibold text-gray-900">{shipment.trackingNo}</p>
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                      {shipment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>From: <span className="font-medium text-gray-900">{shipment.sender}</span></p>
                    <p>To: <span className="font-medium text-gray-900">{shipment.receiver}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Weight</p>
                    <p className="font-semibold text-gray-900">{shipment.weight} kg</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRemoveShipment(shipment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Shipment Assignment Modal */}
      <Modal
        isOpen={showShipmentAssignment}
        onClose={() => setShowShipmentAssignment(false)}
        title="Assign Shipment to Trip"
        width="md"
      >
        <ShipmentAssignmentForm
          manifestId={id}
          onClose={() => setShowShipmentAssignment(false)}
          onSuccess={handleShipmentAssigned}
        />
      </Modal>
    </div>
  );
};

export default ManifestDetailView;
