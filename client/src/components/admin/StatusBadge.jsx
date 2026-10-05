import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || 'Pending').toLowerCase();

  let styles = {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  };

  switch (normalized) {
    case 'confirmed':
      styles = {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
      break;
    case 'shipped':
      styles = {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
      };
      break;
    case 'delivered':
      styles = {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
      break;
    case 'cancelled':
      styles = {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      };
      break;
    case 'pending':
    default:
      styles = {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {status || 'Pending'}
    </span>
  );
};

export default StatusBadge;
