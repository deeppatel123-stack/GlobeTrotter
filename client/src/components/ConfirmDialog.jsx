import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="confirm-dialog-content">
        <div className={`confirm-icon-wrapper ${isDestructive ? 'icon-danger' : 'icon-warning'}`}>
          <AlertTriangle size={24} />
        </div>
        <p className="confirm-message">{message}</p>
      </div>

      <style>{`
        .confirm-dialog-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.5rem 0;
        }
        .confirm-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-danger {
          background: #fee2e2;
          color: #dc2626;
        }
        .icon-warning {
          background: #fef3c7;
          color: #d97706;
        }
        .confirm-message {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
      `}</style>
    </Modal>
  );
};

export default ConfirmDialog;
