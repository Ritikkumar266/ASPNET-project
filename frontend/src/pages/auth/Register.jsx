import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.phone);
      toast.success('Account created successfully!');
      navigate('/citizen');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">Full Name</label>
          <input id="reg-name" name="fullName" className="form-input" placeholder="John Doe"
            value={form.fullName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">Email Address</label>
          <input id="reg-email" name="email" type="email" className="form-input" placeholder="you@example.com"
            value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-phone">Phone Number</label>
          <input id="reg-phone" name="phone" type="tel" className="form-input" placeholder="+91 XXXXX XXXXX"
            value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-pass">Password</label>
          <input id="reg-pass" name="password" type="password" className="form-input" placeholder="Min 6 characters"
            value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
          <input id="reg-confirm" name="confirmPassword" type="password" className="form-input" placeholder="Re-enter password"
            value={form.confirmPassword} onChange={handleChange} required minLength={6} />
        </div>
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </>
  );
}
