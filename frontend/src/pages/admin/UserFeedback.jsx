import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiStar } from 'react-icons/hi2';

export default function UserFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/feedback/all').then(res => setFeedbacks(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  const avg = feedbacks.length > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : '—';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Feedback</h1>
        <p className="page-subtitle">All citizen feedback on resolved complaints • Average: ⭐ {avg}</p>
      </div>
      {feedbacks.length > 0 ? (
        <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          {feedbacks.map(f => (
            <div key={f.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{f.citizenName}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 'var(--space-sm)' }}>
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => <HiStar key={s} style={{ color: s <= f.rating ? '#fbbf24' : 'var(--text-muted)', fontSize: '1rem' }} />)}
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Re: <span style={{ color: 'var(--accent-primary)' }}>{f.complaintTitle}</span>
              </p>
              {f.comment && <p style={{ fontSize: '0.9rem' }}>{f.comment}</p>}
            </div>
          ))}
        </div>
      ) : <div className="glass-card empty-state"><p>No feedback yet</p></div>}
    </div>
  );
}
