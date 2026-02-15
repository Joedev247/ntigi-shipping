// SMS and WhatsApp Notification Service using Twilio
// Configuration and sending notifications

interface NotificationConfig {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  twilioWhatsAppNumber: string;
  enableSMS: boolean;
  enableWhatsApp: boolean;
}

interface NotificationRecipient {
  phone: string;
  name: string;
  type: 'SMS' | 'WhatsApp' | 'both';
}

interface NotificationPayload {
  recipient: NotificationRecipient;
  messageType: 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'DELAYED' | 'CUSTOM';
  data: {
    trackingNumber?: string;
    senderName?: string;
    receiverName?: string;
    packageWeight?: number;
    estimatedDelivery?: string;
    currentLocation?: string;
    driverName?: string;
    driverPhone?: string;
    customMessage?: string;
    reason?: string;
  };
}

// Store configuration in sessionStorage (production: use environment variables + backend)
let notificationConfig: NotificationConfig | null = null;

// Notification templates
const messageTemplates = {
  CREATED: (data: any) => `Hi ${data.senderName}, your shipment (${data.trackingNumber}) has been created. Receiver: ${data.receiverName}. Weight: ${data.packageWeight}kg. You'll be notified when it's picked up. - NTIGI SHIPPING`,
  
  IN_TRANSIT: (data: any) => `${data.receiverName}, your package (${data.trackingNumber}) is on the way! Currently at ${data.currentLocation}. Driver: ${data.driverName}. Delivery expected: ${data.estimatedDelivery}. - NTIGI SHIPPING`,
  
  DELIVERED: (data: any) => `Great news! Your package (${data.trackingNumber}) has been delivered to ${data.receiverName}. Thank you for using NTIGI SHIPPING! Rate us at: ntigi-shipping.cm`,
  
  FAILED: (data: any) => `Unable to deliver package (${data.trackingNumber}) to ${data.receiverName}. Reason: ${data.reason}. Please contact us or we'll retry. - NTIGI SHIPPING`,
  
  DELAYED: (data: any) => `Your package (${data.trackingNumber}) is delayed. Expected delivery: ${data.estimatedDelivery}. We apologize for the inconvenience. - NTIGI SHIPPING`,
  
  CUSTOM: (data: any) => data.customMessage || 'Message from NTIGI SHIPPING'
};

// Initialize notification configuration
export function initializeNotifications(config: NotificationConfig): void {
  notificationConfig = config;
  sessionStorage.setItem('notificationConfig', JSON.stringify(config));
  console.log('Notifications initialized');
}

// Get current configuration
export function getNotificationConfig(): NotificationConfig | null {
  if (!notificationConfig) {
    const stored = sessionStorage.getItem('notificationConfig');
    if (stored) {
      notificationConfig = JSON.parse(stored);
    }
  }
  return notificationConfig;
}

// Send SMS notification
export async function sendSMS(payload: NotificationPayload): Promise<void> {
  const config = getNotificationConfig();
  
  if (!config || !config.enableSMS) {
    console.warn('SMS notifications not configured or disabled');
    return;
  }

  try {
    const message = messageTemplates[payload.messageType](payload.data);
    
    // In production, this would call your backend API which calls Twilio
    const response = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: payload.recipient.phone,
        message: message,
        accountSid: config.twilioAccountSid,
        authToken: config.twilioAuthToken,
        fromNumber: config.twilioPhoneNumber
      })
    });

    if (!response.ok) {
      throw new Error(`SMS sending failed: ${response.statusText}`);
    }

    console.log(`SMS sent to ${payload.recipient.phone}`);
  } catch (error) {
    console.error('SMS send error:', error);
    // Fallback: log for debugging
    console.log(`[SMS FALLBACK] To: ${payload.recipient.phone}, Message: ${messageTemplates[payload.messageType](payload.data)}`);
  }
}

