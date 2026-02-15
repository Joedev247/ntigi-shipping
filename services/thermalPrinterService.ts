// Thermal Printer Service for ESC/POS Protocol
// Supports connected USB/Ethernet thermal printers

interface ThermalPrintData {
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
}

// ESC/POS Command Codes
const ESC_POS = {
  ESC: '\x1B',
  GS: '\x1D',
  RESET: '\x1B\x40',
  INIT: '\x1B\x40',
  ALIGN_LEFT: '\x1Ba\x00',
  ALIGN_CENTER: '\x1Ba\x01',
  ALIGN_RIGHT: '\x1Ba\x02',
  BOLD_ON: '\x1B\x45\x01',
  BOLD_OFF: '\x1B\x45\x00',
  FONT_SIZE_NORMAL: '\x1D\x21\x00',
  FONT_SIZE_2X: '\x1D\x21\x11',
  FONT_SIZE_3X: '\x1D\x21\x22',
  UNDERLINE_ON: '\x1B\x2D\x01',
  UNDERLINE_OFF: '\x1B\x2D\x00',
  CUT_PAPER: '\x1D\x56\x42\x00',
  FEED_LINES: (n: number) => `\x1B\x64${String.fromCharCode(n)}`,
};

// Generate thermal printer commands
function generateThermalCommands(data: ThermalPrintData): string {
  let commands = '';

  // Initialize printer
  commands += ESC_POS.RESET;
  commands += ESC_POS.ALIGN_CENTER;

  // Company header
  commands += ESC_POS.BOLD_ON;
  commands += ESC_POS.FONT_SIZE_2X;
  commands += 'NTIGI SHIPPING\n';
  commands += ESC_POS.FONT_SIZE_NORMAL;
  commands += ESC_POS.BOLD_OFF;

  commands += 'Professional Logistics & Delivery\n';
  commands += 'Cameroon | Fast | Reliable | Trusted\n';
  commands += '\n';

  // Separator
  commands += '================================\n';
  commands += '\n';

  // Switch to left align for details
  commands += ESC_POS.ALIGN_LEFT;

  // Shipment and Tracking
  commands += ESC_POS.BOLD_ON;
  commands += 'SHIPMENT ID: ' + data.shipmentId + '\n';
  commands += 'TRACKING #:  ' + data.trackingNumber + '\n';
  commands += ESC_POS.BOLD_OFF;
  commands += 'Status:      ' + data.status + '\n';
  commands += '\n';

  // Separator
  commands += '================================\n\n';

  // Sender
  commands += ESC_POS.BOLD_ON;
  commands += 'FROM (SENDER):\n';
  commands += ESC_POS.BOLD_OFF;
  commands += truncateText(data.senderName, 32) + '\n';
  commands += 'Phone: ' + data.senderPhone + '\n';
  commands += truncateText(data.senderAddress, 32) + '\n';
  commands += '\n';

  // Receiver
  commands += ESC_POS.BOLD_ON;
  commands += 'TO (RECEIVER):\n';
  commands += ESC_POS.BOLD_OFF;
  commands += truncateText(data.receiverName, 32) + '\n';
  commands += 'Phone: ' + data.receiverPhone + '\n';
  commands += truncateText(data.receiverAddress, 32) + '\n';
  commands += '\n';

  // Separator
  commands += '================================\n\n';

  // Package Details
  commands += ESC_POS.BOLD_ON;
  commands += 'PACKAGE DETAILS:\n';
  commands += ESC_POS.BOLD_OFF;
  commands += 'Type:        ' + data.packageType + '\n';
  commands += 'Weight:      ' + data.packageWeight + 'kg\n';
  commands += 'Branch:      ' + data.branch + '\n';
  if (data.driver) {
    commands += 'Driver:      ' + data.driver + '\n';
  }
  commands += '\n';

  // Timeline
  commands += ESC_POS.BOLD_ON;
  commands += 'TIMELINE:\n';
  commands += ESC_POS.BOLD_OFF;
  commands += 'Created:     ' + data.createdDate + '\n';
  if (data.deliveryDate) {
    commands += 'Delivered:   ' + data.deliveryDate + '\n';
  }
  commands += '\n';

  // Separator
  commands += '================================\n';

  // Total Cost
  commands += ESC_POS.ALIGN_CENTER;
  commands += ESC_POS.BOLD_ON;
  commands += ESC_POS.FONT_SIZE_2X;
  commands += 'TOTAL: XAF ' + data.totalCost.toLocaleString() + '\n';
  commands += ESC_POS.FONT_SIZE_NORMAL;
  commands += ESC_POS.BOLD_OFF;

  commands += '\n';
  commands += ESC_POS.ALIGN_CENTER;
  commands += 'Thank you for using NTIGI SHIPPING!\n';
  commands += 'Track: ntigi-shipping.cm/track/' + data.trackingNumber + '\n';
  const now = new Date().toLocaleString('en-GB');
  commands += 'Printed: ' + now + '\n';
  commands += '\n\n';

  // Cut paper
  commands += ESC_POS.CUT_PAPER;

  return commands;
}

