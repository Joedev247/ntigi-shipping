'use client';

import React from 'react';
import { Printer, Download, X } from 'phosphor-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { generatePDF } from '@/utils/receiptUtils';
import { printThermal } from '../services/thermalPrinterService';
import toast from 'react-hot-toast';

interface ReceiptProps {
  shipmentId: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  packageWeight: number;
  packageType: string;
  status: string;
  createdDate: string;
  deliveryDate?: string;
  totalCost: number;
  branch: string;
  driver?: string;
  onClose?: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({
  shipmentId,
  trackingNumber,
  senderName,
  senderPhone,
  senderAddress,
  receiverName,
  receiverPhone,
  receiverAddress,
  packageWeight,
  packageType,
  status,
  createdDate,
  deliveryDate,
  totalCost,
  branch,
  driver,
  onClose
}) => {
  const handlePrintPDF = async () => {
    try {
      await generatePDF({
        shipmentId,
        trackingNumber,
        senderName,
        senderPhone,
        senderAddress,
        receiverName,
        receiverPhone,
        receiverAddress,
        packageWeight,
        packageType,
        status,
        createdDate,
        deliveryDate,
        totalCost,
        branch,
        driver
      });
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF receipt');
      console.error(error);
    }
  };

  const handleThermalPrint = async () => {
    try {
      await printThermal({
        shipmentId,
        trackingNumber,
        senderName,
        senderPhone,
        senderAddress,
        receiverName,
        receiverPhone,
        receiverAddress,
        packageWeight,
        packageType,
        status,
        createdDate,
        deliveryDate,
        totalCost,
        branch,
        driver
      });
      toast.success('Receipt sent to thermal printer!');
    } catch (error) {
      toast.error('Failed to print receipt');
      console.error(error);
    }
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'IN_TRANSIT': return 'text-blue-600 bg-blue-100';
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Receipt Preview */}
      <Card className="bg-white border-2 border-gray-200">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">NTIGI SHIPPING</div>
            <p className="text-xs text-gray-600">Professional Logistics & Delivery Services</p>
            <p className="text-xs text-gray-500">Cameroon • Fast • Reliable • Trusted</p>
          </div>

          {/* Shipment ID & Tracking */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 text-xs font-semibold">SHIPMENT ID</p>
                <p className="font-mono font-bold text-gray-900 text-lg">{shipmentId}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-semibold">TRACKING #</p>
                <p className="font-mono font-bold text-gray-900 text-lg">{trackingNumber}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>

          {/* Sender Information */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 text-sm mb-2 bg-gray-100 px-2 py-1 rounded">SENDER</h4>
            <div className="text-sm space-y-1 border-l-4 border-blue-500 pl-3">
              <p className="font-semibold text-gray-900">{senderName}</p>
              <p className="text-gray-600">📞 {senderPhone}</p>
              <p className="text-gray-600 text-xs">{senderAddress}</p>
            </div>
          </div>

          {/* Receiver Information */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 text-sm mb-2 bg-gray-100 px-2 py-1 rounded">RECEIVER</h4>
            <div className="text-sm space-y-1 border-l-4 border-green-500 pl-3">
              <p className="font-semibold text-gray-900">{receiverName}</p>
              <p className="text-gray-600">📞 {receiverPhone}</p>
              <p className="text-gray-600 text-xs">{receiverAddress}</p>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            <h4 className="font-bold text-gray-900 text-sm mb-2">PACKAGE DETAILS</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Type</p>
                <p className="font-semibold text-gray-900">{packageType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Weight</p>
                <p className="font-semibold text-gray-900">{packageWeight}kg</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Created:</span>
              <span className="font-semibold text-gray-900">{createdDate}</span>
            </div>
            {deliveryDate && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Delivered:</span>
                <span className="font-semibold text-green-600">{deliveryDate}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Branch:</span>
              <span className="font-semibold text-gray-900">{branch}</span>
            </div>
            {driver && (
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="text-gray-600">Driver:</span>
                <span className="font-semibold text-gray-900">{driver}</span>
              </div>
            )}
          </div>

          {/* Total Cost */}
          <div className="border-t-2 border-gray-300 pt-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">TOTAL COST:</span>
              <span className="text-2xl font-bold text-green-600">XAF {totalCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
            <p>Thank you for using NTIGI SHIPPING!</p>
            <p>Track your shipment at: ntigi-shipping.cm/track/{trackingNumber}</p>
            <p className="mt-2 text-gray-400">Printed: {new Date().toLocaleString('en-GB')}</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button 
          onClick={handlePrintPDF} 
          className="flex items-center gap-2 flex-1"
          variant="primary"
        >
          <Download size={18} />
          Download PDF Receipt
        </Button>
        <Button 
          onClick={handleThermalPrint}
          className="flex items-center gap-2 flex-1"
          variant="secondary"
        >
          <Printer size={18} />
          Print on Thermal Printer
        </Button>
        {onClose && (
          <Button 
            onClick={onClose}
            className="flex items-center gap-2"
            variant="secondary"
          >
            <X size={18} />
            Close
          </Button>
        )}
      </div>
    </div>
  );
};
