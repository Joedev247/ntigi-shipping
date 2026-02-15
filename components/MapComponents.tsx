'use client';

import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { LoadingSpinner } from './Alert';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label: string }>;
}

export const LocationMap: React.FC<MapProps> = ({ latitude, longitude, zoom = 13, markers }) => {
  const allMarkers = markers || [{ lat: latitude, lng: longitude, label: 'Current' }];
  const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBu-ysKwNGN6B4gvMEZ2V_HiFt96B2hVfE&q=${latitude},${longitude}&zoom=${zoom}`;

  return (
    <Card title="Location Map" className="h-96">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={mapsUrl}
        allowFullScreen
        loading="lazy"
      />
      {allMarkers.length > 1 && (
        <div className="mt-4 space-y-2">
          {allMarkers.map((marker, idx) => (
            <div key={idx} className="text-sm text-gray-600">
              <p className="font-medium">{marker.label}</p>
              <p>{marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

interface PhotoUploadProps {
  onUpload: (file: File) => Promise<void>;
  stage: 'INTAKE' | 'DELIVERY';
  isLoading?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload, stage, isLoading = false }) => {
  const [preview, setPreview] = React.useState<string>('');

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      await onUpload(file);
    }
  };

  return (
    <Card title={`Photo - ${stage}`}>
      {preview ? (
        <div>
          <img src={preview} alt="Preview" className="w-full  mb-4" />
          <label className="block">
            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
            <Button variant="secondary" onClick={() => (document.querySelector('input[type=file]') as HTMLInputElement | null)?.click()}>
              Change Photo
            </Button>
          </label>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
          <div className="border-2 border-dashed border-gray-300  p-8 text-center hover:border-green-500 transition">
            {isLoading ? (
              <LoadingSpinner size="sm" text="Uploading..." />
            ) : (
              <>
                <p className="text-gray-600 mb-2">📷 Click to upload photo</p>
              </>
            )}
          </div>
        </label>
      )}
    </Card>
  );
};
