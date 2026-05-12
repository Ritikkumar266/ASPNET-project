import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { STATUSES, PRIORITIES } from '../../utils/constants';

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      const res = await api.get('/complaints/all', { params });
      setComplaints(res.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, [filters]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All Complaints</h1>
        <p className="page-subtitle">Manage and assign citizen complaints</p>
      </div>

      <div className="filter-bar">
        <select className="form-select" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select" value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})}>
          <option value="">All Priority</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{complaints.length} complaint(s)</span>
      </div>

      {loading ? <div className="loading-container"><div className="spinner" /></div> : complaints.length > 0 ? (
        <div className="table-container glass-card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead><tr><th>Tracking ID</th><th>Title</th><th>Citizen</th><th>Category</th><th>Status</th><th>Priority</th><th>Department</th><th>Date</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id}>
                  <td><Link to={`/admin/complaint/${c.id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>{c.trackingId}</Link></td>
                  <td>{c.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.citizenName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.category}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td><PriorityBadge priority={c.priority} /></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.departmentName || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="glass-card empty-state"><p>No complaints found</p></div>}
    </div>
  );
}
