'use client';

import React from 'react';
import { Badge } from './Alert';
import { Card } from './Card';
import { formatDateTime, formatCurrency } from '@/utils/formatUtils';

interface ShipmentCardProps {
  tracking_no: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED';
  sender: { full_name: string; phone_number: string };
  receiver: { full_name: string; phone_number: string };
  origin: { stop_name: string; city: string };
  destination: { stop_name: string; city: string };
  total_cost: number;
  currency: string;
  created_at: string;
  onClick?: () => void;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({
  tracking_no,
  status,
  sender,
  receiver,
  origin,
  destination,
  total_cost,
  currency,
  created_at,
  onClick,
}) => {
  const statusColors = {
    PENDING: 'warning',
    IN_TRANSIT: 'info',
    ARRIVED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger',
  } as const;

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-lg font-bold text-green-600">{tracking_no}</p>
          <p className="text-sm text-gray-600">{formatDateTime(created_at)}</p>
        </div>
        <Badge text={status} variant={statusColors[status]} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">From</p>
          <p className="font-medium text-gray-900">{sender.full_name}</p>
          <p className="text-sm text-gray-600">{origin.stop_name}, {origin.city}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">To</p>
          <p className="font-medium text-gray-900">{receiver.full_name}</p>
          <p className="text-sm text-gray-600">{destination.stop_name}, {destination.city}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">Cost</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(total_cost, currency)}</p>
        </div>
      </div>
    </Card>
  );
};

interface TrackingDisplayProps {
  tracking_no: string;
  status: string;
  currentLocation?: { latitude: number; longitude: number };
  lastUpdate?: string;
  estimatedDelivery?: string;
}

export const TrackingDisplay: React.FC<TrackingDisplayProps> = ({
  tracking_no,
  status,
  currentLocation,
  lastUpdate,
  estimatedDelivery,
}) => {
  const statusSteps = ['PENDING', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED'];
  const currentStep = statusSteps.indexOf(status);

  return (
    <Card title={`Tracking: ${tracking_no}`}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {statusSteps.map((step, index) => (
            <React.Fragment key={step}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          {statusSteps.map((step) => (
            <p key={step}>{step}</p>
          ))}
        </div>
      </div>

      {currentLocation && (
        <div className="bg-gray-50 p-4  mb-4">
          <p className="text-sm text-gray-600 mb-2">Current Location</p>
          <p className="font-medium text-gray-900">
            {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {lastUpdate && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Last Update</p>
            <p className="text-sm text-gray-900">{formatDateTime(lastUpdate)}</p>
          </div>
        )}
        {estimatedDelivery && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Est. Delivery</p>
            <p className="text-sm text-gray-900">{formatDateTime(estimatedDelivery)}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

interface ManifestItemProps {
  tracking_no: string;
  status: string;
  senderName: string;
  receiverName: string;
  cost: number;
}

export const ManifestItem: React.FC<ManifestItemProps> = ({
  tracking_no,
  status,
  senderName,
  receiverName,
  cost,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded mb-2">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{tracking_no}</p>
        <p className="text-sm text-gray-600">{senderName} → {receiverName}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">${cost.toFixed(2)}</p>
        <Badge text={status} variant="info" />
      </div>
    </div>
  );
};
