import { format, parseISO, differenceInDays } from 'date-fns';

const RATES_FROM_INR = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

export const convertCurrency = (amountInINR = 0, targetCurrency = 'INR') => {
  const num = Number(amountInINR) || 0;
  const rate = RATES_FROM_INR[targetCurrency] || 1;
  const converted = Math.round(num * rate);
  return converted;
};

export const formatCurrency = (amount = 0, currency = 'INR') => {
  const num = Number(amount) || 0;
  if (currency === 'INR') {
    return `₹${num.toLocaleString('en-IN')}`;
  }
  if (currency === 'USD') {
    return `$${num.toLocaleString('en-US')}`;
  }
  if (currency === 'EUR') {
    return `€${num.toLocaleString('de-DE')}`;
  }
  if (currency === 'GBP') {
    return `£${num.toLocaleString('en-GB')}`;
  }
  return `${currency} ${num.toLocaleString()}`;
};

export const formatDate = (dateStr, formatPattern = 'MMM dd, yyyy') => {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return format(d, formatPattern);
  } catch (e) {
    return dateStr;
  }
};

export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
    const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  } catch (e) {
    return `${startDate} – ${endDate}`;
  }
};

export const calculateDaysCount = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
    const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
    const days = differenceInDays(end, start) + 1;
    return Math.max(1, days);
  } catch (e) {
    return 1;
  }
};

export const truncateText = (text = '', length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
