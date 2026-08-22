import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { publicService } from '../services/publicService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDateRange, formatDate } from '../utils/formatters';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Copy,
  Share2,
  Check,
  Globe,
  Clock,
  Sparkles,
  User,
  Heart,
  MessageCircle,
  Twitter,
  Facebook,
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const PublicTripPage = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicTrip = async () => {
      setLoading(true);
      try {
        const res = await publicService.getPublicTripBySlug(slug);
        if (res.success) {
          setTrip(res.data);
        }
      } catch (err) {
        console.error('Failed to load public trip:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPublicTrip();
    }
  }, [slug]);

  const handleCopyTrip = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in or sign up to copy this itinerary to your account.');
      navigate(`/login?redirect=/public/trip/${slug}`);
      return;
    }

    setCopying(true);
    try {
      const res = await publicService.copyPublicTrip(slug);
      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success('Trip copied to your account! Redirecting to your builder...');
        setTimeout(() => {
          navigate(`/trips/${res.data._id}/builder`);
        }, 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to copy trip');
    } finally {
      setCopying(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '70vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading Shared Itinerary...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '70vh', flexDirection: 'column' }}>
        <Globe size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
        <h2>Itinerary Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          This public itinerary may have been deleted or set to private by its creator.
        </p>
        <Link to="/explore/cities" className="btn btn-primary">
          Explore Popular Destinations
        </Link>
      </div>
    );
  }

  const stops = trip.stops || [];
  const totalActivitiesCount = stops.reduce(
    (total, s) => total + (s.activities ? s.activities.length : 0),
    0
  );

  return (
    <div className="public-trip-wrapper animate-fade">
      {/* Read-Only Notice Bar */}
      <div className="public-notice-bar">
        <div className="notice-container">
          <div className="notice-left">
            <Globe size={18} />
            <span>Public Read-Only Itinerary by <strong>{trip.user?.name || 'Fellow Traveler'}</strong></span>
          </div>
          <div className="notice-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopyLink}
            >
              {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm copy-trip-btn"
              onClick={handleCopyTrip}
              disabled={copying}
            >
              <Copy size={14} />
              <span>{copying ? 'Copying...' : 'Copy Trip to My Account'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* Public Hero Banner */}
        <div className="public-hero-card card">
          <img
            src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
            alt={trip.name}
            className="public-hero-img"
          />
          <div className="public-hero-overlay"></div>
          <div className="public-hero-content">
            <div className="creator-profile-badge">
              <img
                src={trip.user?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={trip.user?.name}
                className="creator-avatar"
              />
              <span>Created by {trip.user?.name || 'Traveler'}</span>
            </div>

            <h1 className="public-trip-title">{trip.name}</h1>
            {trip.description && <p className="public-trip-desc">{trip.description}</p>}

            <div className="public-meta-pills">
              <span className="pub-pill">
                <Calendar size={15} /> {formatDateRange(trip.startDate, trip.endDate)}
              </span>
              <span className="pub-pill">
                <MapPin size={15} /> {stops.length} {stops.length === 1 ? 'City' : 'Cities'}
              </span>
              <span className="pub-pill">
                <Sparkles size={15} /> {totalActivitiesCount} Experiences
              </span>
              <span className="pub-pill">
                <DollarSign size={15} /> Estimated {formatCurrency(trip.estimatedCost, trip.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Itinerary Route Stream */}
        <div className="public-main-content">
          <div className="stops-sequence-header">
            <h2 className="section-title">Complete Multi-City Itinerary</h2>
            <p className="section-subtitle">
              Follow this journey's day-wise recommendations and activities.
            </p>
          </div>

          <div className="public-stops-grid">
            {stops.map((stop, sIdx) => (
              <div key={stop._id || sIdx} className="public-stop-card card animate-slide-up">
                {/* City Header */}
                <div className="pub-stop-header">
                  <div className="pub-stop-number">{sIdx + 1}</div>
                  <div className="pub-stop-info">
                    <h3 className="pub-city-name">
                      {stop.cityName}, <span className="pub-country">{stop.country}</span>
                    </h3>
                    <span className="pub-dates">{formatDateRange(stop.startDate, stop.endDate)}</span>
                  </div>
                  <span className="pub-stop-cost">
                    {formatCurrency(stop.estimatedCost, trip.currency)}
                  </span>
                </div>

                {stop.notes && (
                  <div className="pub-stop-notes">
                    <strong>Local Tip:</strong> {stop.notes}
                  </div>
                )}

                {/* Activities in Stop */}
                <div className="pub-activities-list">
                  {stop.activities && stop.activities.length > 0 ? (
                    stop.activities.map((act, aIdx) => (
                      <div key={act._id || aIdx} className="pub-activity-card">
                        <img src={act.image} alt={act.name} className="pub-act-thumb" />
                        <div className="pub-act-body">
                          <div className="flex-between">
                            <h4 className="pub-act-title">{act.name}</h4>
                            <span className="pub-act-cost">
                              {formatCurrency(act.cost, trip.currency)}
                            </span>
                          </div>
                          {act.description && (
                            <p className="pub-act-desc">{act.description}</p>
                          )}
                          <div className="pub-act-tags">
                            <span className="badge badge-neutral">{act.category}</span>
                            <span>
                              <Clock size={12} /> {act.time} ({act.duration}h)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                      Free day / Leisure exploration
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Copy CTA Footer Banner */}
          <div className="copy-cta-banner card animate-slide-up">
            <div className="cta-banner-text">
              <h3 className="cta-banner-title">Love this travel plan?</h3>
              <p className="cta-banner-subtitle">
                Copy this entire itinerary to your personal GlobeTrotter account. You can customize dates, tweak activities, and track your own budget!
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg copy-btn-large"
              onClick={handleCopyTrip}
              disabled={copying}
            >
              <Copy size={18} />
              <span>{copying ? 'Cloning Itinerary...' : 'Copy Trip to My Account'}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .public-notice-bar {
          background: #0f172a;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid #334155;
          position: sticky;
          top: 60px;
          z-index: 40;
        }
        .notice-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .notice-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
        }
        .notice-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .copy-trip-btn {
          background: var(--sunset-gradient);
          border: none;
        }
        .public-hero-card {
          position: relative;
          height: 280px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .public-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .public-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.88) 100%);
        }
        .public-hero-content {
          position: absolute;
          bottom: 1.75rem;
          left: 2rem;
          right: 2rem;
          z-index: 5;
        }
        .creator-profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.6rem;
        }
        .creator-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          object-fit: cover;
        }
        .public-trip-title {
          color: #ffffff;
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.35rem;
        }
        .public-trip-desc {
          color: #cbd5e1;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          max-width: 700px;
        }
        .public-meta-pills {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .pub-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(6px);
          color: #ffffff;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .public-main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .section-title {
          font-size: 1.6rem;
          font-weight: 800;
        }
        .section-subtitle {
          font-size: 0.92rem;
          color: var(--text-muted);
        }
        .public-stops-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .public-stop-card {
          padding: 1.5rem;
          border-left: 4px solid var(--primary);
        }
        .pub-stop-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        .pub-stop-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pub-stop-info {
          flex: 1;
        }
        .pub-city-name {
          font-size: 1.3rem;
          font-weight: 800;
        }
        .pub-country {
          font-weight: 500;
          color: var(--text-muted);
        }
        .pub-dates {
          font-size: 0.85rem;
          color: var(--text-muted);
          display: block;
        }
        .pub-stop-cost {
          font-weight: 800;
          color: var(--accent-emerald);
          font-size: 1.1rem;
        }
        .pub-stop-notes {
          padding: 0.65rem 0.85rem;
          background: #f8fafc;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          color: #0369a1;
          margin: 1rem 0;
        }
        .pub-activities-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .pub-activity-card {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }
        .pub-act-thumb {
          width: 65px;
          height: 65px;
          border-radius: 8px;
          object-fit: cover;
        }
        .pub-act-body {
          flex: 1;
        }
        .pub-act-title {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .pub-act-cost {
          font-weight: 700;
          color: var(--accent-emerald);
          font-size: 0.9rem;
        }
        .pub-act-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin: 0.2rem 0 0.4rem;
        }
        .pub-act-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .copy-cta-banner {
          padding: 2.5rem 2rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .cta-banner-text {
          max-width: 600px;
        }
        .cta-banner-title {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.4rem;
        }
        .cta-banner-subtitle {
          color: #cbd5e1;
          font-size: 0.95rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default PublicTripPage;
