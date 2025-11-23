import { format } from 'date-fns';
import clsx from 'clsx';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  return format(new Date(date), formatStr);
};

export const formatCurrency = (amount, currency = 'GBP') => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-GB').format(num);
};

export const getStatusBadgeClass = (status) => {
  const statusMap = {
    'Draft': 'badge-gray',
    'QA': 'badge-blue',
    'Pending Approval': 'badge-amber',
    'Approved': 'badge-green',
    'Rejected': 'badge-red',
    'Planned': 'badge-gray',
    'Mobilising': 'badge-blue',
    'Active': 'badge-green',
    'Completed': 'badge-gray',
    'Cancelled': 'badge-red',
    'Open': 'badge-amber',
    'Closed': 'badge-gray',
    'Green': 'badge-green',
    'Amber': 'badge-amber',
    'Red': 'badge-red'
  };

  return statusMap[status] || 'badge-gray';
};

export const calculateProgress = (actual, target) => {
  if (!target || target === 0) return 0;
  return Math.min((actual / target) * 100, 100);
};

export const cn = (...classes) => {
  return clsx(...classes);
};

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportToCsv = (headers, rows, filename) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

