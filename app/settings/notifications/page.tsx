'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  WhatsappLogo,
  Phone,
  CheckCircle,
  Warning,
  Gear,
  FloppyDisk,
  TestTube
} from 'phosphor-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { 
  initializeNotifications, 
  getNotificationConfig,
  sendSMS,
  sendWhatsApp,
  getNotificationHistory,
  clearNotificationHistory 
} from '@/services/notificationService';

interface NotificationConfig {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  twilioWhatsAppNumber: string;
  enableSMS: boolean;
  enableWhatsApp: boolean;
}

export default function NotificationSettingsPage() {
  const [config, setConfig] = useState<NotificationConfig>({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    twilioWhatsAppNumber: '',
    enableSMS: false,
    enableWhatsApp: false
  });

  const [loading, setLoading] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const savedConfig = getNotificationConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveConfig = () => {
    if (!config.twilioAccountSid || !config.twilioAuthToken) {
      toast.error('Please fill in all required Twilio credentials');
      return;
    }

    if (config.enableSMS && !config.twilioPhoneNumber) {
      toast.error('Please provide a Twilio phone number for SMS');
      return;
    }

    if (config.enableWhatsApp && !config.twilioWhatsAppNumber) {
      toast.error('Please provide a Twilio WhatsApp number');
      return;
    }

    setLoading(true);
    try {
      initializeNotifications(config);
      localStorage.setItem('notificationConfig', JSON.stringify(config));
      toast.success('Notification settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save notification settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async (type: 'SMS' | 'WhatsApp') => {
    if (!testPhoneNumber.trim()) {
      toast.error('Please enter a phone number for testing');
      return;
    }

    setLoading(true);
    try {
      const testPayload = {
        recipient: { phone: testPhoneNumber, name: 'Test User', type },
        messageType: 'CREATED' as const,
        data: {
          trackingNumber: 'TEST-001-2026',
          senderName: 'John Doe',
          receiverName: 'Jane Smith',
          packageWeight: 5,
          estimatedDelivery: `${new Date(Date.now() + 86400000).toLocaleDateString()}`
        }
      };

      if (type === 'SMS') {
        await sendSMS(testPayload);
        toast.success('Test SMS sent successfully!');
      } else {
        await sendWhatsApp(testPayload);
        toast.success('Test WhatsApp message sent successfully!');
      }
    } catch (error) {
      toast.error(`Failed to send test ${type} message`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = () => {
    const history = getNotificationHistory();
    setNotificationHistory(history);
    setShowHistory(true);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear notification history?')) {
      clearNotificationHistory();
      setNotificationHistory([]);
      toast.success('Notification history cleared');
    }
  };

  return (
    <DashboardLayout title="Notification Settings">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        </div>
        <p className="text-gray-600">Configure SMS and WhatsApp notifications for shipment updates</p>
      </div>

      {/* Twilio Configuration */}
      <Card className="mb-6 border-l-4 border-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gear size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Twilio Configuration</h2>
          </div>
          {config.twilioAccountSid ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle size={20} />
              <span className="text-sm font-semibold">Configured</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-600">
              <Warning size={20} />
              <span className="text-sm font-semibold">Not Configured</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Get your Twilio credentials from <a href="https://www.twilio.com/console" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">twilio.com/console</a>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Twilio Account SID *</label>
            <input
              type="password"
              name="twilioAccountSid"
              value={config.twilioAccountSid}
              onChange={handleInputChange}
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Found in Twilio Console under Account Info</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Twilio Auth Token *</label>
            <input
              type="password"
              name="twilioAuthToken"
              value={config.twilioAuthToken}
              onChange={handleInputChange}
              placeholder="Your Auth Token"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Keep this token secret and secure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <Phone size={16} className="inline mr-1" />
                Twilio Phone Number (SMS)
              </label>
              <input
                type="tel"
                name="twilioPhoneNumber"
                value={config.twilioPhoneNumber}
                onChange={handleInputChange}
                placeholder="+237XXXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Your Twilio phone for SMS</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <WhatsappLogo size={16} className="inline mr-1" />
                Twilio WhatsApp Number
              </label>
              <input
                type="tel"
                name="twilioWhatsAppNumber"
                value={config.twilioWhatsAppNumber}
                onChange={handleInputChange}
                placeholder="whatsapp:+237XXXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">WhatsApp Business number from Twilio</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Enable/Disable Options */}
      <Card className="mb-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Notification Channels</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <Phone size={24} className="text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-600">Send shipment updates via SMS</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="enableSMS"
                checked={config.enableSMS}
                onChange={handleInputChange}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-sm font-semibold">{config.enableSMS ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <WhatsappLogo size={24} className="text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">WhatsApp Notifications</h3>
                <p className="text-sm text-gray-600">Send shipment updates via WhatsApp</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="enableWhatsApp"
                checked={config.enableWhatsApp}
                onChange={handleInputChange}
                className="w-5 h-5 accent-green-600"
              />
              <span className="text-sm font-semibold">{config.enableWhatsApp ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Save Configuration */}
      <div className="mb-6 flex gap-3">
        <Button
          onClick={handleSaveConfig}
          disabled={loading}
          className="flex items-center gap-2"
          variant="primary"
        >
          <FloppyDisk size={18} />
          {loading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      {/* Test Notifications */}
      <Card className="mb-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TestTube size={20} className="text-amber-600" />
          Test Notifications
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number for Testing</label>
            <input
              type="tel"
              value={testPhoneNumber}
              onChange={(e) => setTestPhoneNumber(e.target.value)}
              placeholder="+237XXXXXXXXXX or 6XXXXXXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-600 mt-1">Use your own phone number to test notifications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => handleTestNotification('SMS')}
              disabled={loading || !config.enableSMS}
              className="flex items-center justify-center gap-2"
              variant={config.enableSMS ? 'primary' : 'secondary'}
            >
              <Phone size={18} />
              Test SMS
            </Button>
            <Button
              onClick={() => handleTestNotification('WhatsApp')}
              disabled={loading || !config.enableWhatsApp}
              className="flex items-center justify-center gap-2"
              variant={config.enableWhatsApp ? 'primary' : 'secondary'}
            >
              <WhatsappLogo size={18} />
              Test WhatsApp
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification History */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Notification History</h2>
          <div className="flex gap-2">
            <Button
              onClick={handleViewHistory}
              size="sm"
              variant="secondary"
            >
              View History
            </Button>
            <Button
              onClick={handleClearHistory}
              size="sm"
              variant="secondary"
              className="text-red-600"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">
            Total notifications sent: <span className="font-bold text-purple-600">{notificationHistory.length}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">Recent notifications are logged for audit purposes</p>
        </div>
      </Card>

      {/* History Modal */}
      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="Notification History"
        width="lg"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notificationHistory.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No notifications sent yet</p>
          ) : (
            notificationHistory.map((record: any) => (
              <div key={record.id} className="p-3 bg-gray-50 rounded border border-gray-200 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900">{record.type}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    record.status === 'sent' ? 'bg-green-100 text-green-700' :
                    record.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
                <p className="text-gray-600">To: {record.recipient}</p>
                <p className="text-gray-600">Type: {record.messageType}</p>
                <p className="text-gray-500 text-xs mt-1">{new Date(record.timestamp).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
