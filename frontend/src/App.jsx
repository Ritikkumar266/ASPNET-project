import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Citizen pages
import CitizenDashboard from './pages/citizen/Dashboard';
import NewComplaint from './pages/citizen/NewComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import CitizenComplaintDetail from './pages/citizen/ComplaintDetail';
import Profile from './pages/citizen/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AllComplaints from './pages/admin/AllComplaints';
import AdminComplaintDetail from './pages/admin/ComplaintDetail';
import Departments from './pages/admin/Departments';
import CreateManager from './pages/admin/CreateManager';
import UserFeedback from './pages/admin/UserFeedback';
import AllUsers from './pages/admin/AllUsers';

// Department pages
import DeptDashboard from './pages/department/Dashboard';
import AssignedComplaints from './pages/department/AssignedComplaints';
import DeptComplaintDetail from './pages/department/ComplaintDetail';
import DeptFeedback from './pages/department/DeptFeedback';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' }
        }} />
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Citizen Routes */}
          <Route element={<ProtectedRoute roles={['Citizen']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/citizen" element={<CitizenDashboard />} />
            <Route path="/citizen/new-complaint" element={<NewComplaint />} />
            <Route path="/citizen/my-complaints" element={<MyComplaints />} />
            <Route path="/citizen/complaint/:id" element={<CitizenComplaintDetail />} />
            <Route path="/citizen/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={['Admin']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<AllComplaints />} />
            <Route path="/admin/complaint/:id" element={<AdminComplaintDetail />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/create-manager" element={<CreateManager />} />
            <Route path="/admin/feedback" element={<UserFeedback />} />
            <Route path="/admin/users" element={<AllUsers />} />
          </Route>

          {/* Department Routes */}
          <Route element={<ProtectedRoute roles={['Department']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/department" element={<DeptDashboard />} />
            <Route path="/department/complaints" element={<AssignedComplaints />} />
            <Route path="/department/complaint/:id" element={<DeptComplaintDetail />} />
            <Route path="/department/feedback" element={<DeptFeedback />} />
          </Route>

          {/* Landing & Default */}
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
