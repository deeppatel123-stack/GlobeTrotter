import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { cityService } from '../services/cityService';
import {
  MapPin,
  Sparkles,
  Plus,
  Clock,
  Star,
  Heart,
  DollarSign,
  Calendar,
  Home,
  Utensils,
  Car,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, convertCurrency } from '../utils/formatters';

const ESTIMATED_DAILY_COSTS = {
  1: { inr: 2000, stay: 1000, food: 600, transit: 400, label: 'Budget-Friendly' },
  2: { inr: 3800, stay: 2000, food: 1100, transit: 700, label: 'Affordable' },
  3: { inr: 6500, stay: 3500, food: 1800, transit: 1200, label: 'Moderate' },
  4: { inr: 10500, stay: 6000, food: 2800, transit: 1700, label: 'Upscale' },
  5: { inr: 18000, stay: 11000, food: 4500, transit: 2500, label: 'Luxury' },
};

const CityDetailModal = ({ isOpen, onClose, city, currency = 'INR', onAddToTrip }) => {
  const [cityDetails, setCityDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isDestinationSaved, toggleSaveDestination } = useAuth();

  useEffect(() => {
    if (isOpen && city?._id) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const res = await cityService.getCityById(city._id);
          if (res.success) {
            setCityDetails(res.data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, city]);

  if (!city) return null;

  const currentCity = cityDetails || city;
  const isSaved = isDestinationSaved(currentCity._id);
  const costBreakdown = ESTIMATED_DAILY_COSTS[currentCity.costIndex || 3];

  const convertedTotal = convertCurrency(costBreakdown.inr, currency);
  const convertedStay = convertCurrency(costBreakdown.stay, currency);
  const convertedFood = convertCurrency(costBreakdown.food, currency);
  const convertedTransit = convertCurrency(costBreakdown.transit, currency);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${currentCity.name}, ${currentCity.country}`}
      size="lg"
      footer={
        <div className="city-modal-footer-row">
          <button
            type="button"
            className="btn btn-secondary btn-fav-toggle"
            onClick={() => toggleSaveDestination(currentCity._id)}
          >
            <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#64748b'} />
            <span>{isSaved ? 'Saved in Favorites' : 'Save to Favorites'}</span>
          </button>
          <div className="modal-footer-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onAddToTrip && onAddToTrip(currentCity);
              }}
            >
              <Plus size={16} /> Add {currentCity.name} to Trip
            </button>
          </div>
        </div>
      }
    >
      <div className="city-detail-modal-body animate-fade">
        {/* Hero Image & Overlay */}
        <div className="city-detail-hero">
          <img src={currentCity.image} alt={currentCity.name} className="detail-hero-img" />
          <div className="detail-hero-overlay"></div>
          <div className="detail-hero-content">
            <div className="detail-hero-tags">
              <span className="badge badge-primary">
                <Sparkles size={12} /> {currentCity.popularity}% Popularity
              </span>
              <span className="badge badge-success">
                {costBreakdown.label}
              </span>
            </div>
            <h2 className="detail-city-title">{currentCity.name}</h2>
            <p className="detail-city-subtitle">
              <MapPin size={15} /> {currentCity.country} • {currentCity.region}
            </p>
          </div>
        </div>

        {/* Estimated Daily Travel Cost Card */}
        <div className="cost-breakdown-panel card">
          <div className="flex-between cost-panel-header">
            <div className="cost-title-col">
              <h4 className="cost-panel-title">
                <DollarSign size={18} color="#10b981" /> Estimated Daily Travel Cost ({currency})
              </h4>
              <p className="cost-panel-sub">Average per-person spending estimate for {currentCity.name}</p>
            </div>
            <div className="total-daily-pill">
              <span className="total-daily-amount">{formatCurrency(convertedTotal, currency)}</span>
              <span className="total-daily-sub">/ day</span>
            </div>
          </div>

          <div className="cost-items-row">
            <div className="cost-mini-item">
              <div className="mini-icon-wrap bg-purple"><Home size={14} /></div>
              <div className="mini-info">
                <span className="mini-label">Stay / Hotel</span>
                <span className="mini-val">{formatCurrency(convertedStay, currency)}/night</span>
              </div>
            </div>

            <div className="cost-mini-item">
              <div className="mini-icon-wrap bg-amber"><Utensils size={14} /></div>
              <div className="mini-info">
                <span className="mini-label">Food & Meals</span>
                <span className="mini-val">{formatCurrency(convertedFood, currency)}/day</span>
              </div>
            </div>

            <div className="cost-mini-item">
              <div className="mini-icon-wrap bg-blue"><Car size={14} /></div>
              <div className="mini-info">
                <span className="mini-label">Local Transit</span>
                <span className="mini-val">{formatCurrency(convertedTransit, currency)}/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="detail-section">
          <h4 className="detail-section-title">About this Destination</h4>
          <p className="detail-description">{currentCity.description}</p>
        </div>

        {/* Highlights & Top Attractions */}
        {currentCity.highlights && currentCity.highlights.length > 0 && (
          <div className="detail-section">
            <h4 className="detail-section-title">Must-See Highlights & Attractions</h4>
            <div className="highlights-chips-list">
              {currentCity.highlights.map((h, i) => (
                <div key={i} className="highlight-chip-card">
                  <CheckCircle size={14} className="chip-check" />
                  <span className="chip-text">{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Activities */}
        {currentCity.activities && currentCity.activities.length > 0 && (
          <div className="detail-section">
            <h4 className="detail-section-title">Top Experiences & Activities in {currentCity.name}</h4>
            <div className="detail-activities-grid">
              {currentCity.activities.map((act) => {
                const convertedActCost = convertCurrency(act.estimatedCost, currency);
                return (
                  <div key={act._id} className="detail-activity-card">
                    <img src={act.image} alt={act.name} className="detail-act-thumb" />
                    <div className="detail-act-info">
                      <h5 className="detail-act-name">{act.name}</h5>
                      <p className="detail-act-desc">{act.description}</p>
                      <div className="detail-act-meta">
                        <span className="badge badge-neutral">{act.category}</span>
                        <span className="detail-act-rating">
                          <Star size={12} fill="#f59e0b" color="#f59e0b" /> {act.rating}
                        </span>
                        <span className="detail-act-duration">
                          <Clock size={12} /> {act.duration}h
                        </span>
                        <span className="detail-act-cost">{formatCurrency(convertedActCost, currency)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .city-modal-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .modal-footer-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .city-detail-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .city-detail-hero {
          position: relative;
          height: 200px;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .detail-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.88) 100%);
        }
        .detail-hero-content {
          position: absolute;
          bottom: 1.25rem;
          left: 1.5rem;
          right: 1.5rem;
          z-index: 5;
        }
        .detail-hero-tags {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.4rem;
        }
        .detail-city-title {
          color: #ffffff;
          font-size: 1.85rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .detail-city-subtitle {
          color: #e2e8f0;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 500;
        }
        .cost-breakdown-panel {
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .cost-panel-header {
          margin-bottom: 1rem;
          align-items: center;
        }
        .cost-panel-title {
          font-size: 1.05rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #0f172a;
        }
        .cost-panel-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .total-daily-pill {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
        }
        .total-daily-amount {
          font-size: 1.15rem;
          font-weight: 800;
          color: #15803d;
        }
        .total-daily-sub {
          font-size: 0.75rem;
          color: #166534;
          font-weight: 600;
        }
        .cost-items-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }
        @media (max-width: 600px) {
          .cost-items-row {
            grid-template-columns: 1fr;
          }
        }
        .cost-mini-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #ffffff;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
        }
        .mini-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .bg-purple { background: #8b5cf6; }
        .bg-amber { background: #f59e0b; }
        .bg-blue { background: #3b82f6; }
        .mini-info {
          display: flex;
          flex-direction: column;
        }
        .mini-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .mini-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .detail-section-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 0.65rem;
        }
        .detail-description {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--text-main);
        }
        .highlights-chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .highlight-chip-card {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          color: #0369a1;
        }
        .chip-check {
          color: #0284c7;
        }
        .detail-activities-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .detail-activity-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
        }
        .detail-act-thumb {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }
        .detail-act-info {
          flex: 1;
        }
        .detail-act-name {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .detail-act-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin: 0.15rem 0 0.35rem;
        }
        .detail-act-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-size: 0.8rem;
        }
        .detail-act-rating {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-weight: 700;
          color: #d97706;
        }
        .detail-act-duration {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          color: var(--text-muted);
        }
        .detail-act-cost {
          font-weight: 800;
          color: var(--accent-emerald);
          margin-left: auto;
        }
      `}</style>
    </Modal>
  );
};

export default CityDetailModal;
