import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetch = async () => {
    try { const res = await api.get('/departments'); setDepartments(res.data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDept) {
        await api.put(`/departments/${editDept.id}`, form);
        toast.success('Department updated!');
      } else {
        await api.post('/departments', form);
        toast.success('Department created!');
      }
      setShowModal(false); setEditDept(null); setForm({ name: '', description: '' });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this department?')) return;
    try { await api.delete(`/departments/${id}`); toast.success('Deleted!'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const openEdit = (dept) => {
    setEditDept(dept); setForm({ name: dept.name, description: dept.description }); setShowModal(true);
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1 className="page-title">Departments</h1><p className="page-subtitle">Manage departments for complaint routing</p></div>
        <button className="btn btn-primary" onClick={() => { setEditDept(null); setForm({ name: '', description: '' }); setShowModal(true); }}>
          <HiOutlinePlus /> Add Department
        </button>
      </div>

      {departments.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
          {departments.map(d => (
            <div key={d.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{d.name}</h3>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button className="btn btn-secondary btn-icon" onClick={() => openEdit(d)}><HiOutlinePencil /></button>
                  <button className="btn btn-danger btn-icon" onClick={() => handleDelete(d.id)}><HiOutlineTrash /></button>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>{d.description || 'No description'}</p>
              <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>👥 {d.managerCount} manager(s)</span>
                <span>📋 {d.complaintCount} complaint(s)</span>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="glass-card empty-state"><p>No departments yet</p></div>}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editDept ? 'Edit Department' : 'Create Department'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editDept ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
