import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [languagePreference, setLanguagePreference] = useState('English');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      languagePreference,
    });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
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
          <h2 className="auth-title">Create Free Account</h2>
          <p className="auth-subtitle">Join GlobeTrotter to plan & share your multi-city journeys</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group auth-field">
            <label className="form-label">
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              className="form-input auth-input"
              placeholder="e.g. Aarav Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group auth-field">
            <label className="form-label">
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="form-input auth-input"
              placeholder="aarav@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid-cols-2 auth-grid-passwords">
            <div className="form-group auth-field">
              <label className="form-label">
                <Lock size={14} /> Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-input"
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group auth-field">
              <label className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-input"
                  placeholder="Repeat"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group auth-field">
            <label className="form-label">
              <Globe size={14} /> Language Preference
            </label>
            <select
              className="form-select auth-input"
              value={languagePreference}
              onChange={(e) => setLanguagePreference(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full auth-submit-btn"
            disabled={loading}
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
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
          max-width: 440px;
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
        .auth-field {
          margin-bottom: 0.85rem;
        }
        .auth-input {
          padding: 0.6rem 0.85rem;
          font-size: 0.88rem;
        }
        .auth-grid-passwords {
          gap: 0.75rem;
        }
        .password-input-wrapper {
          position: relative;
        }
        .auth-submit-btn {
          margin-top: 0.75rem;
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

export default SignupPage;
