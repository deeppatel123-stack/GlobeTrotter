import React from 'react';
import { Clock, Star, Plus, Eye, MapPin, Tag } from 'lucide-react';
import { formatCurrency, convertCurrency } from '../utils/formatters';

const ActivityCard = ({ activity, onAddToStop, onQuickView, currency = 'INR' }) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'sightseeing': return 'badge-primary';
      case 'food': return 'badge-warning';
      case 'adventure': return 'badge-danger';
      case 'culture': return 'badge-info';
      case 'nature': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  const convertedCost = convertCurrency(activity.estimatedCost, currency);

  return (
    <div className="activity-card card animate-fade">
      <div className="activity-image-wrap">
        <img src={activity.image} alt={activity.name} className="activity-img" loading="lazy" />
        <div className="activity-badge-overlay">
          <span className={`badge ${getCategoryColor(activity.category)}`}>
            {activity.category}
          </span>
          <span className="badge badge-warning rating-badge">
            <Star size={12} fill="#f59e0b" color="#f59e0b" /> {activity.rating?.toFixed(1) || '4.5'}
          </span>
        </div>
      </div>

      <div className="activity-card-body">
        <h4 className="activity-title">{activity.name}</h4>

        {activity.city && (
          <p className="activity-city-location">
            <MapPin size={13} />
            {activity.city.name ? `${activity.city.name}, ${activity.city.country}` : activity.location || 'Global'}
          </p>
        )}

        <p className="activity-desc">{activity.description}</p>

        <div className="activity-meta-pills">
          <div className="meta-pill">
            <Clock size={13} />
            <span>{activity.duration} {activity.duration === 1 ? 'hr' : 'hrs'}</span>
          </div>
          <div className="activity-cost-badge">
            {activity.estimatedCost > 0 ? (
              <span className="cost-text">{formatCurrency(convertedCost, currency)}</span>
            ) : (
              <span className="free-text">Free / Included</span>
            )}
          </div>
        </div>

        <div className="activity-actions">
          {onQuickView && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onQuickView(activity)}
              title="Quick view"
            >
              <Eye size={15} /> Details
            </button>
          )}
          {onAddToStop && (
            <button
              type="button"
              className="btn btn-primary btn-sm flex-1"
              onClick={() => onAddToStop(activity)}
            >
              <Plus size={15} /> Add to Itinerary
            </button>
          )}
        </div>
      </div>

      <style>{`
        .activity-card {
          display: flex;
          flex-direction: column;
        }
        .activity-image-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: #0f172a;
        }
        .activity-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .activity-card:hover .activity-img {
          transform: scale(1.05);
        }
        .activity-badge-overlay {
          position: absolute;
          top: 0.65rem;
          left: 0.65rem;
          right: 0.65rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 5;
        }
        .activity-card-body {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .activity-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
          line-height: 1.3;
        }
        .activity-city-location {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .activity-desc {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .activity-meta-pills {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-top: 1px solid var(--border-color);
          margin-bottom: 0.75rem;
        }
        .meta-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .cost-text {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--accent-emerald);
        }
        .free-text {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--primary);
        }
        .activity-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .flex-1 {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default ActivityCard;
