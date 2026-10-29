import React from 'react';
import { ComplaintStatus } from '../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

// Reusable component to show color-coded status labels:
// Pending: Yellow, Assigned: Blue, In Progress: Orange, Resolved: Green
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClasses = 'bg-amber-100 text-amber-900 border-amber-300';

  if (status === 'Pending') {
    colorClasses = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (status === 'Assigned') {
    colorClasses = 'bg-blue-100 text-blue-900 border-blue-300';
  } else if (status === 'In Progress') {
    colorClasses = 'bg-orange-100 text-orange-900 border-orange-300';
  } else if (status === 'Resolved') {
    colorClasses = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  }

  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md border whitespace-nowrap ${colorClasses}`}
    >
      {status}
    </span>
  );
};
