// Utility helpers

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return dateStr;
}

export function generateFileName(name, ext) {
  const sanitized = (name || 'Resume').replace(/[^a-zA-Z0-9\s]/g, '').trim();
  return `${sanitized}_Resume.${ext}`;
}

export function generateDataFileName(name) {
  const sanitized = (name || 'Resume').replace(/[^a-zA-Z0-9\s]/g, '').trim();
  return `${sanitized}_data.json`;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getCurrentTimestamp() {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
