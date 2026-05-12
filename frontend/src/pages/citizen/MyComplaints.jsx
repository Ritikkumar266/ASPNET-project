import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { STATUSES } from '../../utils/constants';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/complaints/my').then(res => setComplaints(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter ? complaints.filter(c => c.status === filter) : complaints;

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Complaints</h1>
        <p className="page-subtitle">View and track all your filed complaints</p>
      </div>

      <div className="filter-bar">
        <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{filtered.length} complaint(s)</span>
      </div>

      {filtered.length > 0 ? (
        <div className="table-container glass-card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead><tr><th>Tracking ID</th><th>Title</th><th>Category</th><th>Status</th><th>Priority</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><Link to={`/citizen/complaint/${c.id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>{c.trackingId}</Link></td>
                  <td>{c.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.category}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td><PriorityBadge priority={c.priority} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">No complaints found</p>
          <Link to="/citizen/new-complaint" className="btn btn-primary">File a Complaint</Link>
        </div>
      )}
    </div>
  );
}
