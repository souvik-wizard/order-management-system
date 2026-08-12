
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);


export const formatDate = (date, locale = 'en-US') =>
  new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(date)
  );


export const capitalise = (str = '') => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


export const truncate = (str = '', maxLength = 100) =>
  str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;


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
