import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { HiOutlinePhoto, HiXMark, HiArrowUpTray } from 'react-icons/hi2';

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;

export default function NewComplaint() {
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium', address: '', departmentId: '' });
  const [departments, setDepartments] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deptLoading, setDeptLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/departments')
      .then(res => setDepartments(res.data))
      .catch(() => {})
      .finally(() => setDeptLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateAndAddFiles = (files) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const validFiles = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported image format`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds ${MAX_SIZE_MB}MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) validateAndAddFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) validateAndAddFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.departmentId) {
      toast.error('Please select a department');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('priority', form.priority);
      formData.append('address', form.address);
      formData.append('departmentId', form.departmentId);
      images.forEach((img) => formData.append('images', img));

      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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

          {/* Image Upload Section */}
          <div className="form-group">
            <label className="form-label">
              <HiOutlinePhoto style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Upload Images <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(optional, max {MAX_IMAGES} images, {MAX_SIZE_MB}MB each)</span>
            </label>

            <div
              className={`image-dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xl)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
              }}
            >
              <HiArrowUpTray style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: 8 }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                {dragActive ? 'Drop images here...' : 'Drag & drop images or click to browse'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Supports JPEG, PNG, GIF, WebP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 'var(--space-md)',
                marginTop: 'var(--space-md)'
              }}>
                {images.map((img, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    aspectRatio: '1',
                    border: '1px solid var(--border-color)'
                  }}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        background: 'rgba(239, 68, 68, 0.9)', color: '#fff',
                        border: 'none', borderRadius: '50%',
                        width: 24, height: 24, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', padding: 0
                      }}
                    >
                      <HiXMark />
                    </button>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      fontSize: '0.65rem', padding: '2px 6px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
