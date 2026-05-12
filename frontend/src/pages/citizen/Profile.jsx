import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm(f => ({ ...f, fullName: user.fullName || '', phone: user.phone || '' }));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { fullName: form.fullName, phone: form.phone };
      if (form.currentPassword && form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const res = await api.put('/auth/profile', payload);
      updateUser({ fullName: res.data.fullName, phone: res.data.phone });
      toast.success('Profile updated!');
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>
      <div className="glass-card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input id="profile-name" name="fullName" className="form-input" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-phone">Phone</label>
            <input id="profile-phone" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-glass)', margin: 'var(--space-xl) 0' }} />
          <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>Change Password</h3>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-curpass">Current Password</label>
            <input id="profile-curpass" name="currentPassword" type="password" className="form-input" value={form.currentPassword} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-newpass">New Password</label>
            <input id="profile-newpass" name="newPassword" type="password" className="form-input" value={form.newPassword} onChange={handleChange} minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}
