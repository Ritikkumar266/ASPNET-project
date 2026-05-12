import { STATUS_CONFIG } from '../utils/constants';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span className="badge" style={{ background: config.bg, color: config.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: config.color, display: 'inline-block' }} />
      {config.label}
    </span>
  );
}
