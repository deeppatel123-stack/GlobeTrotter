import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  MoreVertical,
  Edit,
  Eye,
  Copy,
  Trash2,
  Share2,
  DollarSign,
  Globe,
  Lock,
} from 'lucide-react';
import { formatCurrency, formatDateRange } from '../utils/formatters';

const TripCard = ({ trip, onDuplicate, onDelete, onShare }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Upcoming':
        return <span className="badge badge-primary">Upcoming</span>;
      case 'Ongoing':
        return <span className="badge badge-success">Ongoing</span>;
      case 'Completed':
        return <span className="badge badge-neutral">Completed</span>;
      case 'Draft':
      default:
        return <span className="badge badge-warning">Draft</span>;
    }
  };

  const stopsCount = trip.stops ? trip.stops.length : 0;

  return (
    <div className="trip-card card animate-fade">
      {/* Cover Image Header */}
      <div className="trip-card-image-wrap">
        <img
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={trip.name}
          className="trip-card-img"
          loading="lazy"
        />
        <div className="trip-card-overlay"></div>

        {/* Top Badges */}
        <div className="trip-card-top-badges">
          {getStatusBadge(trip.status)}
          {trip.isPublic ? (
            <span className="badge badge-info public-tag">
              <Globe size={12} /> Public
            </span>
          ) : (
            <span className="badge badge-neutral private-tag">
              <Lock size={12} /> Private
            </span>
          )}
        </div>
      </div>

      {/* 3-Dot Action Menu — rendered OUTSIDE image-wrap to avoid overflow:hidden clipping */}
      <div className="trip-card-actions-dropdown">
        <button
          type="button"
          className="action-dots-btn"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          aria-label="Trip actions"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div
            className="actions-menu animate-fade"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
            }}
          >
            <Link to={`/trips/${trip._id}/itinerary`} className="actions-item">
              <Eye size={15} />
              <span>View Itinerary</span>
            </Link>
            <Link to={`/trips/${trip._id}/builder`} className="actions-item">
              <Edit size={15} />
              <span>Edit Builder</span>
            </Link>
            <button
              type="button"
              className="actions-item"
              onClick={() => onDuplicate && onDuplicate(trip._id)}
            >
              <Copy size={15} />
              <span>Duplicate Trip</span>
            </button>
            <button
              type="button"
              className="actions-item"
              onClick={() => onShare && onShare(trip)}
            >
              <Share2 size={15} />
              <span>Share Trip</span>
            </button>
            <div className="actions-divider"></div>
            <button
              type="button"
              className="actions-item text-danger"
              onClick={() => onDelete && onDelete(trip._id, trip.name)}
            >
              <Trash2 size={15} />
              <span>Delete Trip</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="trip-card-body">
        <h3 className="trip-card-title">
          <Link to={`/trips/${trip._id}/itinerary`}>{trip.name}</Link>
        </h3>

        <div className="trip-card-meta">
          <div className="meta-item">
            <Calendar size={14} className="meta-icon" />
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>
          <div className="meta-item">
            <MapPin size={14} className="meta-icon" />
            <span>{stopsCount} {stopsCount === 1 ? 'Stop / City' : 'Stops / Cities'}</span>
          </div>
        </div>

        {trip.description && (
          <p className="trip-card-desc">{trip.description}</p>
        )}

        {/* Cost & Budget Summary */}
        <div className="trip-card-cost-row">
          <div className="cost-box">
            <span className="cost-label">Estimated Cost</span>
            <span className="cost-amount">
              {formatCurrency(trip.estimatedCost, trip.currency)}
            </span>
          </div>
          {trip.totalBudget > 0 && (
            <div className="budget-box">
              <span className="cost-label">Budget</span>
              <span className="budget-amount">
                {formatCurrency(trip.totalBudget, trip.currency)}
              </span>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="trip-card-footer">
          <Link
            to={`/trips/${trip._id}/itinerary`}
            className="btn btn-secondary btn-sm"
          >
            Itinerary
          </Link>
          <Link
            to={`/trips/${trip._id}/builder`}
            className="btn btn-primary btn-sm"
          >
            Continue Planning
          </Link>
        </div>
      </div>

      <style>{`
        .trip-card {
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .trip-card-image-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
          background: #1e293b;
        }
        .trip-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .trip-card:hover .trip-card-img {
          transform: scale(1.05);
        }
        .trip-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%);
        }
        .trip-card-top-badges {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          display: flex;
          gap: 0.4rem;
          z-index: 5;
        }
        .public-tag, .private-tag {
          backdrop-filter: blur(8px);
        }
        .trip-card-actions-dropdown {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          z-index: 100;
        }
        .action-dots-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
        }
        .action-dots-btn:hover {
          background: #ffffff;
          transform: scale(1.05);
        }
        .actions-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 6px);
          width: 180px;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
          padding: 0.4rem;
          z-index: 999;
        }
        .actions-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.65rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          border-radius: var(--radius-sm);
          width: 100%;
          text-align: left;
          transition: var(--transition);
        }
        .actions-item:hover {
          background: #f1f5f9;
          color: var(--primary);
        }
        .actions-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.3rem 0;
        }
        .text-danger {
          color: #dc2626 !important;
        }
        .text-danger:hover {
          background: #fef2f2 !important;
        }
        .trip-card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .trip-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        .trip-card-title a {
          color: var(--text-main);
          transition: var(--transition);
        }
        .trip-card-title a:hover {
          color: var(--primary);
        }
        .trip-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .meta-icon {
          color: var(--primary);
          flex-shrink: 0;
        }
        .trip-card-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .trip-card-cost-row {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }
        .cost-box, .budget-box {
          display: flex;
          flex-direction: column;
        }
        .cost-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .cost-amount {
          font-size: 1rem;
          font-weight: 800;
          color: var(--accent-emerald);
        }
        .budget-amount {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .trip-card-footer {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 0.6rem;
        }
      `}</style>
    </div>
  );
};

export default TripCard;
