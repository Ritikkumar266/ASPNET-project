import { Outlet, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-bg-shapes">
        <div className="auth-shape auth-shape--1" />
        <div className="auth-shape auth-shape--2" />
        <div className="auth-shape auth-shape--3" />
      </div>
      <div className="auth-container animate-fade-in-up">
        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="url(#grad)" />
              <path d="M12 20l5 5 11-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <defs><linearGradient id="grad" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs>
            </svg>
          </div>
          <h1 className="auth-brand__name">GrievancePortal</h1>
          <p className="auth-brand__tagline">Citizen Grievance Redressal System</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
