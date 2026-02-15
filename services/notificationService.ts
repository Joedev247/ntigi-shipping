// SMS and WhatsApp Notification Service using Twilio + Supabase
// Configuration and sending notifications with database logging

import { getSupabaseClient } from '@/lib/supabase';

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
    
    // Log notification to Supabase
    await logNotificationToDatabase({
      phoneNumber: payload.recipient.phone,
      messageType: payload.messageType,
      channel: 'SMS',
      messageContent: message,
      status: 'SENT',
      shipmentId: payload.data.trackingNumber
    });
  } catch (error) {
    console.error('SMS send error:', error);
    // Fallback: log for debugging
    console.log(`[SMS FALLBACK] To: ${payload.recipient.phone}, Message: ${messageTemplates[payload.messageType](payload.data)}`);
    
    // Log failed notification
    await logNotificationToDatabase({
      phoneNumber: payload.recipient.phone,
      messageType: payload.messageType,
      channel: 'SMS',
      messageContent: messageTemplates[payload.messageType](payload.data),
      status: 'FAILED',
      shipmentId: payload.data.trackingNumber
    });
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
    
    // Log notification to Supabase
    await logNotificationToDatabase({
      phoneNumber: whatsAppPhone,
      messageType: payload.messageType,
      channel: 'WHATSAPP',
      messageContent: message,
      status: 'SENT',
      shipmentId: payload.data.trackingNumber
    });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    // Fallback: log for debugging
    console.log(`[WHATSAPP FALLBACK] To: ${payload.recipient.phone}, Message: ${messageTemplates[payload.messageType](payload.data)}`);
    
    // Log failed notification
    await logNotificationToDatabase({
      phoneNumber: payload.recipient.phone,
      messageType: payload.messageType,
      channel: 'WHATSAPP',
      messageContent: messageTemplates[payload.messageType](payload.data),
      status: 'FAILED',
      shipmentId: payload.data.trackingNumber
    });
  }
}

// ========================================
// SUPABASE INTEGRATION FUNCTIONS
// ========================================

// Get notification preferences for a client
export async function getNotificationPreferences(clientId: string) {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('notification_preferences')
      .select('*')
      .eq('client_id', clientId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching preferences: ${error.message}`);
    }
    return data || null;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return null;
  }
}

// Save/Update notification preferences
export async function setNotificationPreferences(
  clientId: string,
  preferences: {
    smsEnabled?: boolean;
    whatsappEnabled?: boolean;
    emailEnabled?: boolean;
    phoneCallEnabled?: boolean;
  }
) {
  try {
    const existing = await getNotificationPreferences(clientId);
    const client = getSupabaseClient();
    
    if (existing) {
      // Update
      const { data, error } = await (client
        .from('notification_preferences') as any)
        .update({
          sms_enabled: preferences.smsEnabled,
          whatsapp_enabled: preferences.whatsappEnabled,
          email_enabled: preferences.emailEnabled,
          phone_call_enabled: preferences.phoneCallEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', clientId)
        .select();
      
      if (error) throw new Error(`Error updating preferences: ${error.message}`);
      return data[0];
    } else {
      // Create
      const { data, error } = await client
        .from('notification_preferences')
        .insert([
          {
            client_id: clientId,
            sms_enabled: preferences.smsEnabled ?? true,
            whatsapp_enabled: preferences.whatsappEnabled ?? true,
            email_enabled: preferences.emailEnabled ?? false,
            phone_call_enabled: preferences.phoneCallEnabled ?? false
          }
        ] as any)
        .select();
      
      if (error) throw new Error(`Error creating preferences: ${error.message}`);
      return data[0];
    }
  } catch (error) {
    console.error('Error setting notification preferences:', error);
    throw error;
  }
}

// Log notification to database
interface NotificationLogEntry {
  phoneNumber: string;
  messageType: string;
  channel: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'PHONE_CALL';
  messageContent: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  shipmentId?: string;
  clientId?: string;
}

export async function logNotificationToDatabase(log: NotificationLogEntry) {
  try {
    const client = getSupabaseClient();
    // Find client by phone number
    let clientId = log.clientId;
    if (!clientId) {
      const { data: clientData } = await (client
        .from('clients') as any)
        .select('client_id')
        .eq('phone_number', log.phoneNumber)
        .single();
      clientId = (clientData as any)?.client_id;
    }

    // Find shipment ID by tracking number
    let shipmentId = undefined;
    if (log.shipmentId) {
      const { data: shipmentData } = await (client
        .from('shipments') as any)
        .select('shipment_id')
        .eq('tracking_no', log.shipmentId)
        .single();
      shipmentId = (shipmentData as any)?.shipment_id;
    }

    const { error } = await client
      .from('notification_logs')
      .insert([
        {
          client_id: clientId,
          shipment_id: shipmentId,
          message_type: log.messageType,
          channel: log.channel,
          phone_to: log.phoneNumber,
          message_content: log.messageContent,
          status: log.status,
          sent_at: log.status === 'SENT' ? new Date().toISOString() : null
        }
      ] as any);

    if (error) {
      console.error('Error logging notification:', error);
    }
  } catch (error) {
    console.error('Error in logNotificationToDatabase:', error);
  }
}

// Get notification history for a client
export async function getNotificationHistory(clientId: string, limit = 50) {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('notification_logs')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Error fetching history: ${error.message}`);
    return data || [];
  } catch (error) {
    console.error('Error getting notification history:', error);
    return [];
  }
}