// Send WhatsApp notification
export async function sendWhatsApp(payload: NotificationPayload): Promise<void> {
  const config = getNotificationConfig();
  
  if (!config || !config.enableWhatsApp) {
    console.warn('WhatsApp notifications not configured or disabled');
    return;
  }

  try {
    const message = messageTemplates[payload.messageType](payload.data);
    
    // Format phone for WhatsApp (add country code if needed)
    const whatsAppPhone = formatPhoneForWhatsApp(payload.recipient.phone);
    
    // In production, this would call your backend API which calls Twilio WhatsApp
    const response = await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: whatsAppPhone,
        message: message,
        accountSid: config.twilioAccountSid,
        authToken: config.twilioAuthToken,
        fromNumber: config.twilioWhatsAppNumber
      })
    });

    if (!response.ok) {
      throw new Error(`WhatsApp sending failed: ${response.statusText}`);
    }

    console.log(`WhatsApp sent to ${whatsAppPhone}`);
  } catch (error) {
    console.error('WhatsApp send error:', error);
    // Fallback: log for debugging
    console.log(`[WHATSAPP FALLBACK] To: ${payload.recipient.phone}, Message: ${messageTemplates[payload.messageType](payload.data)}`);
  }
}

// Send notification (auto-select SMS or WhatsApp based on recipient preference)
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  if (payload.recipient.type === 'SMS') {
    await sendSMS(payload);
  } else if (payload.recipient.type === 'WhatsApp') {
    await sendWhatsApp(payload);
  } else if (payload.recipient.type === 'both') {
    await Promise.all([
      sendSMS(payload),
      sendWhatsApp(payload)
    ]);
  }
}

// Send bulk notifications (for batch operations)
export async function sendBulkNotifications(payloads: NotificationPayload[]): Promise<void> {
  await Promise.allSettled(
    payloads.map(payload => sendNotification(payload))
  );
}

// Helper: Format phone number for WhatsApp (Cameroon example: +237...)
function formatPhoneForWhatsApp(phone: string): string {
  // Remove common formatting characters
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it doesn't start with +, add +237 (Cameroon country code)
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('237')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('6') || cleaned.startsWith('7')) {
      cleaned = '+237' + cleaned;
    } else {
      cleaned = '+237' + cleaned;
    }
  }
  
  return cleaned;
}

// Helper: Validate phone number
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s+\-()]{10,20}$/;
  return phoneRegex.test(phone);
}

// Get notification statistics
export function getNotificationStats(): {
  smsSent: number;
  whatsAppSent: number;
  failedNotifications: number;
} {
  const stats = JSON.parse(sessionStorage.getItem('notificationStats') || '{"smsSent":0,"whatsAppSent":0,"failedNotifications":0}');
  return stats;
}

// Reset notification statistics
export function resetNotificationStats(): void {
  sessionStorage.setItem('notificationStats', JSON.stringify({
    smsSent: 0,
    whatsAppSent: 0,
    failedNotifications: 0
  }));
}

// Notification history (for audit trail)
interface NotificationRecord {
  id: string;
  timestamp: string;
  recipient: string;
  type: 'SMS' | 'WhatsApp';
  messageType: string;
  status: 'sent' | 'failed' | 'pending';
  message: string;
}

export function addNotificationRecord(record: Omit<NotificationRecord, 'id' | 'timestamp'>): void {
  const history = JSON.parse(sessionStorage.getItem('notificationHistory') || '[]') as NotificationRecord[];
  const newRecord: NotificationRecord = {
    ...record,
    id: `notif_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  history.push(newRecord);
  
  // Keep only last 100 records
  if (history.length > 100) {
    history.shift();
  }
  
  sessionStorage.setItem('notificationHistory', JSON.stringify(history));
}

export function getNotificationHistory(): NotificationRecord[] {
  return JSON.parse(sessionStorage.getItem('notificationHistory') || '[]');
}

export function clearNotificationHistory(): void {
  sessionStorage.removeItem('notificationHistory');
}
