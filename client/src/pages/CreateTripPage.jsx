import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import {
  Compass,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Sparkles,
  ArrowRight,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';

const COVER_PRESETS = [
  {
    title: 'European Historic',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Tropical Golden Coast',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Modern Metropolis Skyline',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Desert Dunes & Sunset',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Majestic Mountains',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
];

const CreateTripPage = () => {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [cityName, setCityName] = useState(initialCity || 'Paris');
  const [countryName, setCountryName] = useState(initialCity ? 'France' : 'France');
  const [name, setName] = useState(initialCity ? `Journey to ${initialCity}` : 'Paris, France Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(COVER_PRESETS[0].url);
  const [currency, setCurrency] = useState('INR');
  const [totalBudget, setTotalBudget] = useState('50000');
  const [travelPersonality, setTravelPersonality] = useState('Adventure');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createTrip, addStop } = useTrip();
  const navigate = useNavigate();

  // Set default dates (today + 7 days)
  useEffect(() => {
    const today = new Date();
    const future = new Date(today);
    future.setDate(today.getDate() + 7);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(future.toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please specify a destination city and country');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be earlier than start date');
      return;
    }

    setLoading(true);
    try {
      const newTrip = await createTrip({
        name: name.trim(),
        startDate,
        endDate,
        description: description.trim(),
        coverPhoto,
        currency,
        totalBudget: Number(totalBudget) || 0,
        travelPersonality,
        isPublic,
      });

      if (newTrip && newTrip._id && cityName) {
        await addStop(newTrip._id, {
          cityName: cityName.trim(),
          country: countryName.trim() || 'Global',
        });
      }

      toast.success('Trip planned successfully!');
      // Redirect immediately to Itinerary Builder
      navigate(`/trips/${newTrip._id}/builder`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container create-trip-page animate-fade">
      <div className="create-trip-card card">
        <div className="create-trip-header">
          <div className="brand-icon-wrapper" style={{ margin: '0 auto 0.75rem' }}>
            <Compass size={28} color="#ffffff" />
          </div>
          <h1 className="create-trip-title">Create a New Trip</h1>
          <p className="create-trip-subtitle">
            Set your dates, estimate your budget, and start adding multi-city stops.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="create-trip-form">
          {/* Destination City & Country */}
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">
                <Globe size={15} /> Destination City *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Paris, Tokyo, Jaipur, Goa, Dubai"
                value={cityName}
                onChange={(e) => {
                  setCityName(e.target.value);
                  if (!name || name.includes('Journey to') || name.includes('Vacation')) {
                    setName(`${e.target.value}${countryName ? ', ' + countryName : ''} Vacation`);
                  }
                }}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Globe size={15} /> Destination Country *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. France, Japan, India, UAE, Italy"
                value={countryName}
                onChange={(e) => {
                  setCountryName(e.target.value);
                  if (cityName) {
                    setName(`${cityName}, ${e.target.value} Vacation`);
                  }
                }}
                required
              />
            </div>
          </div>

          {/* Trip Name */}
          <div className="form-group">
            <label className="form-label">
              <Compass size={16} /> Trip Title / Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Summer in Paris, Royal Rajasthan Trail"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Date Ranges */}
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={15} /> Start Date *
              </label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Calendar size={15} /> End Date *
              </label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Budget, Currency & Travel Personality */}
          <div className="grid-cols-3">
            <div className="form-group">
              <label className="form-label">
                <DollarSign size={15} /> Target Budget
              </label>
              <input
                type="number"
                min="0"
                className="form-input"
                placeholder="50000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <Sparkles size={15} /> Travel Personality
              </label>
              <select
                className="form-select"
                value={travelPersonality}
                onChange={(e) => setTravelPersonality(e.target.value)}
              >
                <option value="Adventure">🔥 Adventure</option>
                <option value="Relaxed">☕ Relaxed</option>
                <option value="Budget">👛 Budget</option>
                <option value="Luxury">✨ Luxury</option>
                <option value="Foodie">🍽️ Foodie</option>
                <option value="Nature">🏔️ Nature</option>
                <option value="Culture">🏛️ Culture</option>
                <option value="Photography">📷 Photography</option>
                <option value="Family">👨‍👩‍👧‍👦 Family</option>
                <option value="Backpacker">🎒 Backpacker</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={15} /> Trip Description & Goals (Optional)
            </label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="What are you hoping to see, experience, or celebrate on this trip?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Cover Photo Presets */}
          <div className="form-group">
            <label className="form-label">
              <ImageIcon size={15} /> Choose a Cover Photo
            </label>
            <div className="cover-presets-grid">
              {COVER_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  className={`preset-thumb-card ${coverPhoto === preset.url ? 'selected' : ''}`}
                  onClick={() => setCoverPhoto(preset.url)}
                >
                  <img src={preset.url} alt={preset.title} className="preset-img" />
                  <span className="preset-label">{preset.title}</span>
                </div>
              ))}
            </div>
            <input
              type="url"
              className="form-input"
              style={{ marginTop: '0.75rem' }}
              placeholder="Or paste custom image URL (https://...)"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
            />
          </div>

          {/* Public Toggle */}
          <div className="public-checkbox-card">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <div className="checkbox-text">
                <span className="checkbox-title">Make Trip Public & Sharable</span>
                <span className="checkbox-desc">
                  Generates a shareable URL so your friends or fellow travelers can view and copy your itinerary.
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="create-trip-actions">
            <Link to="/trips" className="btn btn-secondary btn-lg">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-lg flex-1"
              disabled={loading}
            >
              <span>{loading ? 'Creating Trip...' : 'Save & Build Itinerary'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .create-trip-page {
          max-width: 780px;
          margin: 0 auto;
        }
        .create-trip-card {
          padding: 2.5rem;
          background: #ffffff;
          box-shadow: var(--shadow-xl);
          border-radius: var(--radius-xl);
        }
        @media (max-width: 640px) {
          .create-trip-card {
            padding: 1.5rem 1.25rem;
          }
        }
        .create-trip-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .create-trip-title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--text-main);
        }
        .create-trip-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.35rem;
        }
        .cover-presets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.6rem;
        }
        .preset-thumb-card {
          position: relative;
          height: 80px;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: var(--transition);
        }
        .preset-thumb-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .preset-thumb-card.selected {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.25);
        }
        .preset-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preset-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 0.68rem;
          padding: 0.2rem 0.4rem;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .public-checkbox-card {
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          margin: 1.25rem 0 1.75rem;
        }
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          cursor: pointer;
        }
        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 3px;
          accent-color: var(--primary);
        }
        .checkbox-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-main);
          display: block;
        }
        .checkbox-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
          display: block;
        }
        .create-trip-actions {
          display: flex;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default CreateTripPage;
