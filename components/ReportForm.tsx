'use client';

import React, { useState } from 'react';
import { FileText, Calendar, Funnel, TrendUp, Cloud } from 'phosphor-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/Form';
import { Alert } from '@/components/Alert';

// Cameroon Regions
const cameroonRegions = [
  'All Regions', 'Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North',
  'North West', 'South', 'South West', 'West'
];

// Cameroon Branches (representative)
const cameroonBranches = [
  { value: 'ALL', label: 'All Branches' },
  { value: 'DOUALA', label: 'Douala Branch - Littoral' },
  { value: 'YAOUNDE', label: 'Yaoundé Branch - Centre' },
  { value: 'BAMENDA', label: 'Bamenda Branch - North West' },
  { value: 'BUEA', label: 'Buea Branch - South West' },
  { value: 'GAROUA', label: 'Garoua Branch - North' },
  { value: 'MAROUA', label: 'Maroua Branch - Far North' },
  { value: 'BERTOUA', label: 'Bertoua Branch - East' }
];

interface ReportFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Report Identification
    reportName: '',
    reportType: 'SHIPMENT',
    
    // Time Period
    startDate: '',
    endDate: '',
    
    // Scope & Filters
    department: 'All',
    region: 'All Regions',
    branch: 'ALL',
    
    // Metrics to Include
    metrics: [] as string[],
    
    // Output Format
    includeChart: false,
    includeExport: false,
    
    // Additional Notes
    description: ''
  });

  const reportTypes = [
    { value: 'SHIPMENT', label: 'Shipment Report' },
    { value: 'REVENUE', label: 'Revenue Report' },
    { value: 'EXPENSE', label: 'Expense Report' },
    { value: 'PERFORMANCE', label: 'Performance Report' },
    { value: 'FLEET', label: 'Fleet Report' },
    { value: 'CUSTOMER', label: 'Customer Report' }
  ];

  const departments = [
    'Logistics',
    'Finance',
    'Operations',
    'Sales',
    'Admin',
    'All'
  ];

  const metricsOptions = [
    { label: 'Total Shipments', value: 'total_shipments' },
    { label: 'Total Revenue', value: 'total_revenue' },
    { label: 'Average Cost', value: 'avg_cost' },
    { label: 'Delivery Rate', value: 'delivery_rate' },
    { label: 'Customer Satisfaction', value: 'satisfaction_rate' },
    { label: 'Fleet Utilization', value: 'fleet_util' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMetricToggle = (metric: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.reportName) {
        setError('Report name is required');
        setLoading(false);
        return;
      }

      if (!formData.startDate || !formData.endDate) {
        setError('Start and end dates are required');
        setLoading(false);
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('Start date must be before end date');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess('Report created successfully!');
      
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Report Identification */}
        <div className="bg-green-50 p-4  border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Report Identification</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Report Name"
              name="reportName"
              placeholder="e.g., Monthly Shipment Analysis"
              value={formData.reportName}
              onChange={handleInputChange}
              required
            />
            <FormSelect
              label="Report Type"
              name="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
              options={reportTypes}
              required
            />
          </div>
        </div>

        {/* Section 2: Time Period */}
        <div className="bg-green-50 p-4  border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Time Period</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Section 3: Scope & Filters */}
        <div className="bg-purple-50 p-4  border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Funnel size={20} className="text-purple-600" />
            <h3 className="font-semibold text-gray-800">Scope & Filters</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              options={departments.map(d => ({ value: d, label: d }))}
            />
            <FormSelect
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              options={cameroonRegions.map(r => ({ value: r, label: r }))}
            />
            <FormSelect
              label="Branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              options={cameroonBranches}
              className="col-span-2"
            />
          </div>
        </div>

        {/* Section 4: Metrics to Include */}
        <div className="bg-amber-50 p-4  border border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendUp size={20} className="text-amber-600" />
            <h3 className="font-semibold text-gray-800">Metrics to Include</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {metricsOptions.map(metric => (
              <FormCheckbox
                key={metric.value}
                label={metric.label}
                checked={formData.metrics.includes(metric.value)}
                onChange={() => handleMetricToggle(metric.value)}
              />
            ))}
          </div>
        </div>

        {/* Section 5: Output Format */}
        <div className="bg-indigo-50 p-4  border border-indigo-200">
          <div className="flex items-center gap-2 mb-4">
            <Cloud size={20} className="text-indigo-600" />
            <h3 className="font-semibold text-gray-800">Output Format</h3>
          </div>
          <div className="space-y-3">
            <FormCheckbox
              label="Include Charts & Graphs"
              checked={formData.includeChart}
              onChange={() => setFormData(prev => ({ ...prev, includeChart: !prev.includeChart }))}
            />
            <FormCheckbox
              label="Export as PDF"
              checked={formData.includeExport}
              onChange={() => setFormData(prev => ({ ...prev, includeExport: !prev.includeExport }))}
            />
          </div>
        </div>

        {/* Section 6: Additional Notes */}
        <div className="bg-gray-50 p-4  border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Additional Notes</h3>
          <FormTextarea
            label="Description (optional)"
            name="description"
            placeholder="Add any notes or specific requirements for this report..."
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button variant="primary" type="submit" isLoading={loading}>
            {loading ? 'Creating Report...' : 'Create Report'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReportForm;
