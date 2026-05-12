import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineWrenchScrewdriver, HiOutlineCheckCircle, HiOutlineStar } from 'react-icons/hi2';

export default function DeptDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/department').then(res => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading dashboard...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Department Dashboard</h1>
        <p className="page-subtitle">Manage and resolve assigned complaints</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon={<HiOutlineDocumentText />} label="Total Assigned" value={stats?.totalAssigned || 0} color="var(--accent-primary)" delay={0} />
        <StatsCard icon={<HiOutlineClock />} label="Pending" value={stats?.pendingComplaints || 0} color="var(--status-pending)" delay={100} />
        <StatsCard icon={<HiOutlineWrenchScrewdriver />} label="In Progress" value={stats?.inProgressComplaints || 0} color="var(--status-inprogress)" delay={200} />
        <StatsCard icon={<HiOutlineCheckCircle />} label="Resolved" value={stats?.resolvedComplaints || 0} color="var(--status-resolved)" delay={300} />
        <StatsCard icon={<HiOutlineStar />} label="Avg Rating" value={stats?.averageRating || '—'} color="#fbbf24" delay={400} />
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Complaints</h3>
          <Link to="/department/complaints" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {stats?.recentComplaints?.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Tracking ID</th><th>Title</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {stats.recentComplaints.map(c => (
                  <tr key={c.id}>
                    <td><Link to={`/department/complaint/${c.id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{c.trackingId}</Link></td>
                    <td>{c.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.category}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty-state"><p>No complaints assigned yet</p></div>}
      </div>
    </div>
  );
}
