'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ReportForm } from '@/components/ReportForm';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reports, setReports] = useState<any[]>([
    {
      id: 'REP-001',
      name: 'Monthly Shipment Report',
      type: 'SHIPMENT',
      department: 'Logistics',
      created_date: '2026-02-10',
      status: 'COMPLETED',
      format: 'PDF'
    },
    {
      id: 'REP-002',
      name: 'Q1 Revenue Analysis',
      type: 'REVENUE',
      department: 'Finance',
      created_date: '2026-02-08',
      status: 'COMPLETED',
      format: 'Excel'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredReports = reports.filter(r =>
    r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'COMPLETED': 'bg-green-100 text-green-800',
      'PROCESSING': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleReportSubmit = () => {
    const newReport = {
      id: `REP-${String(reports.length + 1).padStart(3, '0')}`,
      name: 'New Report',
      type: 'SHIPMENT',
      department: 'Logistics',
      created_date: new Date().toISOString().split('T')[0],
      status: 'PROCESSING',
      format: 'PDF'
    };
    setReports([...reports, newReport]);
    toast.success('Report queued for generation');
  };

  const router = useRouter();

  const [delayedStart, setDelayedStart] = useState('');
  const [delayedEnd, setDelayedEnd] = useState('');
  const [delayedFormat, setDelayedFormat] = useState('csv');
  const [generating, setGenerating] = useState(false);

  const generateDelayed = async () => {
    try {
      setGenerating(true);
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DELAYED_SHIPMENTS',
          format: delayedFormat,
          startDate: delayedStart || undefined,
          endDate: delayedEnd || undefined,
          thresholdHours: 48
        })
      });
      const data = await res.json();
      if (data?.downloadUrl) {
        // navigate to download URL which will stream CSV
        window.location.href = data.downloadUrl;
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success('Report generation requested');
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Reports">
        <SkeletonLoader rows={5} columns={6} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Reports">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <SearchBar
          placeholder="Search reports..."
          onSearch={setSearchTerm}
        />
        <ActionButton label="+ Generate Report" onClick={() => setShowCreateModal(true)} />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'Report ID' },
          { key: 'name', label: 'Report Name' },
          { key: 'type', label: 'Type' },
          { key: 'department', label: 'Department' },
          { key: 'created_date', label: 'Created Date' },
          {
            key: 'status',
            label: 'Status',
            render: (v) => (
              <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(v)}`}>
                {v}
              </span>
            )
          }
        ]}
        data={filteredReports}
      />

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        <p className="text-sm text-green-800">
          <strong>Tip:</strong> Generate customized reports for shipments, revenue, expenses, and more. Reports can be exported as PDF or Excel.
        </p>
      </div>

      {/* Delayed Shipments Export */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-gray-800 mb-3">Delayed Shipment Logs</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-700">Start Date</label>
            <input type="date" value={delayedStart} onChange={(e) => setDelayedStart(e.target.value)} className="mt-1 px-3 py-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">End Date</label>
            <input type="date" value={delayedEnd} onChange={(e) => setDelayedEnd(e.target.value)} className="mt-1 px-3 py-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Format</label>
            <select value={delayedFormat} onChange={(e) => setDelayedFormat(e.target.value)} className="mt-1 px-3 py-2 border rounded w-full">
              <option value="csv">CSV (Excel)</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div>
            <button onClick={generateDelayed} className="px-4 py-2 bg-yellow-600 text-white rounded" disabled={generating}>
              {generating ? 'Generating...' : 'Export Delayed Logs'}
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">This will export shipments considered delayed (in transit beyond threshold or with manifest arrival before now). Adjust dates to limit results.</p>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Generate New Report"
        width="lg"
      >
        <ReportForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            handleReportSubmit();
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
