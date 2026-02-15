'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FormInput, FormSelect, FormTextarea } from '@/components/Form';
import { Alert } from '@/components/Alert';
import toast from 'react-hot-toast';

interface OrderFormProps {
  onClose?: () => void;
  onSuccess?: (data: any) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    origin_branch: '',
    destination_branch: '',
    items_description: '',
    items_count: '1',
    total_amount: '',
    status: 'PENDING',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.customer_name.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!formData.customer_email.trim()) {
      setError('Customer email is required');
      return;
    }
    if (!formData.customer_phone.trim()) {
      setError('Customer phone is required');
      return;
    }
    if (!formData.total_amount.trim()) {
      setError('Total amount is required');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        total_amount: parseFloat(formData.total_amount),
        items_count: parseInt(formData.items_count) || 1
      };

      setSuccess('Order created successfully!');
      toast.success('Order created successfully');

      if (onSuccess) {
        onSuccess(orderData);
      }

      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        origin_branch: '',
        destination_branch: '',
        items_description: '',
        items_count: '1',
        total_amount: '',
        status: 'PENDING',
        notes: '',
      });

      // Close modal after success
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);
    } catch (err) {
      setError('Failed to create order. Please try again.');
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Customer Information */}
      <div className="bg-gray-50 p-5 ">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Customer Name"
            name="customer_name"
            placeholder="John Doe"
            value={formData.customer_name}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Email"
            name="customer_email"
            type="email"
            placeholder="john@example.com"
            value={formData.customer_email}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Phone"
            name="customer_phone"
            placeholder="+ 237 6XX XXX XXX"
            value={formData.customer_phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 p-5 ">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Total Amount (XAF)"
            name="total_amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={formData.total_amount}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Number of Items"
            name="items_count"
            type="number"
            placeholder="1"
            value={formData.items_count}
            onChange={handleInputChange}
          />
        </div>
        <FormTextarea
          label="Items Description"
          name="items_description"
          placeholder="Describe the items in this order..."
          value={formData.items_description}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      {/* Order Status */}
      <div className="bg-gray-50 p-5 ">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
        <FormSelect
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          options={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'CONFIRMED', label: 'Confirmed' },
            { value: 'PROCESSING', label: 'Processing' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' }
          ]}
        />
      </div>

      {/* Notes */}
      <div className="bg-gray-50 p-5 ">
        <FormTextarea
          label="Additional Notes"
          name="notes"
          placeholder="Add any special instructions or notes..."
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
};
