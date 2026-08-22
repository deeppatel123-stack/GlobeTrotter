import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Calendar,
  MapPin,
  Sparkles,
  Heart,
  PlusCircle,
  User,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot,
  SlidersHorizontal,
  Activity,
  Globe,
} from 'lucide-react';

const AppSidebar = ({ collapsed, onToggleCollapse }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header / Brand */}
      <div className="sidebar-brand-box">
        <Link to="/" className="sidebar-logo-link" title="Go to GlobeTrotter Main Home / Landing Page">
          <div className="brand-icon-wrapper">
            <Compass size={22} className="brand-icon" />
          </div>
          {!collapsed && (
            <div className="brand-text-col">
              <span className="brand-name">GlobeTrotter</span>
              <span className="brand-role-tag">
                {isAdmin ? '🛡️ Admin Center' : '✈️ Traveler Studio'}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Group */}
      <div className="sidebar-nav-scroll">
        {isAdmin ? (
          /* =================================================================== */
          /* ADMIN NAVIGATION LINKS */
          /* =================================================================== */
          <div className="nav-group">
            <div className="nav-group-title">{!collapsed && 'ADMINISTRATION'}</div>
            <Link
              to="/admin"
              className={`sidebar-nav-item ${isActive('/admin') ? 'active' : ''}`}
            >
              <Shield size={18} className="item-icon" />
              {!collapsed && <span>Admin Dashboard</span>}
            </Link>
            <Link
              to="/admin/users"
              className={`sidebar-nav-item ${isActive('/admin/users') ? 'active' : ''}`}
            >
              <User size={18} className="item-icon" />
              {!collapsed && <span>User Management</span>}
            </Link>
            <Link
              to="/admin/analytics"
              className={`sidebar-nav-item ${isActive('/admin/analytics') ? 'active' : ''}`}
            >
              <Sparkles size={18} className="item-icon" />
              {!collapsed && <span>Platform Analytics</span>}
            </Link>

            <div className="nav-divider"></div>
            <div className="nav-group-title">{!collapsed && 'TRAVELER VIEW'}</div>
            <Link
              to="/dashboard"
              className={`sidebar-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <Compass size={18} className="item-icon" />
              {!collapsed && <span>Traveler Workspace</span>}
            </Link>
          </div>
        ) : (
          /* =================================================================== */
          /* TRAVELER NAVIGATION LINKS */
          /* =================================================================== */
          <div className="nav-group">
            <div className="nav-group-title">{!collapsed && 'MAIN WORKSPACE'}</div>
            <Link
              to="/dashboard"
              className={`sidebar-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <Compass size={18} className="item-icon" />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            {/* Dedicated AI Copilot Link */}
            <Link
              to="/copilot"
              className={`sidebar-nav-item copilot-sidebar-item ${isActive('/copilot') ? 'active' : ''}`}
            >
              <Bot size={18} className="item-icon copilot-icon" />
              {!collapsed && (
                <div className="copilot-label-col">
                  <span>AI Travel Copilot</span>
                  <span className="badge-ai-sparkle">PRO</span>
                </div>
              )}
            </Link>

            <Link
              to="/trips"
              className={`sidebar-nav-item ${isActive('/trips') && !location.pathname.includes('/create') ? 'active' : ''}`}
            >
              <Calendar size={18} className="item-icon" />
              {!collapsed && <span>My Trips</span>}
            </Link>

            <Link
              to="/trips/create"
              className={`sidebar-nav-item ${isActive('/trips/create') ? 'active' : ''}`}
            >
              <PlusCircle size={18} className="item-icon text-orange" />
              {!collapsed && <span className="text-orange-font">Plan New Trip</span>}
            </Link>

            <div className="nav-divider"></div>
            <div className="nav-group-title">{!collapsed && 'DISCOVERY & SAVED'}</div>

            <Link
              to="/explore/cities"
              className={`sidebar-nav-item ${isActive('/explore/cities') ? 'active' : ''}`}
            >
              <MapPin size={18} className="item-icon" />
              {!collapsed && <span>Explore Cities</span>}
            </Link>

            <Link
              to="/explore/activities"
              className={`sidebar-nav-item ${isActive('/explore/activities') ? 'active' : ''}`}
            >
              <Sparkles size={18} className="item-icon" />
              {!collapsed && <span>Activities</span>}
            </Link>

            <Link
              to="/saved"
              className={`sidebar-nav-item ${isActive('/saved') ? 'active' : ''}`}
            >
              <Heart size={18} className="item-icon text-rose" />
              {!collapsed && <span>Saved Places</span>}
            </Link>

            <div className="nav-divider"></div>
            <div className="nav-group-title">{!collapsed && 'ACCOUNT'}</div>

            <Link
              to="/profile"
              className={`sidebar-nav-item ${isActive('/profile') ? 'active' : ''}`}
            >
              <User size={18} className="item-icon" />
              {!collapsed && <span>Profile & Settings</span>}
            </Link>
          </div>
        )}
      </div>

      {/* Sidebar Footer User Info */}
      <div className="sidebar-footer-box">
        <div className="user-profile-summary">
          <img
            src={
              user?.profilePhoto ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
            }
            alt={user?.name || 'User'}
            className="user-avatar-small"
          />
          {!collapsed && (
            <div className="user-info-text">
              <span className="user-name">{user?.name}</span>
              <span className="user-role-badge">
                {isAdmin ? '🛡️ Administrator' : '👤 Traveler'}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={logout}
          className="sidebar-logout-btn"
          title="Log Out"
        >
          <LogOut size={16} />
        </button>
      </div>

      <style>{`
        .app-sidebar {
          width: 240px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 90;
          transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.02);
        }
        .app-sidebar.collapsed {
          width: 72px;
        }
        .sidebar-brand-box {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .sidebar-logo-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          overflow: hidden;
        }
        .brand-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: var(--primary-gradient);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .brand-text-col {
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          color: #0f172a;
          line-height: 1.1;
        }
        .brand-role-tag {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
        }
        .collapse-toggle-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }
        .collapse-toggle-btn:hover {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }
        .sidebar-nav-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0.65rem;
        }
        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .nav-group-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.6px;
          padding: 0.4rem 0.6rem;
          margin-top: 0.4rem;
        }
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .sidebar-nav-item:hover {
          background: #f0f9ff;
          color: var(--primary);
        }
        .sidebar-nav-item.active {
          background: #e0f2fe;
          color: var(--primary);
          font-weight: 700;
        }
        .copilot-sidebar-item {
          background: #f3e8ff !important;
          color: #7c3aed !important;
          border: 1px solid #e9d5ff;
        }
        .copilot-sidebar-item.active {
          background: #7c3aed !important;
          color: #ffffff !important;
        }
        .copilot-sidebar-item.active .copilot-icon {
          color: #ffffff !important;
        }
        .copilot-sidebar-item.active .badge-ai-sparkle {
          background: rgba(255,255,255,0.25);
          color: #ffffff;
        }
        .copilot-icon {
          color: #7c3aed;
        }
        .copilot-label-col {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
        }
        .badge-ai-sparkle {
          font-size: 0.65rem;
          font-weight: 800;
          background: #7c3aed;
          color: #ffffff;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
        }
        .text-orange { color: #f97316; }
        .text-orange-font { color: #ea580c; font-weight: 700; }
        .text-rose { color: #f43f5e; }
        .nav-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 0.6rem 0;
        }
        .sidebar-footer-box {
          padding: 0.75rem 0.85rem;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
        }
        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          overflow: hidden;
        }
        .user-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-info-text {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }
        .user-role-badge {
          font-size: 0.68rem;
          color: #64748b;
        }
        .sidebar-logout-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .sidebar-logout-btn:hover {
          color: #dc2626;
          background: #fef2f2;
        }
      `}</style>
    </aside>
  );
};

export default AppSidebar;
