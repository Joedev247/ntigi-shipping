'use client';

import React from 'react';
import { MapPin, Compass } from 'phosphor-react';
import { Card } from '@/components/Card';

interface TrackingPoint {
  timestamp: string;
  latitude: number;
  longitude: number;
  speed?: number;
  status?: string;
}

interface GPSTrackingProps {
  vehicleId: string;
  trackingPoints: TrackingPoint[];
  currentLocation?: TrackingPoint;
}

export const GPSTracking: React.FC<GPSTrackingProps> = ({
  vehicleId,
  trackingPoints,
  currentLocation
}) => {
  const getCameraraonCities: { [key: string]: { lat: number; lng: number } } = {
    'Douala': { lat: 4.0511, lng: 9.7679 },
    'Yaoundé': { lat: 3.8667, lng: 11.5167 },
    'Bamenda': { lat: 5.9631, lng: 10.1591 },
    'Buea': { lat: 4.1577, lng: 9.2405 },
    'Garoua': { lat: 9.3089, lng: 13.4006 },
    'Maroua': { lat: 10.5905, lng: 14.2743 },
    'Bertoua': { lat: 4.5779, lng: 13.6814 }
  };

  const currentLat = currentLocation?.latitude || 4.0511;
  const currentLng = currentLocation?.longitude || 9.7679;
  const zoom = 12;

  // Create OpenStreetMap URL with markers
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentLng - 0.05},${currentLat - 0.05},${currentLng + 0.05},${currentLat + 0.05}&layer=mapnik&marker=${currentLat},${currentLng}`;

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${currentLat},${currentLng}&zoom=${zoom}&size=400x300&markers=color:red%7C${currentLat},${currentLng}&key=YOUR_API_KEY`;

  return (
    <div className="space-y-6">
      {/* GPS Map Display */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-gray-100  h-96 flex items-center justify-center relative overflow-hidden">
          {/* Simple map visualization using CSS */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            {/* Background */}
            <rect width="400" height="300" fill="#e5e7eb" />

            {/* Grid lines */}
            <line x1="0" y1="150" x2="400" y2="150" stroke="#d1d5db" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#d1d5db" strokeWidth="1" strokeDasharray="5,5" />

            {/* Tracking path */}
            <polyline
              points={trackingPoints
                .map((point) => {
                  const x = ((point.longitude - 9.2) / 0.3) * 400;
                  const y = ((4.6 - point.latitude) / 0.6) * 300;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />

            {/* Tracking points */}
            {trackingPoints.map((point, idx) => {
              const x = ((point.longitude - 9.2) / 0.3) * 400;
              const y = ((4.6 - point.latitude) / 0.6) * 300;
              const isLatest = idx === trackingPoints.length - 1;

              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={isLatest ? 6 : 3}
                  fill={isLatest ? '#ef4444' : '#3b82f6'}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Map overlay with info */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-transparent to-black/20 pointer-events-none">
            <div className="text-white text-xs font-semibold bg-black/30 px-2 py-1 rounded w-fit">
              Current Location: {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
            </div>
            <div className="text-white text-xs bg-black/30 px-2 py-1 rounded w-fit">
              Showing {trackingPoints.length} tracking points
            </div>
          </div>
        </div>

        {/* Map Info */}
        <div className="p-4 bg-blue-50 border-t border-blue-100">
          <p className="text-sm text-gray-600">
            <MapPin size={16} className="inline mr-2 text-blue-600" />
            This is a simplified tracking visualization. In production, integrate with Google Maps, Mapbox, or OpenStreetMap API.
          </p>
        </div>
      </Card>

      {/* Current Location Info */}
      {currentLocation && (
        <Card className="bg-green-50 border border-green-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Compass size={18} className="text-green-600" />
                Current Location
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Latitude</p>
                  <p className="font-mono font-semibold text-gray-900">{currentLocation.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Longitude</p>
                  <p className="font-mono font-semibold text-gray-900">{currentLocation.longitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Last Updated</p>
                  <p className="font-semibold text-gray-900">{new Date(currentLocation.timestamp).toLocaleTimeString()}</p>
                </div>
                {currentLocation.speed && (
                  <div>
                    <p className="text-gray-600 text-xs">Speed</p>
                    <p className="font-semibold text-gray-900">{currentLocation.speed} km/h</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tracking History */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Tracking History</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {trackingPoints.length === 0 ? (
            <p className="text-sm text-gray-500">No tracking data available</p>
          ) : (
            trackingPoints
              .slice()
              .reverse()
              .map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(point.timestamp).toLocaleString()}
                    </p>
                    {point.status && (
                      <p className="text-xs text-gray-600 mt-1">{point.status}</p>
                    )}
                  </div>
                  {point.speed && (
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs font-semibold text-gray-900">{point.speed} km/h</p>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default GPSTracking;
