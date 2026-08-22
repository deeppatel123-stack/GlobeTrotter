import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { cityService } from '../services/cityService';
import { Search, MapPin, Calendar, FileText, CheckCircle2, Globe } from 'lucide-react';

const AddStopModal = ({ isOpen, onClose, onAddStop, tripDates = {} }) => {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [customCityName, setCustomCityName] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCities = async () => {
        setLoadingCities(true);
        try {
          const res = await cityService.getCities({ limit: 30 });
          if (res.success) setCities(res.data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingCities(false);
        }
      };
      fetchCities();
      setStartDate(tripDates.startDate ? tripDates.startDate.split('T')[0] : '');
      setEndDate(tripDates.endDate ? tripDates.endDate.split('T')[0] : '');
      setSelectedCity(null);
      setSearchQuery('');
      setCustomCityName('');
      setCustomCountry('');
      setNotes('');
    }
  }, [isOpen, tripDates]);

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity && !customCityName.trim()) return;
    setIsSubmitting(true);
    try {
      const stopData = {
        cityId: selectedCity ? selectedCity._id : undefined,
        cityName: selectedCity ? selectedCity.name : customCityName.trim(),
        country: selectedCity ? selectedCity.country : customCountry.trim() || 'Global',
        image: selectedCity ? selectedCity.image : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        notes: notes.trim(),
      };
      await onAddStop(stopData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = (selectedCity || customCityName.trim()) && !isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Destination Stop"
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ minWidth: 160 }}
          >
            {isSubmitting ? (
              <span style={{ opacity: 0.8 }}>Adding...</span>
            ) : (
              <>
                <MapPin size={15} /> Add to Itinerary
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="add-stop-form">

        {/* ── Section 1: Choose City ── */}
        <div className="stop-section-label">
          <MapPin size={14} />
          <span>Choose Destination City</span>
        </div>

        {/* Sticky Search */}
        <div className="stop-search-wrapper">
          <Search size={15} className="stop-search-icon" />
          <input
            type="text"
            className="stop-search-input"
            placeholder="Search city or country — Tokyo, Paris, Goa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="stop-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        {/* City Grid */}
        <div className="cities-selection-grid">
          {loadingCities ? (
            <div className="cities-loading">
              <span>Loading cities...</span>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="cities-empty">No cities found for "{searchQuery}"</div>
          ) : (
            filteredCities.slice(0, 6).map((city) => {
              const isSelected = selectedCity?._id === city._id;
              return (
                <div
                  key={city._id}
                  className={`city-select-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCity(isSelected ? null : city);
                    setCustomCityName('');
                    setCustomCountry('');
                  }}
                >
                  <div className="city-card-img-wrap">
                    <img src={city.image} alt={city.name} className="city-card-img" />
                    {isSelected && (
                      <div className="city-card-check">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </div>
                  <div className="city-card-info">
                    <span className="city-card-name">{city.name}</span>
                    <span className="city-card-country">{city.country}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected City Confirmation */}
        {selectedCity && (
          <div className="selected-city-banner">
            <img src={selectedCity.image} alt={selectedCity.name} className="selected-city-thumb" />
            <div>
              <div className="selected-city-label">Selected Destination</div>
              <div className="selected-city-name">{selectedCity.name}, {selectedCity.country}</div>
            </div>
            <button
              type="button"
              className="selected-city-clear"
              onClick={() => setSelectedCity(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="custom-city-divider">
          <span>Or enter a custom city</span>
        </div>

        {/* Custom City */}
        <div className="stop-two-col">
          <div className="form-group">
            <label className="form-label">
              <Globe size={13} /> City Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Udaipur, Kyoto, Nice"
              value={customCityName}
              onChange={(e) => {
                setCustomCityName(e.target.value);
                setSelectedCity(null);
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <MapPin size={13} /> Country
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. India, Japan, France"
              value={customCountry}
              onChange={(e) => setCustomCountry(e.target.value)}
            />
          </div>
        </div>

        {/* ── Section 2: Dates ── */}
        <div className="stop-section-label" style={{ marginTop: '0.25rem' }}>
          <Calendar size={14} />
          <span>Stop Dates</span>
        </div>
        <div className="stop-two-col">
          <div className="form-group">
            <label className="form-label">Arrival Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Departure Date</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* ── Section 3: Notes ── */}
        <div className="form-group">
          <label className="form-label">
            <FileText size={13} /> Notes & Accommodation
            <span className="form-label-optional">optional</span>
          </label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="Hotel name, neighborhood, transport notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>

      <style>{`
        .add-stop-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        /* ── Section Label ── */
        .stop-section-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: -0.25rem;
        }

        /* ── Search Bar ── */
        .stop-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .stop-search-icon {
          position: absolute;
          left: 0.75rem;
          color: #94a3b8;
          pointer-events: none;
          flex-shrink: 0;
        }
        .stop-search-input {
          width: 100%;
          padding: 0.6rem 2.5rem 0.6rem 2.2rem;
          font-size: 0.88rem;
          font-family: inherit;
          color: #0f172a;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-lg);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .stop-search-input:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2,132,199,0.1);
          background: #ffffff;
        }
        .stop-search-input::placeholder {
          color: #94a3b8;
        }
        .stop-search-clear {
          position: absolute;
          right: 0.65rem;
          font-size: 1.1rem;
          color: #94a3b8;
          line-height: 1;
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          transition: color 0.1s;
        }
        .stop-search-clear:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        /* ── City Cards Grid ── */
        .cities-selection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.55rem;
          max-height: 176px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .cities-selection-grid::-webkit-scrollbar {
          width: 4px;
        }
        .cities-selection-grid::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .cities-loading,
        .cities-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 1.5rem;
          color: #94a3b8;
          font-size: 0.85rem;
        }
        .city-select-card {
          display: flex;
          flex-direction: column;
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.18s ease;
          background: #ffffff;
          position: relative;
        }
        .city-select-card:hover {
          border-color: #7dd3fc;
          box-shadow: 0 3px 10px rgba(2,132,199,0.12);
          transform: translateY(-1px);
        }
        .city-select-card.selected {
          border-color: #0284c7;
          box-shadow: 0 0 0 2px rgba(2,132,199,0.2), 0 3px 10px rgba(2,132,199,0.15);
        }
        .city-card-img-wrap {
          position: relative;
          height: 64px;
          overflow: hidden;
        }
        .city-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .city-select-card:hover .city-card-img {
          transform: scale(1.06);
        }
        .city-card-check {
          position: absolute;
          inset: 0;
          background: rgba(2,132,199,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .city-card-info {
          padding: 0.45rem 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }
        .city-card-name {
          font-weight: 700;
          font-size: 0.78rem;
          color: #0f172a;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .city-card-country {
          font-size: 0.68rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Selected Banner ── */
        .selected-city-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1.5px solid #bae6fd;
          border-radius: var(--radius-lg);
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .selected-city-thumb {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .selected-city-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #0369a1;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .selected-city-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
        }
        .selected-city-clear {
          margin-left: auto;
          font-size: 1.2rem;
          color: #94a3b8;
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          line-height: 1;
          transition: color 0.1s;
        }
        .selected-city-clear:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        /* ── Divider ── */
        .custom-city-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .custom-city-divider::before,
        .custom-city-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        /* ── Two Column Grid ── */
        .stop-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        /* ── Form Label Optional ── */
        .form-label-optional {
          margin-left: auto;
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
        }

        @media (max-width: 480px) {
          .cities-selection-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stop-two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Modal>
  );
};

export default AddStopModal;
