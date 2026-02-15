'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ActionButton } from '@/components/Dashboard';
import { SkeletonLoader } from '@/components/SkeletonLoader';

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState({
    agencyName: 'Ntigi Shipping',
    taxId: 'TAX-12345',
    currency: 'XAF',
    timezone: 'Africa/Douala',
    dateFormat: 'DD/MM/YYYY',
    notifications: true
  });

  const handleChange = (e: any) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <SkeletonLoader rows={6} columns={2} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white  p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Agency Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
              <input
                type="text"
                name="agencyName"
                value={settings.agencyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={settings.taxId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                <option>XAF</option>
                <option>NGN</option>
                <option>KES</option>
                <option>USD</option>
              </select>
            </div>

            <ActionButton label="Save Changes" />
          </div>
        </div>

        {/* Localization Settings */}
        <div className="bg-white  p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Localization</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                <option>Africa/Douala</option>
                <option>Africa/Lagos</option>
                <option>Africa/Nairobi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                name="dateFormat"
                value={settings.dateFormat}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Enable Notifications</span>
              </label>
            </div>

            <ActionButton label="Save Changes" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
