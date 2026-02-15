'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { shipmentService } from '@/services/shipmentService';
import { MagnifyingGlass, MapPin, Calendar, CheckCircle, Clock } from 'phosphor-react';
import toast from 'react-hot-toast';

export default function TrackingPage() {
  const [trackingNo, setTrackingNo] = useState('');
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNo.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await shipmentService.getShipmentByTracking(trackingNo.toUpperCase());
      if (data) {
        setShipment(data);
      } else {
        toast.error('Shipment not found');
        setShipment(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to track shipment');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const iconClass = 'size-5';
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle size={24} className="text-green-600" />;
      case 'IN_TRANSIT':
        return <Clock size={24} className="text-green-600" />;
      case 'ARRIVED':
        return <MapPin size={24} className="text-orange-600" />;
      default:
        return <Clock size={24} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'IN_TRANSIT':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'ARRIVED':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusTimeline = [
    { status: 'PENDING', label: 'Order Placed', completed: !!shipment },
    { status: 'IN_TRANSIT', label: 'In Transit', completed: shipment?.status === 'IN_TRANSIT' || shipment?.status === 'ARRIVED' || shipment?.status === 'DELIVERED' },
    { status: 'ARRIVED', label: 'Arrived at Destination', completed: shipment?.status === 'ARRIVED' || shipment?.status === 'DELIVERED' },
    { status: 'DELIVERED', label: 'Delivered', completed: shipment?.status === 'DELIVERED' }
  ];

  return (
    <DashboardLayout title="Track Shipment">
      <div className="max-w-2xl mx-auto">
        {/* Search Section */}
        <div className="bg-white  border border-gray-200 p-8 shadow-sm mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MagnifyingGlass 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Enter tracking number (e.g., TRK892L)"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300  text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3  font-medium hover:bg-green-700 disabled:opacity-50 transition"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {searched && !loading && shipment && (
          <div className="space-y-6">
            {/* Shipment Header */}
            <div className="bg-white  border border-gray-200 p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                  <p className="text-2xl font-mono font-bold text-green-600">{shipment.tracking_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2  border font-semibold text-sm ${getStatusColor(shipment.status)}`}>
                    {getStatusIcon(shipment.status)}
                    {shipment.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">From</p>
                  <p className="font-semibold text-gray-900">{shipment.origin?.stop_name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{shipment.origin?.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">To</p>
                  <p className="font-semibold text-gray-900">{shipment.destination?.stop_name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{shipment.destination?.city || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white  border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Timeline</h3>
              <div className="space-y-4">
                {statusTimeline.map((item, index) => (
                  <div key={item.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        item.completed ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                      }`}>
                        {item.completed && <CheckCircle size={20} className="text-white" />}
                      </div>
                      {index < statusTimeline.length - 1 && (
                        <div className={`w-1 h-8 mt-2 ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.label}
                      </p>
                      {item.completed && (
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sender & Receiver Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white  border border-gray-200 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Sender</h4>
                <p className="text-sm font-medium text-gray-900">{shipment.sender?.full_name}</p>
                <p className="text-sm text-gray-600">{shipment.sender?.phone_number}</p>
              </div>
              <div className="bg-white  border border-gray-200 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Receiver</h4>
                <p className="text-sm font-medium text-gray-900">{shipment.receiver?.full_name}</p>
                <p className="text-sm text-gray-600">{shipment.receiver?.phone_number}</p>
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-white  border border-gray-200 p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">Package Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold text-gray-900">{shipment.package_type?.label || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-semibold text-gray-900">{shipment.total_weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-semibold text-gray-900">XAF {shipment.total_cost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-semibold text-gray-900">{shipment.description}</span>
                </div>
              </div>
            </div>

            {/* Photos */}
            {shipment.photos && shipment.photos.length > 0 && (
              <div className="bg-white  border border-gray-200 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Photos</h4>
                <div className="grid grid-cols-2 gap-4">
                  {shipment.photos.map((photo: any) => (
                    <div key={photo.photo_id}>
                      <img 
                        src={photo.image_url} 
                        alt={photo.stage}
                        className="w-full h-48 object-cover rounded border border-gray-200"
                      />
                      <p className="text-xs text-gray-600 mt-2 capitalize">{photo.stage} - {new Date(photo.captured_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {searched && !loading && !shipment && (
          <div className="bg-yellow-50 border border-yellow-200  p-8 text-center">
            <p className="text-gray-900 font-semibold mb-2">Shipment Not Found</p>
            <p className="text-gray-600">Please check the tracking number and try again.</p>
          </div>
        )}

        {!searched && (
          <div className="bg-green-50 border border-green-200  p-8 text-center">
            <MagnifyingGlass size={48} className="mx-auto mb-4 text-green-400" />
            <p className="text-gray-900 font-semibold mb-2">Track Your Shipment</p>
            <p className="text-gray-600">Enter your tracking number above to see real-time delivery updates.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
