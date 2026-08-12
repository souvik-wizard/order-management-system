/**
 * Shared utility helpers.
 * Pure functions — no side effects, no imports from the app.
 */

/**
 * Format a number as a currency string.
 * @param {number} amount
 * @param {string} [currency='INR']
 * @param {string} [locale='en-IN']
 * @returns {string}  e.g. "₹199.00"
 */
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);

/**
 * Format a Date (or ISO string) into a human-readable string.
 * @param {Date|string} date
 * @param {string} [locale='en-US']
 * @returns {string}  e.g. "August 12, 2026"
 */
export const formatDate = (date, locale = 'en-US') =>
  new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(date)
  );

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalise = (str = '') => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Truncate a string to maxLength characters, appending '…' if truncated.
 * @param {string} str
 * @param {number} [maxLength=100]
 * @returns {string}
 */
export const truncate = (str = '', maxLength = 100) =>
  str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;

/**
 * Derive an order status colour class (Tailwind).
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
  const map = {
    pending: 'text-yellow-600 bg-yellow-100',
    processing: 'text-blue-600 bg-blue-100',
    shipped: 'text-purple-600 bg-purple-100',
    delivered: 'text-green-600 bg-green-100',
    cancelled: 'text-red-600 bg-red-100',
  };
  return map[status] ?? 'text-gray-600 bg-gray-100';
};
