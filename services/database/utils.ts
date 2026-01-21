
/**
 * DATABASE UTILS
 * Fungsi helper murni untuk format data
 */

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";
  
  // Clean phone number
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, convert to +62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  
  // If starts with 8 (without country code), add +62
  if (cleaned.startsWith('8') && !cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  
  // Add + prefix
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
