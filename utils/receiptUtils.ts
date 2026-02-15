import { Shipment, Agency, ReceiptTemplate } from '@/types';

export interface ReceiptData {
  shipment: any;
  template: ReceiptTemplate;
  agency: Agency;
  senderName: string;
  receiverName: string;
  originName: string;
  destName: string;
}

// Generate QR code data URL
export const generateQRCode = async (text: string): Promise<string> => {
  try {
    // QR code generation is optional here. Return empty string placeholder.
    // Install 'qrcode' package and implement actual generation if needed.
    return '';
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

// Format receipt for thermal printer (58mm or 80mm)
export const formatReceiptForThermal = async (data: ReceiptData, printerWidth: '58mm' | '80mm' = '58mm'): Promise<string> => {
  const charsPerLine = printerWidth === '58mm' ? 32 : 48;
  const qrCode = data.template.show_qr_code ? await generateQRCode(data.shipment.tracking_no) : null;

  let receipt = '';
  receipt += pad('═', charsPerLine) + '\n';
  receipt += centerText(data.agency.name, charsPerLine) + '\n';
  receipt += centerText(data.template.header_text, charsPerLine) + '\n';
  receipt += pad('─', charsPerLine) + '\n\n';

  receipt += 'SHIPPING RECEIPT\n';
  receipt += pad('─', charsPerLine) + '\n';
  receipt += `Tracking No: ${data.shipment.tracking_no}\n`;
  receipt += `Date: ${new Date(data.shipment.created_at).toLocaleString()}\n`;
  receipt += pad('─', charsPerLine) + '\n\n';

  receipt += 'FROM:\n';
  receipt += `${data.senderName}\n`;
  receipt += `${data.originName}\n\n`;

  receipt += 'TO:\n';
  receipt += `${data.receiverName}\n`;
  receipt += `${data.destName}\n\n`;

  receipt += pad('─', charsPerLine) + '\n';
  receipt += `Items: ${data.shipment.description}\n`;
  receipt += `Total Cost: ${data.agency.base_currency} ${data.shipment.total_cost.toFixed(2)}\n`;
  receipt += pad('─', charsPerLine) + '\n\n';

  if (qrCode) {
    receipt += centerText('[QR CODE PLACEHOLDER]', charsPerLine) + '\n\n';
  }

  receipt += centerText(data.template.footer_text, charsPerLine) + '\n';
  receipt += centerText(`Tax ID: ${data.agency.tax_id}`, charsPerLine) + '\n';
  receipt += pad('═', charsPerLine) + '\n';

  return receipt;
};

// Helper functions
function pad(char: string, length: number): string {
  return char.repeat(length);
}

function centerText(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
}

// Generate PDF receipt
export const generatePDF = async (data: {
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
}): Promise<void> => {
  try {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Receipt - ${data.trackingNumber}</title>
        <style>
          * { margin: 0; padding: 0; }
          body { font-family: 'Arial', sans-serif; font-size: 11px; color: #333; }
          @page { size: A4; margin: 20mm; }
          .receipt { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
          .company-tagline { font-size: 10px; color: #666; margin-top: 3px; }
          .section { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
          .section-title { font-weight: bold; font-size: 12px; background: #f0f0f0; padding: 5px; margin-bottom: 8px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .label { font-weight: bold; width: 40%; }
          .value { width: 60%; text-align: right; }
          .status-badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 9px; font-weight: bold; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-transit { background: #dbeafe; color: #1e40af; }
          .status-completed { background: #dcfce7; color: #166534; }
          .status-failed { background: #fee2e2; color: #991b1b; }
          .address-block { margin-bottom: 8px; padding: 8px; background: #f9fafb; border-left: 3px solid #0ea5e9; }
          .address-name { font-weight: bold; color: #1f2937; }
          .address-phone { color: #0ea5e9; font-size: 10px; }
          .address-detail { color: #666; font-size: 10px; }
          .total-section { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px; border-radius: 4px; text-align: center; margin-top: 15px; }
          .total-label { font-size: 12px; margin-bottom: 5px; }
          .total-amount { font-size: 28px; font-weight: bold; }
          .footer { text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #999; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <!-- Header -->
          <div class="header">
            <div class="company-name">NTIGI SHIPPING</div>
            <div class="company-tagline">Professional Logistics & Delivery Services</div>
            <div class="company-tagline" style="margin-top: 5px;">Cameroon • Fast • Reliable • Trusted</div>
          </div>

          <!-- Shipment & Tracking -->
          <div class="section" style="background: #eff6ff; border-color: #bfdbfe;">
            <div class="info-row">
              <span class="label">Shipment ID:</span>
              <span class="value" style="font-family: monospace; font-weight: bold; font-size: 12px;">${data.shipmentId}</span>
            </div>
            <div class="info-row">
              <span class="label">Tracking #:</span>
              <span class="value" style="font-family: monospace; font-weight: bold; font-size: 12px;">${data.trackingNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="value">
                <span class="status-badge status-${data.status.toLowerCase()}">${data.status}</span>
              </span>
            </div>
          </div>

          <!-- Sender -->
          <div style="margin-bottom: 10px;">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 5px;">FROM (SENDER):</div>
            <div class="address-block">
              <div class="address-name">${data.senderName}</div>
              <div class="address-phone">📞 ${data.senderPhone}</div>
              <div class="address-detail">${data.senderAddress}</div>
            </div>
          </div>

          <!-- Receiver -->
          <div style="margin-bottom: 10px;">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 5px;">TO (RECEIVER):</div>
            <div class="address-block">
              <div class="address-name">${data.receiverName}</div>
              <div class="address-phone">📞 ${data.receiverPhone}</div>
              <div class="address-detail">${data.receiverAddress}</div>
            </div>
          </div>

          <!-- Package Details -->
          <div class="section" style="background: #fffbeb; border-color: #fcd34d;">
            <div class="section-title">PACKAGE DETAILS</div>
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="value">${data.packageType}</span>
            </div>
            <div class="info-row">
              <span class="label">Weight:</span>
              <span class="value">${data.packageWeight} kg</span>
            </div>
            <div class="info-row">
              <span class="label">Branch:</span>
              <span class="value">${data.branch}</span>
            </div>
            ${data.driver ? `
            <div class="info-row">
              <span class="label">Driver:</span>
              <span class="value">${data.driver}</span>
            </div>
            ` : ''}
          </div>

          <!-- Timeline -->
          <div class="section">
            <div class="section-title">TIMELINE</div>
            <div class="info-row">
              <span class="label">Created:</span>
              <span class="value">${data.createdDate}</span>
            </div>
            ${data.deliveryDate ? `
            <div class="info-row">
              <span class="label">Delivered:</span>
              <span class="value" style="color: #16a34a; font-weight: bold;">${data.deliveryDate}</span>
            </div>
            ` : ''}
          </div>

          <!-- Total Cost -->
          <div class="total-section">
            <div class="total-label">TOTAL COST</div>
            <div class="total-amount">XAF ${data.totalCost.toLocaleString()}</div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Thank you for using NTIGI SHIPPING!</p>
            <p>Track your shipment: ntigi-shipping.cm/track/${data.trackingNumber}</p>
            <p style="margin-top: 8px; font-size: 8px;">Generated on ${new Date().toLocaleString('en-GB')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Trigger download using browser's print-to-PDF
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    setTimeout(() => {
      iframe.contentWindow?.print();
    }, 500);

    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 1000);

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF receipt');
  }
};
