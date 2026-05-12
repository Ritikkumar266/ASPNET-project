import { Link } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineClock, HiOutlineBuildingOffice2, HiOutlineChatBubbleLeftRight,
  HiOutlineChartBarSquare, HiOutlineUserGroup, HiOutlineArrowRight, HiOutlineCheckBadge, HiOutlineBolt } from 'react-icons/hi2';
import './Landing.css';

const features = [
  { icon: <HiOutlineShieldCheck />, title: 'Transparent Process', desc: 'Track every step of your complaint resolution in real-time with full transparency.' },
  { icon: <HiOutlineClock />, title: 'Quick Resolution', desc: 'Complaints are routed to the right department instantly for faster resolution.' },
  { icon: <HiOutlineBuildingOffice2 />, title: '10+ Departments', desc: 'Dedicated departments covering water, electricity, roads, health, education & more.' },
  { icon: <HiOutlineChatBubbleLeftRight />, title: 'Feedback System', desc: 'Rate and review the resolution quality to help improve public services.' },
  { icon: <HiOutlineChartBarSquare />, title: 'Live Analytics', desc: 'Real-time dashboards with stats, charts, and performance metrics.' },
  { icon: <HiOutlineUserGroup />, title: 'Role-Based Access', desc: 'Separate portals for citizens, department managers, and administrators.' },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Create your free citizen account in seconds' },
  { num: '02', title: 'File Complaint', desc: 'Describe your grievance with category and priority' },
  { num: '03', title: 'Track Progress', desc: 'Monitor real-time status updates and timeline' },
  { num: '04', title: 'Get Resolution', desc: 'Receive resolution and share your feedback' },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="landing-orb landing-orb--1" />
        <div className="landing-orb landing-orb--2" />
        <div className="landing-orb landing-orb--3" />
        <div className="landing-grid" />
      </div>

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#lgrd)" />
            <path d="M12 20l5 5 11-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="lgrd" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs>
          </svg>
          <span>GrievancePortal</span>
        </div>
        <div className="landing-nav__links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero__badge animate-fade-in-up">
          <HiOutlineBolt /> Streamlined Grievance Redressal
        </div>
        <h1 className="landing-hero__title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Your Voice Matters.<br />
          <span className="gradient-text">We Make It Heard.</span>
        </h1>
        <p className="landing-hero__subtitle animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          A transparent, efficient platform for citizens to lodge grievances and track resolutions 
          with public authorities — in real-time.
        </p>
        <div className="landing-hero__actions animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            File a Complaint <HiOutlineArrowRight />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In to Dashboard
          </Link>
        </div>
        <div className="landing-hero__stats animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="hero-stat">
            <span className="hero-stat__value">10+</span>
            <span className="hero-stat__label">Departments</span>
          </div>
          <div className="hero-stat__divider" />
          <div className="hero-stat">
            <span className="hero-stat__value">24/7</span>
            <span className="hero-stat__label">Available</span>
          </div>
          <div className="hero-stat__divider" />
          <div className="hero-stat">
            <span className="hero-stat__value">Real-time</span>
            <span className="hero-stat__label">Tracking</span>
          </div>
          <div className="hero-stat__divider" />
          <div className="hero-stat">
            <span className="hero-stat__value">100%</span>
            <span className="hero-stat__label">Transparent</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" id="features">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Everything You Need for <span className="gradient-text">Effective Grievance</span> Redressal</h2>
          <p className="section-desc">Our platform provides a complete ecosystem for filing, tracking, and resolving public grievances.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section" id="how-it-works">
        <div className="section-header">
          <span className="section-tag">Process</span>
          <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
          <p className="section-desc">Four simple steps to get your grievance resolved</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-card__num">{s.num}</div>
              <h3 className="step-card__title">{s.title}</h3>
              <p className="step-card__desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="step-card__arrow"><HiOutlineArrowRight /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="landing-section">
        <div className="section-header">
          <span className="section-tag">Portals</span>
          <h2 className="section-title">Three Dedicated <span className="gradient-text">Portals</span></h2>
        </div>
        <div className="roles-grid">
          <div className="role-card glass-card">
            <div className="role-card__icon" style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>🧑</div>
            <h3>Citizen Portal</h3>
            <ul>
              <li><HiOutlineCheckBadge /> File complaints easily</li>
              <li><HiOutlineCheckBadge /> Track status in real-time</li>
              <li><HiOutlineCheckBadge /> Provide feedback & ratings</li>
              <li><HiOutlineCheckBadge /> View complaint history</li>
            </ul>
            <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>Register as Citizen</Link>
          </div>
          <div className="role-card glass-card role-card--featured">
            <div className="role-card__badge">Admin</div>
            <div className="role-card__icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>👑</div>
            <h3>Admin Portal</h3>
            <ul>
              <li><HiOutlineCheckBadge /> System-wide dashboard</li>
              <li><HiOutlineCheckBadge /> Assign to departments</li>
              <li><HiOutlineCheckBadge /> Manage departments & users</li>
              <li><HiOutlineCheckBadge /> Analytics & reporting</li>
            </ul>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Admin Login</Link>
          </div>
          <div className="role-card glass-card">
            <div className="role-card__icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>🏢</div>
            <h3>Department Portal</h3>
            <ul>
              <li><HiOutlineCheckBadge /> View assigned complaints</li>
              <li><HiOutlineCheckBadge /> Update resolution status</li>
              <li><HiOutlineCheckBadge /> Add remarks & notes</li>
              <li><HiOutlineCheckBadge /> View department feedback</li>
            </ul>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Department Login</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-content">
          <h2>Ready to Make Your Voice Heard?</h2>
          <p>Join thousands of citizens who use GrievancePortal to resolve public issues effectively.</p>
          <div className="landing-hero__actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account <HiOutlineArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#fgrd)" />
            <path d="M12 20l5 5 11-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="fgrd" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs>
          </svg>
          <span>GrievancePortal</span>
        </div>
        <p>Citizen Grievance Redressal System • Built for transparent governance</p>
        <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>© 2026 All rights reserved</p>
      </footer>
    </div>
  );
}
