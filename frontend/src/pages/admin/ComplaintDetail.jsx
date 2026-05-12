import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import ComplaintTimeline from '../../components/ComplaintTimeline';
import toast from 'react-hot-toast';
import { STATUSES } from '../../utils/constants';

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('');
  const [statusForm, setStatusForm] = useState({ status: '', remarks: '' });
  const [assigning, setAssigning] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      const [cRes, dRes] = await Promise.all([api.get(`/complaints/${id}`), api.get('/departments')]);
      setComplaint(cRes.data);
      setDepartments(dRes.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAssign = async () => {
    if (!selectedDept) return;
    setAssigning(true);
    try {
      await api.put(`/complaints/${id}/assign`, { departmentId: selectedDept });
      toast.success('Complaint assigned!');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setAssigning(false); }
  };

  const handleStatusUpdate = async () => {
    if (!statusForm.status) return;
    setUpdating(true);
    try {
      await api.put(`/complaints/${id}/status`, statusForm);
      toast.success('Status updated!');
      setStatusForm({ status: '', remarks: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!complaint) return <div className="glass-card empty-state"><p>Complaint not found</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{complaint.trackingId}</h1>
        <p className="page-subtitle">{complaint.title}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div>
          <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span><div><StatusBadge status={complaint.status} /></div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority</span><div><PriorityBadge priority={complaint.priority} /></div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</span><div style={{ fontSize: '0.9rem' }}>{complaint.category}</div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Citizen</span><div style={{ fontSize: '0.9rem' }}>{complaint.citizenName}</div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department</span><div style={{ fontSize: '0.9rem' }}>{complaint.departmentName || 'Not assigned'}</div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date</span><div style={{ fontSize: '0.9rem' }}>{new Date(complaint.createdAt).toLocaleString()}</div></div>
            </div>
            {complaint.address && <><h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>Address</h4><p style={{ fontSize: '0.9rem' }}>{complaint.address}</p></>}
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>Description</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{complaint.description}</p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Status Timeline</h3>
            <ComplaintTimeline history={complaint.statusHistory} />
          </div>
        </div>

        <div>
          <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Assign Department</h3>
            <div className="form-group">
              <select className="form-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAssign} disabled={!selectedDept || assigning}>
              {assigning ? 'Assigning...' : 'Assign'}
            </button>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Update Status</h3>
            <div className="form-group">
              <select className="form-select" value={statusForm.status} onChange={(e) => setStatusForm({...statusForm, status: e.target.value})}>
                <option value="">Select Status</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <textarea className="form-textarea" placeholder="Add remarks..." rows={3}
                value={statusForm.remarks} onChange={(e) => setStatusForm({...statusForm, remarks: e.target.value})} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStatusUpdate} disabled={!statusForm.status || updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
