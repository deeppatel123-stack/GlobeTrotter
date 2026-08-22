import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Shield, Globe, Sparkles, Github, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="brand-icon-wrapper">
                <Compass size={22} color="#ffffff" />
              </div>
              <span className="brand-title">GlobeTrotter</span>
            </div>
            <p className="footer-tagline">
              Plan less, explore more. GlobeTrotter turns your travel ideas into intelligent, personalized, and optimized journeys.
            </p>
            <div className="footer-social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/explore/cities">Explore</Link></li>
              <li><Link to="/trips">My Trips</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">About</a></li>
              <li><Link to="/profile">Contact</Link></li>
            </ul>
          </div>

          {/* Product */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-list">
              <li><a href="#copilot">AI Copilot</a></li>
              <li><a href="#features">Smart Budget</a></li>
              <li><a href="#features">Route Optimizer</a></li>
              <li><a href="#simulator">Trip Simulator</a></li>
              <li><a href="#how-it-works">Collaboration</a></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-list">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/saved">Saved Places</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © 2026 GlobeTrotter. Travel smarter.
          </p>
          <div className="footer-bottom-badges">
            <span className="badge badge-neutral">Intelligent Travel Platform</span>
            <span className="badge badge-primary">AI Powered</span>
          </div>
        </div>
      </div>

      <style>{`
        .app-footer {
          background: #ffffff;
          border-top: 1px solid var(--border-color);
          padding: 3.5rem 1.5rem 1.5rem;
          margin-top: auto;
        }
        .footer-container {
          max-width: 1320px;
          margin: 0 auto;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }
        .footer-tagline {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 380px;
          margin-bottom: 1rem;
        }
        .footer-social-links {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-top: 1rem;
        }
        .social-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .social-icon-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
          transform: translateY(-2px);
        }
        .footer-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-list a {
          font-size: 0.9rem;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .footer-list a:hover {
          color: var(--primary);
          padding-left: 3px;
        }
        .footer-bottom {
          padding-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .copyright-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .footer-bottom-badges {
          display: flex;
          gap: 0.5rem;
        }
        @media (max-width: 900px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
          }
          .footer-brand-col {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 600px) {
          .footer-top {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
