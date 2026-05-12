import { PRIORITY_CONFIG } from '../utils/constants';

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  return (
    <span className="badge" style={{ background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}30` }}>
      {config.label}
    </span>
  );
}
