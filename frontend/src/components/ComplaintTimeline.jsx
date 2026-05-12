import { STATUS_CONFIG } from '../utils/constants';
import './ComplaintTimeline.css';

export default function ComplaintTimeline({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="timeline">
      {history.map((entry, index) => {
        const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG.Pending;
        return (
          <div key={index} className="timeline-item">
            <div className="timeline-dot" style={{ background: config.color, boxShadow: `0 0 10px ${config.color}50` }} />
            <div className="timeline-content glass-card">
              <div className="timeline-header">
                <span className="badge" style={{ background: config.bg, color: config.color }}>
                  {config.label}
                </span>
                <span className="timeline-date">
                  {new Date(entry.changedAt).toLocaleString()}
                </span>
              </div>
              {entry.remarks && <p className="timeline-remarks">{entry.remarks}</p>}
              <p className="timeline-actor">by {entry.changedByName || 'System'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
