import './StatsCard.css';

export default function StatsCard({ icon, label, value, color, delay = 0 }) {
  return (
    <div className="stats-card animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="stats-card__icon" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="stats-card__info">
        <span className="stats-card__value">{value}</span>
        <span className="stats-card__label">{label}</span>
      </div>
    </div>
  );
}
