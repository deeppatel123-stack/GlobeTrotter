import React, { useState } from 'react';
import Modal from './Modal';
import { Copy, Check, Globe, Lock, Share2, Mail, MessageCircle, Twitter, Facebook, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, trip, onTogglePublic }) => {
  const [copied, setCopied] = useState(false);

  if (!trip) return null;

  const publicSlug = trip.publicSlug || trip.name?.toLowerCase().replace(/\s+/g, '-');
  const publicUrl = `${window.location.origin}/public/trip/${publicSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success('Public itinerary link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Check out my travel plan for ${trip.name} on GlobeTrotter!`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Travel Itinerary"
      size="md"
      footer={
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Done
        </button>
      }
    >
      <div className="share-modal-container">
        {/* Privacy Toggle Box */}
        <div className="privacy-toggle-card">
          <div className="privacy-info">
            {trip.isPublic ? (
              <div className="privacy-icon-badge public">
                <Globe size={20} />
              </div>
            ) : (
              <div className="privacy-icon-badge private">
                <Lock size={20} />
              </div>
            )}
            <div>
              <h4 className="privacy-status-title">
                {trip.isPublic ? 'Trip is Public' : 'Trip is Private'}
              </h4>
              <p className="privacy-status-desc">
                {trip.isPublic
                  ? 'Anyone with the link can view your itinerary and copy it to their account.'
                  : 'Only you can view and edit this trip.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`btn btn-sm ${trip.isPublic ? 'btn-secondary' : 'btn-primary'}`}
            onClick={onTogglePublic}
          >
            {trip.isPublic ? 'Make Private' : 'Make Public'}
          </button>
        </div>

        {/* Public Link Section (if public) */}
        {trip.isPublic && (
          <div className="public-link-section animate-fade">
            <label className="form-label">Public Itinerary URL</label>
            <div className="link-copy-box">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="link-input"
              />
              <button
                type="button"
                className="btn btn-primary btn-sm copy-btn"
                onClick={handleCopyLink}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="social-share-block">
              <span className="social-share-label">Share directly to:</span>
              <div className="social-icons-grid">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${publicUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn whatsapp"
                  title="Share via WhatsApp"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(publicUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn twitter"
                  title="Share on X / Twitter"
                >
                  <Twitter size={18} /> Twitter / X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn facebook"
                  title="Share on Facebook"
                >
                  <Facebook size={18} /> Facebook
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Travel Itinerary: ${trip.name}`)}&body=${encodeURIComponent(`${shareText}\n\n${publicUrl}`)}`}
                  className="social-btn email"
                  title="Share via Email"
                >
                  <Mail size={18} /> Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .privacy-toggle-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          gap: 1rem;
        }
        .privacy-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .privacy-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .privacy-icon-badge.public {
          background: #dbeafe;
          color: #0284c7;
        }
        .privacy-icon-badge.private {
          background: #f1f5f9;
          color: #64748b;
        }
        .privacy-status-title {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-main);
        }
        .privacy-status-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }
        .public-link-section {
          margin-top: 1rem;
        }
        .link-copy-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.4rem;
        }
        .link-input {
          flex: 1;
          padding: 0.65rem 0.85rem;
          background: #f1f5f9;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          color: #0f172a;
        }
        .social-share-block {
          margin-top: 1.5rem;
        }
        .social-share-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.6rem;
        }
        .social-icons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.6rem;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          transition: var(--transition);
        }
        .social-btn.whatsapp {
          background: #25d366;
          color: #ffffff;
          border-color: #25d366;
        }
        .social-btn.twitter {
          background: #000000;
          color: #ffffff;
          border-color: #000000;
        }
        .social-btn.facebook {
          background: #1877f2;
          color: #ffffff;
          border-color: #1877f2;
        }
        .social-btn.email {
          background: #f1f5f9;
          color: var(--text-main);
        }
        .social-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}</style>
    </Modal>
  );
};

export default ShareModal;
