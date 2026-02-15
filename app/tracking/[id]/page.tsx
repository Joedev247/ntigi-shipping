'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, Container } from '@/components/Layout';
import { Card, Grid } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge, LoadingSpinner, Alert as AlertComponent } from '@/components/Alert';
import { TrackingDisplay } from '@/components/ShipmentComponents';
import { LocationMap } from '@/components/MapComponents';
import { shipmentService } from '@/services/shipmentService';
import { trackingService, paymentService } from '@/services/trackingService';
import { formatDateTime, formatCurrency, formatPhoneNumber } from '@/utils/formatUtils';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '@/components/Modal';
import { Receipt } from '@/components/Receipt';

export default function TrackingPage({ params }: { params: { id: string } }) {
  const [shipment, setShipment] = useState<any>(null);
  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const trackingNo = params.id?.toUpperCase() || '';

  useEffect(() => {
    loadTrackingData();
  }, [trackingNo]);

  const loadTrackingData = async () => {
    if (!trackingNo) {
      setError('Invalid tracking number');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get shipment details
      const shipmentData = await shipmentService.getShipmentByTracking(trackingNo);
      setShipment(shipmentData);

      // Get tracking route
      const route = await trackingService.getShipmentTrackingRoute(trackingNo);
      setTrackingLogs(route.route || []);

      // Get payment info
      const paymentData = await trackingService.getTransaction(trackingNo);
      setTransaction(paymentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracking information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Track Shipment">
        <Container className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading tracking details..." />
        </Container>
      </PageLayout>
    );
  }

  if (error || !shipment) {
    return (
      <PageLayout title="Track Shipment">
        <Container>
          <AlertComponent type="error" message={error || 'Shipment not found'} />
        </Container>
      </PageLayout>
    );
  }

  const hasTracking = trackingLogs && trackingLogs.length > 0;
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <PageLayout title={`Tracking: ${trackingNo}`}>
      <Container>
        {/* Shipment Status */}
        <TrackingDisplay
          tracking_no={shipment.tracking_no}
          status={shipment.status}
          currentLocation={trackingLogs?.[0]}
          lastUpdate={trackingLogs?.[0]?.timestamp}
          estimatedDelivery={shipment.updated_at}
        />

        {/* Main Content Grid */}
        <Grid columns={2} gap="md" className="my-8">
          {/* Shipment Details */}
          <Card title="Shipment Details">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 uppercase">Tracking Number</p>
                <p className="text-lg font-bold text-gray-900">{shipment.tracking_no}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase">Status</p>
                <Badge text={shipment.status} variant={shipment.status === 'DELIVERED' ? 'success' : 'warning'} />
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase">Created</p>
                <p className="text-gray-900">{formatDateTime(shipment.created_at)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase">Total Cost</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(shipment.total_cost, 'XAF')}</p>
              </div>
              <div className="pt-2">
                <Button variant="primary" onClick={() => setShowReceipt(true)} className="mt-2">
                  View Receipt
                </Button>
              </div>
            </div>
          </Card>

          {/* QR Code */}
          <Card title="QR Code">
            <div className="flex justify-center p-4 bg-gray-50 rounded">
              <QRCodeSVG value={shipment.tracking_no} size={150} />
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">Scan to verify shipment</p>
          </Card>
        </Grid>

        <Modal isOpen={showReceipt} onClose={() => setShowReceipt(false)} title={`Receipt - ${shipment.tracking_no}`} width="lg">
          <Receipt
            shipmentId={shipment.tracking_no}
            trackingNumber={shipment.tracking_no}
            senderName={shipment.sender?.full_name || 'Sender'}
            senderPhone={shipment.sender?.phone_number || ''}
            senderAddress={`${shipment.origin?.stop_name || ''}${shipment.origin?.city ? ', ' + shipment.origin.city : ''}`}
            receiverName={shipment.receiver?.full_name || 'Receiver'}
            receiverPhone={shipment.receiver?.phone_number || ''}
            receiverAddress={`${shipment.destination?.stop_name || ''}${shipment.destination?.city ? ', ' + shipment.destination.city : ''}`}
            packageWeight={shipment.total_weight || 0}
            packageType={shipment.package_type?.label || 'N/A'}
            status={shipment.status}
            createdDate={formatDateTime(shipment.created_at)}
            deliveryDate={shipment.updated_at ? formatDateTime(shipment.updated_at) : undefined}
            totalCost={shipment.total_cost}
            branch={shipment.origin?.stop_name || ''}
            driver={shipment.driver?.full_name}
            onClose={() => setShowReceipt(false)}
          />
        </Modal>

        {/* Sender & Receiver */}
        <Grid columns={2} gap="md" className="my-8">
          <Card title="Sender">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 uppercase">Name</p>
                <p className="font-semibold text-gray-900">{shipment.sender?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase">Phone</p>
                <p className="text-gray-900">{formatPhoneNumber(shipment.sender?.phone_number)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase">Location</p>
                <p className="text-gray-900">{shipment.origin?.stop_name}, {shipment.origin?.city}</p>
              </div>
            </div>
          </Card>

          <Card title="Receiver">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 uppercase">Name</p>
                <p className="font-semibold text-gray-900">{shipment.receiver?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase">Phone</p>
                <p className="text-gray-900">{formatPhoneNumber(shipment.receiver?.phone_number)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase">Location</p>
                <p className="text-gray-900">{shipment.destination?.stop_name}, {shipment.destination?.city}</p>
              </div>
            </div>
          </Card>
        </Grid>

        {/* Package Info */}
        <Grid columns={2} gap="md" className="my-8">
          <Card title="Package Information">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 uppercase">Type</p>
                <p className="font-semibold text-gray-900">{shipment.package_type?.label}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase">Description</p>
                <p className="text-gray-900">{shipment.description}</p>
              </div>
              {shipment.total_weight && (
                <div>
                  <p className="text-sm text-gray-500 uppercase">Weight</p>
                  <p className="text-gray-900">{shipment.total_weight} kg</p>
                </div>
              )}
              {shipment.total_volume && (
                <div>
                  <p className="text-sm text-gray-500 uppercase">Volume</p>
                  <p className="text-gray-900">{shipment.total_volume} m³</p>
                </div>
              )}
            </div>
          </Card>

          {transaction && (
            <Card title="Payment Information">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 uppercase">Amount</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(transaction.amount, 'XAF')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">Method</p>
                  <p className="font-semibold text-gray-900">{transaction.method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">Tax</p>
                  <p className="text-gray-900">{formatCurrency(transaction.tax_amount, 'XAF')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">Date</p>
                  <p className="text-gray-900">{formatDateTime(transaction.created_at)}</p>
                </div>
              </div>
            </Card>
          )}
        </Grid>

        {/* Location Map */}
        {hasTracking && shipment.origin && (
          <Card title="Route Map" className="my-8 h-96">
            <LocationMap
              latitude={shipment.origin.latitude}
              longitude={shipment.origin.longitude}
              markers={[
                { lat: shipment.origin.latitude, lng: shipment.origin.longitude, label: 'Origin' },
                { lat: shipment.destination.latitude, lng: shipment.destination.longitude, label: 'Destination' },
              ]}
            />
          </Card>
        )}

        {/* Tracking History */}
        {trackingLogs.length > 0 && (
          <Card title="Tracking History" className="my-8">
            <div className="space-y-2">
              {trackingLogs.slice().reverse().map((log: any, idx: number) => (
                <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">
                      {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-600">{formatDateTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Photos */}
        {shipment.photos && shipment.photos.length > 0 && (
          <Card title="Shipment Photos" className="my-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {shipment.photos.map((photo: any, idx: number) => (
                <div key={idx}>
                  <img src={photo.image_url} alt={`${photo.stage} photo`} className="w-full " />
                  <p className="text-sm text-gray-600 mt-2">{photo.stage} - {formatDateTime(photo.captured_at)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Container>
    </PageLayout>
  );
}
