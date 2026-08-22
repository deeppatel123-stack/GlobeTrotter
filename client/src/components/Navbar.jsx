import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  MapPin,
  Calendar,
  Heart,
  PlusCircle,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Search,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const Navbar = ({ onOpenMobileMenu }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/' || location.pathname === '/welcome';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const scrollToSection = (id) => {
    if (isLanding) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''} ${isLanding ? 'is-landing' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand-section">
          <Link to="/" className="brand-logo">
            <div className="brand-icon-wrapper">
              <Compass className="brand-icon" size={26} />
            </div>
            <div className="brand-text-wrapper">
              <span className="brand-title">GlobeTrotter</span>
              <span className="brand-tagline">Travel Planner</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-links-desktop">
          {isLanding || !isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="nav-link nav-btn-link"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="nav-link nav-btn-link"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('copilot')}
                className="nav-link nav-btn-link"
              >
                <Sparkles size={14} style={{ color: '#8b5cf6' }} />
                AI Copilot
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('explore')}
                className="nav-link nav-btn-link"
              >
                Explore Trips
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="nav-link nav-btn-link"
              >
                About
              </button>
            </>
          ) : isAdmin ? (
            /* ADMIN ONLY NAVIGATION LINKS */
            <>
              <Link
                to="/admin"
                className={`nav-link admin-link ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
              >
                <Shield size={16} />
                Admin Dashboard
              </Link>
              <Link
                to="/admin/users"
                className={`nav-link admin-link ${isActive('/admin/users') ? 'active' : ''}`}
              >
                <User size={16} />
                User Management
              </Link>
              <Link
                to="/admin/analytics"
                className={`nav-link admin-link ${isActive('/admin/analytics') ? 'active' : ''}`}
              >
                <Sparkles size={16} />
                Platform Analytics
              </Link>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                style={{ marginLeft: '1rem', borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}
              >
                <Compass size={16} />
                Switch to Traveler Studio
              </Link>
            </>
          ) : (
            /* TRAVELER ONLY NAVIGATION LINKS */
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <Compass size={16} />
                Traveler Dashboard
              </Link>
              <Link
                to="/trips"
                className={`nav-link ${isActive('/trips') ? 'active' : ''}`}
              >
                <Calendar size={16} />
                My Trips
              </Link>
              <Link
                to="/explore/cities"
                className={`nav-link ${isActive('/explore/cities') ? 'active' : ''}`}
              >
                <MapPin size={16} />
                Explore Cities
              </Link>
              <Link
                to="/explore/activities"
                className={`nav-link ${isActive('/explore/activities') ? 'active' : ''}`}
              >
                <Sparkles size={16} />
                Activities
              </Link>
              <Link
                to="/saved"
                className={`nav-link ${isActive('/saved') ? 'active' : ''}`}
              >
                <Heart size={16} className="nav-icon" />
                Saved
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <Link to="/trips/create" className="btn btn-primary btn-sm plan-trip-btn">
                  <PlusCircle size={17} />
                  <span>Start Planning</span>
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="profile-dropdown-wrapper">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`profile-btn ${isAdmin ? 'admin-profile-btn' : ''}`}
                >
                  <img
                    src={
                      user?.profilePhoto ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={user?.name || 'User'}
                    className="avatar-img"
                  />
                  <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
                  {isAdmin && <span className="admin-role-badge">ADMIN</span>}
                  <ChevronDown size={15} />
                </button>

                {dropdownOpen && (
                  <div
                    className="dropdown-menu animate-fade"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="dropdown-user-info">
                      <p className="user-full-name">{user?.name}</p>
                      <p className="user-email">{user?.email}</p>
                      <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-info'}`} style={isAdmin ? { background: '#7c3aed', color: '#fff' } : {}}>
                        {isAdmin ? '🛡️ System Administrator' : '👤 Traveler Account'}
                      </span>
                    </div>
                    <div className="dropdown-divider"></div>
                    {isAdmin ? (
                      <>
                        <Link to="/admin" className="dropdown-item">
                          <Shield size={16} />
                          <span>Admin Control Center</span>
                        </Link>
                        <Link to="/admin/users" className="dropdown-item">
                          <User size={16} />
                          <span>User Management</span>
                        </Link>
                        <Link to="/admin/analytics" className="dropdown-item">
                          <Sparkles size={16} />
                          <span>Platform Analytics</span>
                        </Link>
                        <Link to="/dashboard" className="dropdown-item">
                          <Compass size={16} />
                          <span>Traveler Workspace</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/profile" className="dropdown-item">
                          <User size={16} />
                          <span>Profile & Settings</span>
                        </Link>
                        <Link to="/saved" className="dropdown-item">
                          <Heart size={16} />
                          <span>Saved Destinations</span>
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider"></div>
                    <button
                      type="button"
                      onClick={logout}
                      className="dropdown-item logout-item"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-nav-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          height: 70px;
          display: flex;
          align-items: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .navbar-header.is-landing {
          background: rgba(255, 255, 255, 0.85);
          border-bottom-color: rgba(226, 232, 240, 0.6);
        }
        .navbar-header.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
          border-bottom-color: #cbd5e1;
        }
        .nav-btn-link {
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .navbar-container {
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .navbar-brand-section {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }
        .brand-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
          flex-shrink: 0;
        }
        .brand-text-wrapper {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
          line-height: 1.1;
        }
        .brand-tagline {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .navbar-links-desktop {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto;
        }
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--primary);
          background: #f0f9ff;
        }
        .nav-link.active {
          color: var(--primary);
          background: #e0f2fe;
          font-weight: 700;
        }
        .admin-link {
          color: #7c3aed;
        }
        .admin-link:hover, .admin-link.active {
          color: #6d28d9;
          background: #f5f3ff;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }
        .auth-nav-buttons {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .auth-nav-buttons .btn {
          padding: 0.5rem 1.15rem;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: var(--radius-md);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .plan-trip-btn {
          background: var(--sunset-gradient);
          border: none;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
        }
        .admin-profile-btn {
          border-color: #c084fc !important;
          background: #f5f3ff !important;
        }
        .admin-role-badge {
          font-size: 0.65rem;
          font-weight: 800;
          color: #ffffff;
          background: #7c3aed;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
          letter-spacing: 0.5px;
        }
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.65rem 0.25rem 0.35rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          cursor: pointer;
          transition: var(--transition);
        }
        .profile-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .avatar-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-name-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 220px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          padding: 0.5rem;
          z-index: 100;
        }
        .dropdown-user-info {
          padding: 0.6rem 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 0.4rem;
        }
        .user-full-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #0f172a;
        }
        .user-email {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.86rem;
          font-weight: 600;
          color: #334155;
          border-radius: var(--radius-md);
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: var(--transition);
        }
        .dropdown-item:hover {
          background: #f1f5f9;
          color: var(--primary);
        }
        .dropdown-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 0.35rem 0;
        }
        .logout-item {
          color: #dc2626;
        }
        .logout-item:hover {
          background: #fef2f2;
          color: #b91c1c;
        }
        .mobile-menu-btn {
          display: none;
          padding: 0.4rem;
          background: none;
          border: none;
          color: #334155;
          cursor: pointer;
        }
        @media (max-width: 1024px) {
          .navbar-search-desktop,
          .navbar-links-desktop,
          .plan-trip-btn,
          .user-name-text {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
