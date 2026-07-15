/**
 * Format a YYYY-MM-DD date string into a friendly readable date
 * @param {string} dateStr 
 * @returns {string} e.g. July 14, 2026
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = new Date(dateStr + 'T00:00:00'); // append time to avoid timezone offsets
  return dateObj.toLocaleDateString('en-US', options);
};
/**
 * Get CSS badge classes based on appointment or application status
 * @param {string} status 
 * @returns {string} CSS classes
 */
export const getStatusBadgeClass = (status) => {
  if (!status) return 'badge-pending';
  switch (status.toLowerCase()) {
    case 'pending':
      return 'badge-pending';
    case 'approved':
    case 'accepted':
      return 'badge-approved';
    case 'rejected':
      return 'badge-rejected';
    case 'completed':
      return 'badge-completed';
    case 'cancelled':
      return 'badge-cancelled';
    default:
      return 'badge-pending';
  }
};
/**
 * Format consultation fee into USD currency display
 * @param {number} fee 
 * @returns {string} e.g. $150
 */
export const formatCurrency = (fee) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(fee);
};
