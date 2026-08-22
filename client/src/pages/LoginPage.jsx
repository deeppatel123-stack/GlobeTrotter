import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoadingType, setDemoLoadingType] = useState(null); // 'traveler' | 'admin' | null

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success && res.user) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleDemoLogin = async (type) => {
    if (loading || demoLoadingType) return;

    setDemoLoadingType(type);

    let demoEmail = type === 'traveler' ? 'traveler@globetrotter.demo' : 'admin@globetrotter.demo';
    let demoPassword = type === 'traveler' ? 'Traveler@123' : 'Admin@123';

    try {
      let res = await login(demoEmail, demoPassword);

      // Fallback to .com demo credentials if primary .demo login fails
      if (!res.success && !res.isNetworkError) {
        const fallbackEmail = type === 'traveler' ? 'traveler@globetrotter.com' : 'admin@globetrotter.com';
        const fallbackPassword = 'password123';
        res = await login(fallbackEmail, fallbackPassword);
      }

      setDemoLoadingType(null);

      if (res.success && res.user) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setDemoLoadingType(null);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box card animate-slide-up">
        {/* Header */}
        <div className="auth-header">
          <div className="brand-icon-wrapper auth-logo-icon">
            <Compass size={26} color="#ffffff" />
          </div>
          <h2 className="auth-title">Welcome to GlobeTrotter</h2>
          <p className="auth-subtitle">Sign in to manage your personalized travel itineraries</p>
        </div>

        {/* Demo Quick Fill Badges - Exactly 2 Buttons */}
        <div className="demo-credentials-box">
          <span className="demo-label">✨ Quick 1-Click Demo Logins:</span>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className={`btn btn-secondary btn-sm demo-btn ${demoLoadingType === 'traveler' ? 'demo-loading' : ''}`}
              onClick={() => handleDemoLogin('traveler')}
              disabled={loading || demoLoadingType !== null}
            >
              {demoLoadingType === 'traveler' ? (
                <>
                  <Loader2 size={14} className="spin-icon" />
                  <span>Signing in as Traveler...</span>
                </>
              ) : (
                <span>👤 Traveler Demo</span>
              )}
            </button>
            <button
              type="button"
              className={`btn btn-secondary btn-sm demo-btn ${demoLoadingType === 'admin' ? 'demo-loading' : ''}`}
              onClick={() => handleDemoLogin('admin')}
              disabled={loading || demoLoadingType !== null}
            >
              {demoLoadingType === 'admin' ? (
                <>
                  <Loader2 size={14} className="spin-icon" />
                  <span>Signing in as Admin...</span>
                </>
              ) : (
                <span>🛡️ Admin Demo</span>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group auth-field">
            <label className="form-label">
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="form-input auth-input"
              placeholder="traveler@globetrotter.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || demoLoadingType !== null}
              required
            />
          </div>

          <div className="form-group auth-field">
            <div className="flex-between">
              <label className="form-label">
                <Lock size={14} /> Password
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || demoLoadingType !== null}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading || demoLoadingType !== null}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full auth-submit-btn"
            disabled={loading || demoLoadingType !== null}
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/signup" className="auth-link">
              Create free account
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page-container {
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          box-sizing: border-box;
          overflow: hidden;
        }
        .auth-card-box {
          width: 100%;
          max-width: 420px;
          padding: 1.75rem 1.85rem;
          background: #ffffff;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.12);
          border-radius: var(--radius-xl);
          border: 1px solid #e2e8f0;
          box-sizing: border-box;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        .auth-logo-icon {
          margin: 0 auto 0.5rem;
          width: 44px;
          height: 44px;
        }
        .auth-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
        }
        .auth-subtitle {
          font-size: 0.84rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
        .demo-credentials-box {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
          margin-bottom: 1.1rem;
          text-align: center;
        }
        .demo-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.45rem;
        }
        .demo-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }
        .demo-btn {
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid #cbd5e1;
          transition: var(--transition);
        }
        .demo-btn:hover {
          background: #f1f5f9;
          border-color: var(--primary);
          color: var(--primary);
        }
        .demo-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .demo-loading {
          background: #f0f9ff !important;
          border-color: var(--primary) !important;
          color: var(--primary-hover) !important;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        .auth-field {
          margin-bottom: 0.95rem;
        }
        .auth-input {
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
        }
        .forgot-link {
          font-size: 0.78rem;
          color: var(--primary);
          font-weight: 600;
        }
        .password-input-wrapper {
          position: relative;
        }
        .password-toggle-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          padding: 0.2rem;
        }
        .auth-submit-btn {
          margin-top: 0.85rem;
          padding: 0.7rem 1.25rem;
          font-size: 0.95rem;
        }
        .auth-footer {
          text-align: center;
          margin-top: 1.15rem;
          font-size: 0.84rem;
          color: var(--text-muted);
        }
        .auth-link {
          color: var(--primary);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
