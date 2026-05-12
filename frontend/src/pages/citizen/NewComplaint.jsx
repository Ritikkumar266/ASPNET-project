import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

export default function NewComplaint() {
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium', address: '', departmentId: '' });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deptLoading, setDeptLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/departments')
      .then(res => setDepartments(res.data))
      .catch(() => {})
      .finally(() => setDeptLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.departmentId) {
      toast.error('Please select a department');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/complaints', form);
      toast.success(`Complaint filed! Tracking ID: ${res.data.trackingId}`);
      navigate('/citizen/my-complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to file complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">File New Complaint</h1>
        <p className="page-subtitle">Describe your grievance in detail for quick resolution</p>
      </div>

      <div className="glass-card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="complaint-title">Title</label>
            <input id="complaint-title" name="title" className="form-input" placeholder="Brief title of your complaint"
              value={form.title} onChange={handleChange} required minLength={5} maxLength={200} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="complaint-desc">Description</label>
            <textarea id="complaint-desc" name="description" className="form-textarea"
              placeholder="Provide detailed information about your grievance..."
              value={form.description} onChange={handleChange} required minLength={10} maxLength={2000} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="complaint-department">Department <span style={{ color: 'var(--accent-primary)' }}>*</span></label>
              <select id="complaint-department" name="departmentId" className="form-select"
                value={form.departmentId} onChange={handleChange} required>
                <option value="">Select Department</option>
                {deptLoading ? (
                  <option disabled>Loading departments...</option>
                ) : (
                  departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                )}
              </select>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                Your complaint will be sent directly to this department's manager
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="complaint-category">Category</label>
              <select id="complaint-category" name="category" className="form-select"
                value={form.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="complaint-priority">Priority</label>
              <select id="complaint-priority" name="priority" className="form-select"
                value={form.priority} onChange={handleChange}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="complaint-address">Address / Location</label>
              <input id="complaint-address" name="address" className="form-input"
                placeholder="Street, locality, city..." value={form.address} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
