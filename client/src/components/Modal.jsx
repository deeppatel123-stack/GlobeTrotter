import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="gt-modal-backdrop animate-fade" onClick={onClose}>
      <div
        className={`gt-modal-container gt-modal-${size} animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="gt-modal-header">
          <h3 className="gt-modal-title">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="gt-modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="gt-modal-body">{children}</div>

        {/* Modal Footer */}
        {footer && <div className="gt-modal-footer">{footer}</div>}
      </div>

      <style>{`
        .gt-modal-backdrop {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 99999 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          box-sizing: border-box;
        }
        .gt-modal-container {
          background: #ffffff;
          border-radius: var(--radius-lg, 16px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          width: 100%;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          margin: auto;
        }
        .gt-modal-sm { max-width: 440px; }
        .gt-modal-md { max-width: 580px; }
        .gt-modal-lg { max-width: 760px; }
        .gt-modal-xl { max-width: 960px; }
        .gt-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
          flex-shrink: 0;
        }
        .gt-modal-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .gt-modal-close-btn {
          color: #64748b;
          padding: 0.4rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition, 0.2s ease);
        }
        .gt-modal-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .gt-modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          background: #ffffff;
        }
        .gt-modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          background: #f8fafc;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