// Utility function to truncate text for thermal printer
function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + '...';
  }
  return text;
}

// Main printing function
export async function printThermal(data: ThermalPrintData): Promise<void> {
  try {
    // Check if Web Serial API is available (for USB printers)
    if ('serial' in navigator) {
      const port = await (navigator.serial as any).requestPort();
      await port.open({ baudRate: 9600 });

      const commands = generateThermalCommands(data);
      const encoder = new TextEncoder();
      const encodedCommands = encoder.encode(commands);

      const writer = port.writable.getWriter();
      await writer.write(encodedCommands);
      await writer.releaseLock();

      // Give printer time to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      await port.close();

      console.log('Receipt printed successfully on thermal printer via USB');
    } else if ('print' in window) {
      // Fallback to system print dialog
      const printContent = generateHTMLReceipt(data);
      const blob = new Blob([printContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      };

      console.log('Opened system print dialog');
    } else {
      throw new Error('No printing capability detected. Please ensure a thermal printer is connected.');
    }
  } catch (error) {
    console.error('Thermal printing error:', error);
    throw new Error('Failed to print thermal receipt. Please check printer connection.');
  }
}

// Fallback HTML receipt for system print
function generateHTMLReceipt(data: ThermalPrintData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Receipt - ${data.trackingNumber}</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 0; }
        @page { margin: 0; size: 80mm auto; }
        .receipt { width: 80mm; padding: 10px; }
        .header { text-align: center; margin-bottom: 10px; }
        .company { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
        .separator { text-align: center; margin: 10px 0; }
        .line { display: block; }
        .bold { font-weight: bold; }
        .center { text-align: center; }
        .amount { font-size: 18px; font-weight: bold; color: green; }
        @media print { @page { margin: 0; } body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="company">NTIGI SHIPPING</div>
          <div style="font-size: 10px;">Professional Logistics & Delivery</div>
          <div style="font-size: 10px;">Cameroon | Fast | Reliable</div>
        </div>
        
        <div class="separator">================================</div>
        
        <div class="bold">SHIPMENT ID: ${data.shipmentId}</div>
        <div class="bold">TRACKING #: ${data.trackingNumber}</div>
        <div>Status: ${data.status}</div>
        
        <div class="separator">================================</div>
        
        <div><span class="bold">FROM:</span></div>
        <div>${data.senderName}</div>
        <div>${data.senderPhone}</div>
        <div>${data.senderAddress}</div>
        
        <div style="margin-top: 10px;"><span class="bold">TO:</span></div>
        <div>${data.receiverName}</div>
        <div>${data.receiverPhone}</div>
        <div>${data.receiverAddress}</div>
        
        <div class="separator">================================</div>
        
        <div><span class="bold">PACKAGE:</span></div>
        <div>Type: ${data.packageType}</div>
        <div>Weight: ${data.packageWeight}kg</div>
        <div>Branch: ${data.branch}</div>
        ${data.driver ? `<div>Driver: ${data.driver}</div>` : ''}
        
        <div style="margin-top: 10px;">
          <div>Created: ${data.createdDate}</div>
          ${data.deliveryDate ? `<div>Delivered: ${data.deliveryDate}</div>` : ''}
        </div>
        
        <div class="separator">================================</div>
        
        <div class="center bold amount">TOTAL: XAF ${data.totalCost.toLocaleString()}</div>
        
        <div style="margin-top: 15px; font-size: 10px; text-align: center;">
          <div>Thank you!</div>
          <div>Track: ntigi-shipping.cm/track/${data.trackingNumber}</div>
          <div style="margin-top: 5px; font-size: 9px;">Printed: ${new Date().toLocaleString('en-GB')}</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Get available printers (for future enhancement)
export async function getAvailablePrinters(): Promise<string[]> {
  const printers: string[] = [];
  
  try {
    if ('serial' in navigator) {
      // Can enumerate serial ports
      const ports = await (navigator.serial as any).getPorts();
      ports.forEach((port: any, index: number) => {
        printers.push(`Thermal Printer ${index + 1}`);
      });
    }
  } catch (error) {
    console.error('Error getting available printers:', error);
  }
  
  return printers;
}
