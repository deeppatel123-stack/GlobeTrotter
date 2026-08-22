import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { activityService } from '../services/activityService';
import { Clock, DollarSign, Tag, Calendar, Sparkles, CheckCircle2, FileText, Compass } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const AddActivityModal = ({ isOpen, onClose, onAddActivity, stop = {}, tripCurrency = 'INR' }) => {
  const [tab, setTab] = useState('browse'); // 'browse' | 'custom'
  const [cityActivities, setCityActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCatalogAct, setSelectedCatalogAct] = useState(null);

  // Custom Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('sightseeing');
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState('2');
  const [cost, setCost] = useState('0');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCityActivities = async () => {
        if (stop?.city) {
          setLoading(true);
          try {
            const cityId = typeof stop.city === 'object' ? stop.city._id : stop.city;
            const res = await activityService.getActivities({ cityId, limit: 20 });
            if (res.success) {
              setCityActivities(res.data);
            }
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchCityActivities();
      setDate(stop?.startDate ? stop.startDate.split('T')[0] : '');
      setSelectedCatalogAct(null);
      setName('');
      setCost('0');
      setNotes('');
      setTab('browse');
    }
  }, [isOpen, stop]);

  const handleSelectCatalog = (act) => {
    if (selectedCatalogAct?._id === act._id) {
      setSelectedCatalogAct(null);
      setName('');
      setCost('0');
    } else {
      setSelectedCatalogAct(act);
      setName(act.name);
      setCategory(act.category);
      setDuration(act.duration?.toString() || '2');
      setCost(act.estimatedCost?.toString() || '0');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const actData = {
        activityId: selectedCatalogAct ? selectedCatalogAct._id : undefined,
        name: name.trim(),
        category,
        image: selectedCatalogAct ? selectedCatalogAct.image : undefined,
        time: time || '10:00',
        duration: Number(duration) || 2,
        cost: Number(cost) || 0,
        notes: notes.trim(),
        date: date || undefined,
      };

      await onAddActivity(actData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Activity to ${stop?.cityName || 'Itinerary'}`}
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
            disabled={!name.trim() || isSubmitting}
            style={{ minWidth: 150 }}
          >
            {isSubmitting ? 'Adding...' : 'Add Activity'}
          </button>
        </>
      }
    >
      {/* Segmented Mode Selector Tabs */}
      <div className="activity-tabs-segmented">
        <button
          type="button"
          className={`activity-tab-btn ${tab === 'browse' ? 'active' : ''}`}
          onClick={() => setTab('browse')}
        >
          <Sparkles size={15} />
          <span>Recommended Things to Do</span>
        </button>
        <button
          type="button"
          className={`activity-tab-btn ${tab === 'custom' ? 'active' : ''}`}
          onClick={() => {
            setTab('custom');
            setSelectedCatalogAct(null);
          }}
        >
          <Tag size={15} />
          <span>Custom Activity</span>
        </button>
      </div>

      {tab === 'browse' && (
        <div className="catalog-activities-section">
          <div className="catalog-section-header">
            <span className="catalog-section-title">
              Top curated experiences in {stop?.cityName || 'this destination'}:
            </span>
            {cityActivities.length > 0 && (
              <span className="catalog-count-pill">{cityActivities.length} available</span>
            )}
          </div>

          {loading ? (
            <div className="catalog-loading-box">
              <p>Loading curated experiences...</p>
            </div>
          ) : cityActivities.length > 0 ? (
            <div className="catalog-picker-list">
              {cityActivities.map((act) => {
                const isSelected = selectedCatalogAct?._id === act._id;
                return (
                  <div
                    key={act._id}
                    className={`catalog-picker-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectCatalog(act)}
                  >
                    <div className="catalog-item-img-wrap">
                      <img src={act.image} alt={act.name} className="catalog-picker-thumb" />
                      {isSelected && (
                        <div className="catalog-selected-check">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                    <div className="catalog-picker-content">
                      <div className="catalog-picker-top">
                        <h5 className="catalog-picker-title">{act.name}</h5>
                        <span className="picker-cost">{formatCurrency(act.estimatedCost, tripCurrency)}</span>
                      </div>
                      <div className="catalog-picker-meta">
                        <span className="badge badge-neutral">{act.category}</span>
                        <span className="catalog-duration">
                          <Clock size={12} /> {act.duration}h
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="catalog-empty-box">
              <Compass size={24} className="catalog-empty-icon" />
              <p>No pre-listed experiences found for this destination yet.</p>
              <span>You can create a custom activity below!</span>
            </div>
          )}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="activity-form">
        <div className="form-group">
          <label className="form-label">
            <Tag size={14} /> Activity / Experience Name *
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Scuba diving, Museum tour, Sunset dinner"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="sightseeing">Sightseeing</option>
              <option value="food">Food & Dining</option>
              <option value="adventure">Adventure & Sport</option>
              <option value="culture">Culture & History</option>
              <option value="nature">Nature & Parks</option>
              <option value="shopping">Shopping</option>
              <option value="nightlife">Nightlife</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} /> Activity Date
            </label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-cols-3">
          <div className="form-group">
            <label className="form-label">
              <Clock size={14} /> Start Time
            </label>
            <input
              type="time"
              className="form-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (Hours)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={14} /> Cost ({tripCurrency})
            </label>
            <input
              type="number"
              min="0"
              className="form-input"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <FileText size={14} /> Notes & Instructions (Optional)
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Booking reference, meeting point, tickets..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>

      <style>{`
        /* ── Segmented Tabs ── */
        .activity-tabs-segmented {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f1f5f9;
          padding: 0.3rem;
          border-radius: var(--radius-lg);
          gap: 0.3rem;
          margin-bottom: 1.25rem;
          border: 1px solid #e2e8f0;
        }
        .activity-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 0.85rem;
          font-size: 0.86rem;
          font-weight: 600;
          color: #64748b;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .activity-tab-btn:hover {
          color: #0f172a;
          background: rgba(255, 255, 255, 0.5);
        }
        .activity-tab-btn.active {
          background: #ffffff;
          color: #0284c7;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          font-weight: 700;
        }

        /* ── Catalog Section ── */
        .catalog-activities-section {
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .catalog-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.65rem;
        }
        .catalog-section-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .catalog-count-pill {
          font-size: 0.72rem;
          font-weight: 600;
          background: #e0f2fe;
          color: #0284c7;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
        }

        /* ── Catalog List ── */
        .catalog-picker-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          max-height: 190px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          padding: 0.45rem;
          background: #f8fafc;
          scrollbar-width: thin;
        }
        .catalog-picker-list::-webkit-scrollbar {
          width: 4px;
        }
        .catalog-picker-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .catalog-picker-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.65rem;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .catalog-picker-item:hover {
          border-color: #7dd3fc;
          background: #f0f9ff;
          transform: translateY(-1px);
        }
        .catalog-picker-item.selected {
          background: #f0f9ff;
          border-color: #0284c7;
          box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
        }

        .catalog-item-img-wrap {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .catalog-picker-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .catalog-selected-check {
          position: absolute;
          inset: 0;
          background: rgba(2, 132, 199, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .catalog-picker-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          gap: 0.2rem;
        }
        .catalog-picker-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .catalog-picker-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .picker-cost {
          font-weight: 800;
          color: #059669;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .catalog-picker-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .catalog-duration {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        /* ── Empty & Loading States ── */
        .catalog-loading-box {
          text-align: center;
          padding: 1.5rem;
          font-size: 0.85rem;
          color: #64748b;
        }
        .catalog-empty-box {
          text-align: center;
          padding: 1.5rem 1rem;
          background: #f8fafc;
          border-radius: var(--radius-lg);
          border: 1px dashed #cbd5e1;
        }
        .catalog-empty-icon {
          color: #94a3b8;
          margin-bottom: 0.35rem;
        }
        .catalog-empty-box p {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.15rem;
        }
        .catalog-empty-box span {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        /* ── Activity Form ── */
        .activity-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
      `}</style>
    </Modal>
  );
};

export default AddActivityModal;
