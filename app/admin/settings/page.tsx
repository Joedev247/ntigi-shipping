'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { PageLayout, Container } from '@/components/Layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FormInput, FormSelect, FormCheckbox } from '@/components/Form';
import { Alert } from '@/components/Alert';
import { userService } from '@/services/userService';

export default function SettingsPage() {
  const [tab, setTab] = useState<'profile' | 'agency' | 'localization'>('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [agencySettings, setAgencySettings] = useState({
    name: 'Ntigi Shipping',
    tax_id: 'XX-XXXXXX',
    base_currency: 'XAF',
    phone_support: '+237699999999',
    email_support: 'support@ntigi.com',
  });

  const [localizationSettings, setLocalizationSettings] = useState({
    language: 'en',
    timezone: 'Africa/Douala',
    dateFormat: 'DD/MM/YYYY',
    enableSMS: true,
    enableWhatsApp: true,
    enableEmail: true,
  });

  const handleSaveAgency = () => {
    setSuccess('Agency settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSaveLocalization = () => {
    setSuccess('Localization settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <PageLayout title="Settings">
      <Container className="max-w-4xl">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['profile', 'agency', 'localization'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2  font-medium transition ${
                tab === t ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Agency Settings */}
        {tab === 'agency' && (
          <Card title="Agency Settings">
            <form className="space-y-4">
              <FormInput
                label="Agency Name"
                value={agencySettings.name}
                onChange={(e) => setAgencySettings({ ...agencySettings, name: e.target.value })}
              />
              <FormInput
                label="Tax ID"
                value={agencySettings.tax_id}
                onChange={(e) => setAgencySettings({ ...agencySettings, tax_id: e.target.value })}
              />
              <FormSelect
                label="Base Currency"
                value={agencySettings.base_currency}
                onChange={(e) => setAgencySettings({ ...agencySettings, base_currency: e.target.value })}
                options={[
                  { value: 'XAF', label: 'XAF (Central African Franc)' },
                  { value: 'NGN', label: 'NGN (Nigerian Naira)' },
                  { value: 'KES', label: 'KES (Kenyan Shilling)' },
                  { value: 'USD', label: 'USD (US Dollar)' },
                ]}
              />
              <FormInput
                label="Support Phone"
                value={agencySettings.phone_support}
                onChange={(e) => setAgencySettings({ ...agencySettings, phone_support: e.target.value })}
              />
              <FormInput
                label="Support Email"
                value={agencySettings.email_support}
                onChange={(e) => setAgencySettings({ ...agencySettings, email_support: e.target.value })}
              />
              <Button onClick={handleSaveAgency}>Save Agency Settings</Button>
            </form>
          </Card>
        )}

        {/* Localization Settings */}
        {tab === 'localization' && (
          <Card title="Localization Settings">
            <form className="space-y-4">
              <FormSelect
                label="Language"
                value={localizationSettings.language}
                onChange={(e) => setLocalizationSettings({ ...localizationSettings, language: e.target.value })}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'fr', label: 'Français' },
                  { value: 'sw', label: 'Swahili' },
                ]}
              />
              <FormSelect
                label="Timezone"
                value={localizationSettings.timezone}
                onChange={(e) => setLocalizationSettings({ ...localizationSettings, timezone: e.target.value })}
                options={[
                  { value: 'Africa/Douala', label: 'Africa/Douala (GMT+1)' },
                  { value: 'Africa/Lagos', label: 'Africa/Lagos (GMT+1)' },
                  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (GMT+3)' },
                ]}
              />
              <FormSelect
                label="Date Format"
                value={localizationSettings.dateFormat}
                onChange={(e) => setLocalizationSettings({ ...localizationSettings, dateFormat: e.target.value })}
                options={[
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
              />

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Notification Channels</h4>
                <FormCheckbox
                  label="Enable SMS Notifications"
                  checked={localizationSettings.enableSMS}
                  onChange={(e) => setLocalizationSettings({ ...localizationSettings, enableSMS: e.target.checked })}
                />
                <FormCheckbox
                  label="Enable WhatsApp Notifications"
                  checked={localizationSettings.enableWhatsApp}
                  onChange={(e) => setLocalizationSettings({ ...localizationSettings, enableWhatsApp: e.target.checked })}
                />
                <FormCheckbox
                  label="Enable Email Notifications"
                  checked={localizationSettings.enableEmail}
                  onChange={(e) => setLocalizationSettings({ ...localizationSettings, enableEmail: e.target.checked })}
                />
              </div>

              <Button onClick={handleSaveLocalization}>Save Localization Settings</Button>
            </form>
          </Card>
        )}

        {/* Profile Settings */}
        {tab === 'profile' && (
          <Card title="Profile Settings">
            <div className="space-y-4">
              <p className="text-gray-600">Manage your account profile and preferences.</p>
              <FormInput label="Email" type="email" placeholder="your@email.com" />
              <FormInput label="Phone Number" type="tel" placeholder="+237..." />
              <FormInput label="Full Name" placeholder="John Doe" />

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Change Password</h4>
                <FormInput label="Current Password" type="password" />
                <FormInput label="New Password" type="password" />
                <FormInput label="Confirm New Password" type="password" />
                <Button>Change Password</Button>
              </div>
            </div>
          </Card>
        )}
      </Container>
    </PageLayout>
  );
}
