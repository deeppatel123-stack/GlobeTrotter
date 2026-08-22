import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Compass, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        setSubmitted(true);
        setFeedbackMessage(res.message);
        toast.success('Password instructions generated!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error requesting password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box card animate-slide-up">
        <div className="auth-header">
          <div className="brand-icon-wrapper auth-logo-icon">
            <Compass size={26} color="#ffffff" />
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            Enter your registered email address to receive reset instructions
          </p>
        </div>

        {submitted ? (
          <div className="reset-success-box animate-fade">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={36} color="#16a34a" />
            </div>
            <h4 className="success-title">Check Your Inbox</h4>
            <p className="success-desc">{feedbackMessage}</p>
            <Link to="/login" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group auth-field">
              <label className="form-label">
                <Mail size={14} /> Your Account Email
              </label>
              <input
                type="email"
                className="form-input auth-input"
                placeholder="traveler@globetrotter.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Send Reset Link'}
            </button>

            <div className="auth-footer">
              <Link to="/login" className="back-link">
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
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
          margin-bottom: 1.15rem;
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
          margin-bottom: 0.95rem;
        }
        .auth-input {
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
        }
        .auth-submit-btn {
          margin-top: 0.75rem;
          padding: 0.7rem 1.25rem;
          font-size: 0.95rem;
        }
        .auth-footer {
          text-align: center;
          margin-top: 1.15rem;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--primary);
        }
        .reset-success-box {
          text-align: center;
          padding: 1rem 0.5rem;
        }
        .success-icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .success-title {
          font-size: 1.2rem;
          font-weight: 800;
        }
        .success-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.35rem;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
