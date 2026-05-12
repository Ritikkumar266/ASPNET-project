import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineWrenchScrewdriver, HiOutlineCheckCircle } from 'react-icons/hi2';

export default function CitizenDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/citizen').then(res => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading dashboard...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Dashboard</h1>
        <p className="page-subtitle">Track your complaints and their resolution status</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon={<HiOutlineDocumentText />} label="Total Complaints" value={stats?.totalComplaints || 0} color="var(--accent-primary)" delay={0} />
        <StatsCard icon={<HiOutlineClock />} label="Pending" value={stats?.pendingComplaints || 0} color="var(--status-pending)" delay={100} />
        <StatsCard icon={<HiOutlineWrenchScrewdriver />} label="In Progress" value={stats?.inProgressComplaints || 0} color="var(--status-inprogress)" delay={200} />
        <StatsCard icon={<HiOutlineCheckCircle />} label="Resolved" value={stats?.resolvedComplaints || 0} color="var(--status-resolved)" delay={300} />
      </div>

      <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Complaints</h2>
          <Link to="/citizen/my-complaints" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {stats?.recentComplaints?.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Tracking ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Date</th></tr></thead>
              <tbody>
                {stats.recentComplaints.map(c => (
                  <tr key={c.id}>
                    <td><Link to={`/citizen/complaint/${c.id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{c.trackingId}</Link></td>
                    <td>{c.title}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">No complaints yet</p>
            <Link to="/citizen/new-complaint" className="btn btn-primary">File Your First Complaint</Link>
          </div>
        )}
      </div>
    </div>
  );
}
