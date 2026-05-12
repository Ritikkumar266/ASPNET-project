import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineWrenchScrewdriver, HiOutlineCheckCircle,
  HiOutlineUsers, HiOutlineBuildingOffice2, HiOutlineStar, HiOutlineXCircle } from 'react-icons/hi2';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin').then(res => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading dashboard...</p></div>;

  const statusData = [
    { name: 'Pending', value: stats?.pendingComplaints || 0 },
    { name: 'Assigned', value: stats?.assignedComplaints || 0 },
    { name: 'In Progress', value: stats?.inProgressComplaints || 0 },
    { name: 'Resolved', value: stats?.resolvedComplaints || 0 },
    { name: 'Rejected', value: stats?.rejectedComplaints || 0 },
  ].filter(d => d.value > 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">System-wide overview and analytics</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon={<HiOutlineDocumentText />} label="Total Complaints" value={stats?.totalComplaints || 0} color="var(--accent-primary)" delay={0} />
        <StatsCard icon={<HiOutlineClock />} label="Pending" value={stats?.pendingComplaints || 0} color="var(--status-pending)" delay={100} />
        <StatsCard icon={<HiOutlineWrenchScrewdriver />} label="In Progress" value={stats?.inProgressComplaints || 0} color="var(--status-inprogress)" delay={200} />
        <StatsCard icon={<HiOutlineCheckCircle />} label="Resolved" value={stats?.resolvedComplaints || 0} color="var(--status-resolved)" delay={300} />
        <StatsCard icon={<HiOutlineXCircle />} label="Rejected" value={stats?.rejectedComplaints || 0} color="var(--status-rejected)" delay={400} />
        <StatsCard icon={<HiOutlineUsers />} label="Total Users" value={stats?.totalUsers || 0} color="#ec4899" delay={500} />
        <StatsCard icon={<HiOutlineBuildingOffice2 />} label="Departments" value={stats?.totalDepartments || 0} color="#6366f1" delay={600} />
        <StatsCard icon={<HiOutlineStar />} label="Avg Rating" value={stats?.averageRating || '—'} color="#fbbf24" delay={700} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No data yet</p></div>}
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Department Performance</h3>
          {stats?.departmentStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.departmentStats}>
                <XAxis dataKey="departmentName" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                <Legend />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No department data yet</p></div>}
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Complaints</h3>
          <Link to="/admin/complaints" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {stats?.recentComplaints?.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Tracking ID</th><th>Title</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {stats.recentComplaints.map(c => (
                  <tr key={c.id}>
                    <td><Link to={`/admin/complaint/${c.id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{c.trackingId}</Link></td>
                    <td>{c.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.category}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty-state"><p>No complaints yet</p></div>}
      </div>
    </div>
  );
}