// Get notification history for a shipment
export async function getShipmentNotificationHistory(shipmentId: string) {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('notification_logs')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Error fetching shipment notifications: ${error.message}`);
    return data || [];
  } catch (error) {
    console.error('Error getting shipment notification history:', error);
    return [];
  }
}

// Get notification statistics
export async function getNotificationStatistics(agencyId?: string) {
  try {
    const client = getSupabaseClient();
    let query = client
      .from('notification_logs')
      .select('status, channel', { count: 'exact' });

    const { data, count, error } = await query;

    if (error) throw new Error(`Error fetching statistics: ${error.message}`);

    const stats = {
      totalSent: (data as any)?.filter((n: any) => n.status === 'SENT').length || 0,
      totalFailed: (data as any)?.filter((n: any) => n.status === 'FAILED').length || 0,
      smsSent: (data as any)?.filter((n: any) => n.channel === 'SMS' && n.status === 'SENT').length || 0,
      whatsappSent: (data as any)?.filter((n: any) => n.channel === 'WHATSAPP' && n.status === 'SENT').length || 0,
      emailSent: (data as any)?.filter((n: any) => n.channel === 'EMAIL' && n.status === 'SENT').length || 0,
    };

    return stats;
  } catch (error) {
    console.error('Error getting notification statistics:', error);
    return {
      totalSent: 0,
      totalFailed: 0,
      smsSent: 0,
      whatsappSent: 0,
      emailSent: 0
    };
  }
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

// Send notification (auto-select based on client preferences from Supabase)
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  try {
    // Get client preferences from Supabase by phone number
    const client = getSupabaseClient();
    const { data: clientData } = await client
      .from('clients')
      .select('client_id')
      .eq('phone_number', payload.recipient.phone)
      .single();

    if (clientData) {
      const preferences = await getNotificationPreferences((clientData as any).client_id);
      
      // Determine channels based on preferences or recipient type
      const channels = {
        sms: (preferences as any)?.sms_enabled ?? (payload.recipient.type === 'SMS' || payload.recipient.type === 'both'),
        whatsapp: (preferences as any)?.whatsapp_enabled ?? (payload.recipient.type === 'WhatsApp' || payload.recipient.type === 'both'),
      };

      if (channels.sms) {
        await sendSMS(payload);
      }
      if (channels.whatsapp) {
        await sendWhatsApp(payload);
      }
      
      if (!channels.sms && !channels.whatsapp && !payload.recipient.type) {
        console.warn('No notification channels enabled for recipient:', payload.recipient.phone);
      }
    } else {
      // Client not found in Supabase, use fallback
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
  } catch (error) {
    console.error('Error in sendNotification:', error);
    // Fallback to original logic
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
}

// Send bulk notifications (for batch operations)
export async function sendBulkNotifications(payloads: NotificationPayload[]): Promise<void> {
  await Promise.allSettled(
    payloads.map(payload => sendNotification(payload))
  );
}

// Clear notification history for a client
export async function clearNotificationHistory(clientId?: string): Promise<void> {
  try {
    const client = getSupabaseClient();
    
    if (clientId) {
      // Clear history for specific client
      const { error } = await (client
        .from('notification_logs') as any)
        .delete()
        .eq('client_id', clientId);
      
      if (error) throw new Error(`Error clearing history: ${error.message}`);
    } else {
      // Clear all history (admin function)
      const { error } = await (client
        .from('notification_logs') as any)
        .delete()
        .gt('id', 0);
      
      if (error) throw new Error(`Error clearing all history: ${error.message}`);
    }
  } catch (error) {
    console.error('Error clearing notification history:', error);
    throw error;
  }
}
