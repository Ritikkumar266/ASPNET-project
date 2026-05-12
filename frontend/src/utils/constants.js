export const CATEGORIES = [
  'Water Supply', 'Electricity', 'Roads & Infrastructure',
  'Sanitation', 'Health', 'Education', 'Public Safety',
  'Transportation', 'Environment', 'Other'
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const STATUSES = ['Pending', 'Assigned', 'InProgress', 'Resolved', 'Rejected'];

export const STATUS_CONFIG = {
  Pending:    { color: 'var(--status-pending)',    bg: 'var(--status-pending-bg)',    label: 'Pending' },
  Assigned:   { color: 'var(--status-assigned)',   bg: 'var(--status-assigned-bg)',   label: 'Assigned' },
  InProgress: { color: 'var(--status-inprogress)', bg: 'var(--status-inprogress-bg)', label: 'In Progress' },
  Resolved:   { color: 'var(--status-resolved)',   bg: 'var(--status-resolved-bg)',   label: 'Resolved' },
  Rejected:   { color: 'var(--status-rejected)',   bg: 'var(--status-rejected-bg)',   label: 'Rejected' },
};

export const PRIORITY_CONFIG = {
  Low:      { color: 'var(--priority-low)',      label: 'Low' },
  Medium:   { color: 'var(--priority-medium)',   label: 'Medium' },
  High:     { color: 'var(--priority-high)',     label: 'High' },
  Critical: { color: 'var(--priority-critical)', label: 'Critical' },
};
