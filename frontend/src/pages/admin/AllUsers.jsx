import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All Users</h1>
        <p className="page-subtitle">{users.length} registered user(s)</p>
      </div>
      <div className="table-container glass-card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Phone</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500 }}>{u.fullName}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td><span className="badge" style={{
                  background: u.role === 'Admin' ? 'rgba(239,68,68,0.12)' : u.role === 'Department' ? 'rgba(139,92,246,0.12)' : 'rgba(6,182,212,0.12)',
                  color: u.role === 'Admin' ? '#ef4444' : u.role === 'Department' ? '#8b5cf6' : '#06b6d4'
                }}>{u.role}</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.departmentName || '—'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{u.phone || '—'}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
