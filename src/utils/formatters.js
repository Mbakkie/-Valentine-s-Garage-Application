/**
 * Format a date string or Date object into a readable format.
 * e.g. "12 Jul 2024, 09:34"
 * @param {string|Date} date
 */
export const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-NA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a date string to a short date only.
 */
export const formatDateShort = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-NA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * @param {number} km
 */
export const formatOdometer = (km) => {
  if (km === null || km === undefined) return '—';
  return `${Number(km).toLocaleString('en-NA')} km`;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Return a relative time label.
 * @param {string|Date} date
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};