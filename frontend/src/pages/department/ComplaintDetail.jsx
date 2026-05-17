import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import ComplaintTimeline from '../../components/ComplaintTimeline';
import ImageGallery from '../../components/ImageGallery';
import toast from 'react-hot-toast';

const DEPT_STATUSES = ['InProgress', 'Resolved', 'Rejected'];

export default function DeptComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusForm, setStatusForm] = useState({ status: '', remarks: '' });
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try { const res = await api.get(`/complaints/${id}`); setComplaint(res.data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

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
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Complaint Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span><div><StatusBadge status={complaint.status} /></div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority</span><div><PriorityBadge priority={complaint.priority} /></div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</span><div style={{ fontSize: '0.9rem' }}>{complaint.category}</div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Citizen</span><div style={{ fontSize: '0.9rem' }}>{complaint.citizenName}</div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date Filed</span><div style={{ fontSize: '0.9rem' }}>{new Date(complaint.createdAt).toLocaleString()}</div></div>
            </div>
            {complaint.address && <><h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>Address</h4><p style={{ fontSize: '0.9rem' }}>{complaint.address}</p></>}
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>Description</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{complaint.description}</p>
          </div>
          <ImageGallery images={complaint.imageUrls} />
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Status Timeline</h3>
            <ComplaintTimeline history={complaint.statusHistory} />
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Update Status</h3>
          <div className="form-group">
            <select className="form-select" value={statusForm.status} onChange={(e) => setStatusForm({...statusForm, status: e.target.value})}>
              <option value="">Select Status</option>
              {DEPT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <textarea className="form-textarea" placeholder="Add remarks about the update..." rows={4}
              value={statusForm.remarks} onChange={(e) => setStatusForm({...statusForm, remarks: e.target.value})} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStatusUpdate} disabled={!statusForm.status || updating}>
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}
