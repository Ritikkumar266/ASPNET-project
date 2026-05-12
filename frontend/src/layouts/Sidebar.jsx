import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineHome, HiOutlinePlusCircle, HiOutlineClipboardDocumentList, HiOutlineUserCircle,
  HiOutlineBuildingOffice2, HiOutlineUserPlus, HiOutlineChatBubbleLeftRight,
  HiOutlineArrowRightOnRectangle, HiOutlineUsers } from 'react-icons/hi2';
import './Sidebar.css';

const navItems = {
  Citizen: [
    { path: '/citizen', icon: <HiOutlineHome />, label: 'Dashboard', end: true },
    { path: '/citizen/new-complaint', icon: <HiOutlinePlusCircle />, label: 'New Complaint' },
    { path: '/citizen/my-complaints', icon: <HiOutlineClipboardDocumentList />, label: 'My Complaints' },
    { path: '/citizen/profile', icon: <HiOutlineUserCircle />, label: 'Profile' },
  ],
  Admin: [
    { path: '/admin', icon: <HiOutlineHome />, label: 'Dashboard', end: true },
    { path: '/admin/complaints', icon: <HiOutlineClipboardDocumentList />, label: 'All Complaints' },
    { path: '/admin/departments', icon: <HiOutlineBuildingOffice2 />, label: 'Departments' },
    { path: '/admin/create-manager', icon: <HiOutlineUserPlus />, label: 'Create Manager' },
    { path: '/admin/users', icon: <HiOutlineUsers />, label: 'All Users' },
    { path: '/admin/feedback', icon: <HiOutlineChatBubbleLeftRight />, label: 'Feedback' },
  ],
  Department: [
    { path: '/department', icon: <HiOutlineHome />, label: 'Dashboard', end: true },
    { path: '/department/complaints', icon: <HiOutlineClipboardDocumentList />, label: 'Assigned Complaints' },
    { path: '/department/feedback', icon: <HiOutlineChatBubbleLeftRight />, label: 'Feedback' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="url(#sgrad)" />
          <path d="M12 20l5 5 11-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <defs><linearGradient id="sgrad" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs>
        </svg>
        <span className="sidebar__brand-name">GrievancePortal</span>
      </div>

      <div className="sidebar__user">
        <div className="sidebar__avatar">
          {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="sidebar__user-info">
          <span className="sidebar__user-name">{user?.fullName}</span>
          <span className="sidebar__user-role">{user?.role === 'Department' ? 'Dept. Manager' : user?.role}</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.end}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
            <span className="sidebar__link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout}>
        <HiOutlineArrowRightOnRectangle />
        <span>Logout</span>
      </button>
    </aside>
  );
}
