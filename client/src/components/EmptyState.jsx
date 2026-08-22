import React from 'react';
import { Compass } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Compass,
  title = 'No items found',
  description = 'Try adjusting your filters or search terms, or create a new item to get started.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state-container animate-fade">
      <div className="empty-state-icon-wrapper">
        <Icon size={36} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn btn-primary btn-md empty-state-btn">
          {actionLabel}
        </button>
      )}

      <style>{`
        .empty-state-container {
          text-align: center;
          padding: 4rem 1.5rem;
          background: #ffffff;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-xl);
          margin: 1.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .empty-state-icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .empty-state-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .empty-state-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          max-width: 440px;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default EmptyState;
