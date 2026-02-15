// Generate 7-digit alphanumeric tracking number
export const generateTrackingNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TRK';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format tracking number for display
export const formatTrackingNumber = (trackingNo: string): string => {
  return trackingNo.replace(/(.{3})(.{4})/, '$1-$2');
};

// Parse tracking number
export const parseTrackingNumber = (formatted: string): string => {
  return formatted.replace('-', '');
};
