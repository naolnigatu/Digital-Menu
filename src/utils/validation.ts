export const sanitizeName = (text: string): { valid: boolean; value: string; error?: string } => {
  if (!text) return { valid: false, value: '', error: 'Field cannot be empty.' };
  let sanitized = text.trim().replace(/\s+/g, ' ');
  if (sanitized.length > 100) return { valid: false, value: sanitized, error: 'Maximum length exceeded.' };
  // Check for HTML or JS or SQL
  if (/<[^>]*>?/gm.test(sanitized) || /script>|select |insert |update |delete |drop /i.test(sanitized)) {
    return { valid: false, value: sanitized, error: 'Invalid characters detected.' };
  }
  // Allow letters, numbers, spaces, hyphens, apostrophes
  if (!/^[\p{L}\p{N}\s\-']+$/u.test(sanitized)) {
    return { valid: false, value: sanitized, error: 'Only letters, numbers, spaces, hyphens, and apostrophes are allowed.' };
  }
  return { valid: true, value: sanitized };
};

export const validatePhone = (phone: string): { valid: boolean; value: string; error?: string } => {
  if (!phone) return { valid: false, value: '', error: 'Phone number is required.' };
  let sanitized = phone.trim().replace(/\s+/g, '');
  if (!/^\+?[0-9]{7,15}$/.test(sanitized)) {
    return { valid: false, value: sanitized, error: 'Invalid phone number format. Use numbers and optional leading +.' };
  }
  return { valid: true, value: sanitized };
};

export const validateEmail = (email: string): { valid: boolean; value: string; error?: string } => {
  if (!email) return { valid: false, value: '', error: 'Email is required.' };
  let sanitized = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
    return { valid: false, value: sanitized, error: 'Invalid email address.' };
  }
  return { valid: true, value: sanitized };
};

export const validateNumber = (numStr: string, min = 0, max = Infinity): { valid: boolean; value: number; error?: string } => {
  const num = Number(numStr);
  if (isNaN(num)) return { valid: false, value: 0, error: 'Must be a valid number.' };
  if (num < min) return { valid: false, value: num, error: `Value cannot be less than ${min}.` };
  if (num > max) return { valid: false, value: num, error: `Value cannot exceed ${max}.` };
  return { valid: true, value: num };
};

export const validateMultilineText = (text: string): { valid: boolean; value: string; error?: string } => {
  if (!text) return { valid: true, value: '' }; // Optional
  let sanitized = text.trim();
  if (/<script/i.test(sanitized) || /on\w+=/i.test(sanitized)) {
    return { valid: false, value: sanitized, error: 'Invalid HTML/script tags detected.' };
  }
  return { valid: true, value: sanitized };
};
