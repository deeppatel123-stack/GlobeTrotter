import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  X,
  PlusCircle,
  MapPin,
  Calendar,
  Heart,
  User,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-drawer-overlay animate-fade" onClick={onClose}>
      <div
        className="mobile-drawer-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="brand-icon-wrapper">
              <Compass size={22} color="#ffffff" />
            </div>
            <span className="drawer-brand-title">GlobeTrotter</span>
          </div>
          <button type="button" onClick={onClose} className="drawer-close-btn">
            <X size={22} />
          </button>
        </div>

        {/* User Card if Authenticated */}
        {isAuthenticated && user && (
          <div className="drawer-user-card">
            <img
              src={
                user.profilePhoto ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
              }
              alt={user.name}
              className="drawer-user-avatar"
            />
            <div className="drawer-user-details">
              <h4 className="drawer-user-name">{user.name}</h4>
              <p className="drawer-user-email">{user.email}</p>
              <span className="badge badge-primary">{user.role}</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="drawer-links">
          {isAuthenticated ? (
            <>
              <Link
                to="/trips/create"
                onClick={handleLinkClick}
                className="drawer-link drawer-cta-link"
              >
                <PlusCircle size={18} />
                <span>Plan New Trip</span>
              </Link>
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className={`drawer-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <Compass size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/trips"
                onClick={handleLinkClick}
                className={`drawer-link ${isActive('/trips') ? 'active' : ''}`}
              >
                <Calendar size={18} />
                <span>My Trips</span>
              </Link>
              <Link
                to="/explore/cities"
                onClick={handleLinkClick}
                className={`drawer-link ${isActive('/explore/cities') ? 'active' : ''}`}
              >
                <MapPin size={18} />
                <span>Explore Cities</span>
              </Link>
              <Link
                to="/explore/activities"
                onClick={handleLinkClick}
                className={`drawer-link ${isActive('/explore/activities') ? 'active' : ''}`}
              >
                <Compass size={18} />
                <span>Activities</span>
              </Link>
              <Link
                to="/saved"
                onClick={handleLinkClick}
                className={`drawer-link ${isActive('/saved') ? 'active' : ''}`}
              >
                <Heart size={18} />
                <span>Saved Destinations</span>
              </Link>
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className={`drawer-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <User size={18} />
                <span>Profile & Settings</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={handleLinkClick}
                  className={`drawer-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  <Shield size={18} />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/explore/cities"
                onClick={handleLinkClick}
                className="drawer-link"
              >
                <MapPin size={18} />
                <span>Explore Cities</span>
              </Link>
              <Link
                to="/explore/activities"
                onClick={handleLinkClick}
                className="drawer-link"
              >
                <Compass size={18} />
                <span>Activities</span>
              </Link>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="drawer-link"
              >
                <LogIn size={18} />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                onClick={handleLinkClick}
                className="drawer-link drawer-cta-link"
              >
                <UserPlus size={18} />
                <span>Create Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {isAuthenticated && (
          <div className="drawer-footer">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="drawer-logout-btn"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          justify-content: flex-end;
        }
        .mobile-drawer-panel {
          width: 85%;
          max-width: 340px;
          height: 100%;
          background: #ffffff;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          overflow-y: auto;
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .drawer-brand-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.2rem;
        }
        .drawer-close-btn {
          color: var(--text-muted);
          padding: 0.3rem;
        }
        .drawer-user-card {
          margin: 1rem 0;
          padding: 0.85rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .drawer-user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }
        .drawer-user-name {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .drawer-user-email {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        .drawer-links {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.75rem;
          flex: 1;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.9rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .drawer-link:hover, .drawer-link.active {
          background: var(--primary-light);
          color: var(--primary-hover);
        }
        .drawer-cta-link {
          background: var(--primary-gradient);
          color: #ffffff !important;
          margin-bottom: 0.5rem;
        }
        .drawer-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .drawer-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem;
          color: #dc2626;
          font-weight: 600;
          border-radius: var(--radius-md);
          background: #fef2f2;
        }
      `}</style>
    </div>
  );
};

export default MobileDrawer;
