import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, UserCheck, Users, Stethoscope, ClipboardList, Clock, User } from 'lucide-react';
const Sidebar = () => {
  const { user } = useApp();
  if (!user) return null;
  return (
    <div className="sidebar-wrapper d-none d-md-block">
      <div className="py-4">
        {/* Render Sidebar Links based on User Role */}
        {user.role === 'admin' && (
          <nav className="d-flex flex-column">
            <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} className="me-3" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/applications" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} className="me-3" />
              <span>Applications</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} className="me-3" />
              <span>Manage Users</span>
            </NavLink>
            <NavLink to="/admin/doctors" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Stethoscope size={18} className="me-3" />
              <span>Manage Doctors</span>
            </NavLink>
            <NavLink to="/admin/appointments" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <ClipboardList size={18} className="me-3" />
              <span>Appointments</span>
            </NavLink>
          </nav>
        )}
        {user.role === 'doctor' && (
          <nav className="d-flex flex-column">
            <NavLink to="/doctor/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} className="me-3" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/doctor/profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <User size={18} className="me-3" />
              <span>Profile & Timings</span>
            </NavLink>
          </nav>
        )}
        {user.role === 'patient' && (
          <nav className="d-flex flex-column">
            <NavLink to="/user/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} className="me-3" />
              <span>My Dashboard</span>
            </NavLink>
            <NavLink to="/user/profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <User size={18} className="me-3" />
              <span>My Profile</span>
            </NavLink>
            <NavLink to="/doctors/apply" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Stethoscope size={18} className="me-3" />
              <span>Apply as Doctor</span>
            </NavLink>
          </nav>
        )}
      </div>
    </div>
  );
};
export default Sidebar;