import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import ComplaintTimeline from '../../components/ComplaintTimeline';
import FeedbackForm from '../../components/FeedbackForm';
import toast from 'react-hot-toast';
import { HiStar } from 'react-icons/hi2';

export default function CitizenComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [cRes, fRes] = await Promise.all([
        api.get(`/complaints/${id}`),
        api.get(`/feedback/complaint/${id}`)
      ]);
      setComplaint(cRes.data);
      setFeedback(fRes.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleFeedback = async ({ rating, comment }) => {
    setSubmitting(true);
    try {
      await api.post('/feedback', { complaintId: id, rating, comment });
      toast.success('Feedback submitted!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading...</p></div>;
  if (!complaint) return <div className="glass-card empty-state"><p>Complaint not found</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{complaint.trackingId}</h1>
        <p className="page-subtitle">{complaint.title}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Complaint Details</h3>
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            <div><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</span><div><StatusBadge status={complaint.status} /></div></div>
            <div><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Priority</span><div><PriorityBadge priority={complaint.priority} /></div></div>
            <div><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</span><div style={{ fontSize: '0.9rem' }}>{complaint.category}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department</span><div style={{ fontSize: '0.9rem' }}>{complaint.departmentName || 'Not assigned'}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filed On</span><div style={{ fontSize: '0.9rem' }}>{new Date(complaint.createdAt).toLocaleString()}</div></div>
          </div>
        </div>
        <div className="glass-card">
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Description</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{complaint.description}</p>
          {complaint.address && (
            <>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>Location</h3>
              <p style={{ fontSize: '0.9rem' }}>{complaint.address}</p>
            </>
          )}
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Status Timeline</h3>
        <ComplaintTimeline history={complaint.statusHistory} />
      </div>

      {complaint.status === 'Resolved' && !complaint.hasFeedback && !feedback && (
        <FeedbackForm onSubmit={handleFeedback} loading={submitting} />
      )}

      {feedback && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Your Feedback</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
            {[1,2,3,4,5].map(s => <HiStar key={s} style={{ color: s <= feedback.rating ? '#fbbf24' : 'var(--text-muted)', fontSize: '1.25rem' }} />)}
          </div>
          {feedback.comment && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{feedback.comment}</p>}
        </div>
      )}
    </div>
  );
}
