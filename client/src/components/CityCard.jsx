import React from 'react';
import { MapPin, Heart, Plus, Sparkles, DollarSign, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, convertCurrency } from '../utils/formatters';

const ESTIMATED_DAILY_COSTS = {
  1: { inr: 2000, label: 'Budget' },
  2: { inr: 3800, label: 'Affordable' },
  3: { inr: 6500, label: 'Moderate' },
  4: { inr: 10500, label: 'Upscale' },
  5: { inr: 18000, label: 'Luxury' },
};

const CityCard = ({ city, onAddToTrip, onSelectCity, currency = 'INR' }) => {
  const { isDestinationSaved, toggleSaveDestination } = useAuth();
  const isSaved = isDestinationSaved(city._id);
  const costInfo = ESTIMATED_DAILY_COSTS[city.costIndex || 3];
  const convertedAmount = convertCurrency(costInfo.inr, currency);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  const renderCostIndex = (index = 3) => {
    const symbols = [];
    for (let i = 0; i < 5; i++) {
      symbols.push(
        <span
          key={i}
          style={{
            color: i < index ? '#10b981' : '#cbd5e1',
            fontWeight: i < index ? '800' : '400',
          }}
        >
          {currencySymbol}
        </span>
      );
    }
    return symbols;
  };

  return (
    <div className="city-card card animate-fade">
      <div className="city-card-image-wrap" onClick={() => onSelectCity && onSelectCity(city)}>
        <img src={city.image} alt={city.name} className="city-card-img" loading="lazy" />
        <div className="city-card-overlay"></div>

        {/* Popularity Badge */}
        <div className="city-card-badge-top">
          <span className="badge badge-primary popularity-tag">
            <Sparkles size={12} /> {city.popularity}% Score
          </span>
          {city.recommended && (
            <span className="badge badge-success">Recommended</span>
          )}
        </div>

        {/* Bookmark Heart Button */}
        <button
          type="button"
          className={`city-heart-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveDestination(city._id);
          }}
          aria-label="Save destination"
        >
          <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#ffffff'} />
        </button>

        <div className="city-card-image-content">
          <h3 className="city-card-title">{city.name}</h3>
          <p className="city-card-country">
            <MapPin size={13} /> {city.country} • {city.region}
          </p>
        </div>
      </div>

      <div className="city-card-body">
        <p className="city-card-desc">{city.description}</p>

        {/* Meta Row with clean numeric price estimate */}
        <div className="city-meta-row">
          <div className="cost-index-box">
            <span className="meta-label">Budget Tier</span>
            <div className="cost-symbols">{renderCostIndex(city.costIndex)}</div>
          </div>
          <div className="daily-price-badge">
            <span className="price-tag-label">Avg.</span>
            <span className="price-tag-amount">{formatCurrency(convertedAmount, currency)}</span>
            <span className="price-tag-sub">/day</span>
          </div>
        </div>

        {/* Attractions count snippet */}
        {city.highlights && city.highlights.length > 0 && (
          <div className="city-highlights-snippet">
            <span className="highlights-count">
              ⭐ {city.highlights.length} Top Attractions included
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="city-card-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm flex-1"
            onClick={() => onSelectCity && onSelectCity(city)}
          >
            <Eye size={14} /> Details
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm flex-1"
            onClick={() => onAddToTrip && onAddToTrip(city)}
          >
            <Plus size={15} /> Add to Trip
          </button>
        </div>
      </div>

      <style>{`
        .city-card {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .city-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
        }
        .city-card-image-wrap {
          position: relative;
          height: 195px;
          cursor: pointer;
          overflow: hidden;
        }
        .city-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .city-card:hover .city-card-img {
          transform: scale(1.08);
        }
        .city-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%);
        }
        .city-card-badge-top {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          display: flex;
          gap: 0.35rem;
          z-index: 5;
        }
        .city-heart-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          z-index: 5;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .city-heart-btn:hover {
          transform: scale(1.15);
          background: rgba(15, 23, 42, 0.9);
        }
        .city-card-image-content {
          position: absolute;
          bottom: 0.85rem;
          left: 1rem;
          right: 1rem;
          z-index: 5;
        }
        .city-card-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 0.2rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }
        .city-card-country {
          font-size: 0.85rem;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
        }
        .city-card-body {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }
        .city-card-desc {
          font-size: 0.86rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .city-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          gap: 0.5rem;
        }
        .cost-index-box {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .meta-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .cost-symbols {
          font-size: 0.95rem;
          letter-spacing: 1px;
          line-height: 1;
        }
        .daily-price-badge {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-md);
          white-space: nowrap;
        }
        .price-tag-label {
          font-size: 0.72rem;
          color: #047857;
          font-weight: 600;
        }
        .price-tag-amount {
          font-size: 0.95rem;
          font-weight: 800;
          color: #065f46;
        }
        .price-tag-sub {
          font-size: 0.72rem;
          color: #047857;
          font-weight: 600;
        }
        .city-highlights-snippet {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary);
        }
        .city-card-actions {
          display: flex;
          gap: 0.6rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .flex-1 {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default CityCard;
