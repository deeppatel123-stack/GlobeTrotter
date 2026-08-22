import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import AddActivityModal from '../components/AddActivityModal';
import { formatCurrency, formatDateRange, formatDate } from '../utils/formatters';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle,
  Tag,
  DollarSign,
} from 'lucide-react';
import {
  eachDayOfInterval,
  parseISO,
  isSameDay,
  format,
  isWithinInterval,
} from 'date-fns';

const TripCalendarPage = () => {
  const { id } = useParams();
  const { currentTrip, loading, fetchTripById, addActivity, removeActivity } = useTrip();

  const [tripDays, setTripDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [addModalStop, setAddModalStop] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTripById(id);
    }
  }, [id, fetchTripById]);

  useEffect(() => {
    if (currentTrip?.startDate && currentTrip?.endDate) {
      try {
        const start = parseISO(currentTrip.startDate.split('T')[0]);
        const end = parseISO(currentTrip.endDate.split('T')[0]);
        const days = eachDayOfInterval({ start, end });
        setTripDays(days);
        if (days.length > 0 && !selectedDate) {
          setSelectedDate(days[0]);
        }
      } catch (e) {
        console.error('Date parsing error in calendar:', e);
      }
    }
  }, [currentTrip, selectedDate]);

  if (loading || !currentTrip) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading Trip Calendar & Timeline...</p>
      </div>
    );
  }

  const stops = currentTrip.stops || [];

  // Find stop for currently selected date
  const getStopForDate = (date) => {
    return stops.find((stop) => {
      if (!stop.startDate || !stop.endDate) return false;
      const sStart = parseISO(stop.startDate.split('T')[0]);
      const sEnd = parseISO(stop.endDate.split('T')[0]);
      return isWithinInterval(date, { start: sStart, end: sEnd });
    }) || stops[0];
  };

  // Get all activities on a specific day
  const getActivitiesForDate = (date) => {
    const list = [];
    stops.forEach((stop) => {
      if (stop.activities) {
        stop.activities.forEach((act) => {
          if (act.date && isSameDay(parseISO(act.date.split('T')[0]), date)) {
            list.push({ ...act, stopId: stop._id, cityName: stop.cityName });
          }
        });
      }
    });

    // If no activities explicitly dated, fallback to activities inside the active stop
    if (list.length === 0) {
      const activeStop = getStopForDate(date);
      if (activeStop?.activities) {
        activeStop.activities.forEach((act) => {
          list.push({ ...act, stopId: activeStop._id, cityName: activeStop.cityName });
        });
      }
    }

    // Sort by time
    return list.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  };

  const activeDayActivities = selectedDate ? getActivitiesForDate(selectedDate) : [];
  const currentStop = selectedDate ? getStopForDate(selectedDate) : null;

  return (
    <div className="page-container trip-calendar-page animate-fade">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <Link to={`/trips/${id}/builder`} className="back-link">
            <ArrowLeft size={16} /> Back to Itinerary Builder
          </Link>
          <h1 className="page-title">{currentTrip.name} — Interactive Calendar & Daily Timeline</h1>
          <p className="page-subtitle">
            Visualize each day hour-by-hour, reorder schedule timings, and log day events.
          </p>
        </div>

        <div className="header-actions">
          <Link to={`/trips/${id}/itinerary`} className="btn btn-secondary">
            Itinerary List View
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setAddModalStop(currentStop || stops[0])}
            disabled={stops.length === 0}
          >
            <Plus size={16} /> Add Activity to this Day
          </button>
        </div>
      </div>

      {/* Calendar Day Carousel Strip */}
      <div className="calendar-days-strip-card card">
        <h3 className="strip-title">
          <CalendarIcon size={18} /> Travel Days ({tripDays.length} Days)
        </h3>
        <div className="days-scroll-container">
          {tripDays.map((day, index) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const stopForDay = getStopForDate(day);
            const actsCount = getActivitiesForDate(day).length;

            return (
              <button
                key={index}
                type="button"
                className={`calendar-day-tab ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <span className="day-number-label">Day {index + 1}</span>
                <span className="day-date-main">{format(day, 'MMM d')}</span>
                <span className="day-weekday">{format(day, 'EEE')}</span>
                {stopForDay && (
                  <span className="day-city-chip">{stopForDay.cityName}</span>
                )}
                {actsCount > 0 && (
                  <span className="day-activity-badge">{actsCount} events</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Timeline View */}
      {selectedDate && (
        <div className="selected-day-layout">
          {/* Day Overview Card */}
          <div className="day-overview-banner card">
            <div className="flex-between">
              <div>
                <span className="badge badge-primary">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
                <h2 className="day-banner-title">
                  {currentStop ? `Exploring ${currentStop.cityName}, ${currentStop.country}` : 'Travel Day'}
                </h2>
                {currentStop?.notes && (
                  <p className="day-banner-notes">
                    <strong>Stop notes:</strong> {currentStop.notes}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setAddModalStop(currentStop || stops[0])}
              >
                <Plus size={16} /> Add Event
              </button>
            </div>
          </div>

          {/* Hour-by-Hour Timeline */}
          <div className="day-vertical-timeline card">
            <h3 className="timeline-section-title">Hourly Daily Schedule</h3>

            {activeDayActivities.length > 0 ? (
              <div className="hourly-events-list">
                {activeDayActivities.map((act, idx) => (
                  <div key={act._id || idx} className="hourly-event-row animate-slide-up">
                    <div className="event-time-column">
                      <span className="event-time-text">{act.time || '10:00'}</span>
                      <span className="event-duration-tag">{act.duration} hrs</span>
                    </div>

                    <div className="timeline-node">
                      <div className="node-circle"></div>
                      <div className="node-line"></div>
                    </div>

                    <div className="event-card-box card">
                      <img
                        src={act.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'}
                        alt={act.name}
                        className="event-thumb-img"
                      />
                      <div className="event-main-info">
                        <div className="flex-between">
                          <h4 className="event-name-text">{act.name}</h4>
                          <span className="event-cost-pill">
                            {formatCurrency(act.cost, currentTrip.currency)}
                          </span>
                        </div>
                        {act.description && (
                          <p className="event-description-text">{act.description}</p>
                        )}
                        {act.notes && (
                          <p className="event-notes-inline">
                            <strong>Note:</strong> {act.notes}
                          </p>
                        )}
                        <div className="event-tags-row">
                          <span className="badge badge-neutral">{act.category}</span>
                          <span className="badge badge-primary">
                            <MapPin size={11} /> {act.cityName}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-delete-event"
                        onClick={() => removeActivity(currentTrip._id, act.stopId, act._id)}
                        title="Remove activity from day"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-day-state">
                <p>No scheduled activities for this day yet.</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setAddModalStop(currentStop || stops[0])}
                  style={{ marginTop: '0.75rem' }}
                >
                  <Plus size={15} /> Schedule Activity
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {addModalStop && (
        <AddActivityModal
          isOpen={!!addModalStop}
          onClose={() => setAddModalStop(null)}
          stop={addModalStop}
          tripCurrency={currentTrip.currency}
          onAddActivity={(actData) =>
            addActivity(currentTrip._id, addModalStop._id, {
              ...actData,
              date: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
            })
          }
        />
      )}

      <style>{`
        .trip-calendar-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* ── Header ── */
        .page-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        /* ── Day Strip Card ── */
        .calendar-days-strip-card {
          padding: 1.35rem 1.5rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-xl);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .strip-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 1.1rem;
        }
        .days-scroll-container {
          display: flex;
          gap: 0.6rem;
          overflow-x: auto;
          padding-bottom: 0.35rem;
          scrollbar-width: thin;
        }
        .days-scroll-container::-webkit-scrollbar {
          height: 4px;
        }
        .days-scroll-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .days-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .calendar-day-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.7rem 1rem;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-lg);
          min-width: 88px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          gap: 0.1rem;
        }
        .calendar-day-tab:hover {
          background: #f0f9ff;
          border-color: #7dd3fc;
          transform: translateY(-1px);
        }
        .calendar-day-tab.selected {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border-color: #0284c7;
          box-shadow: 0 4px 14px rgba(2,132,199,0.35);
          transform: translateY(-2px);
        }
        .day-number-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .calendar-day-tab.selected .day-number-label {
          color: rgba(255,255,255,0.8);
        }
        .day-date-main {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }
        .calendar-day-tab.selected .day-date-main {
          color: #ffffff;
        }
        .day-weekday {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
        }
        .calendar-day-tab.selected .day-weekday {
          color: rgba(255,255,255,0.75);
        }
        .day-city-chip {
          margin-top: 0.35rem;
          font-size: 0.65rem;
          font-weight: 700;
          background: rgba(255,255,255,0.2);
          padding: 0.15rem 0.45rem;
          border-radius: 999px;
          color: #0f172a;
          max-width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .calendar-day-tab.selected .day-city-chip {
          background: rgba(255,255,255,0.25);
          color: #ffffff;
        }
        .day-activity-badge {
          font-size: 0.63rem;
          font-weight: 700;
          color: #10b981;
          margin-top: 0.2rem;
        }
        .calendar-day-tab.selected .day-activity-badge {
          color: #a7f3d0;
        }

        /* ── Selected Day Layout ── */
        .selected-day-layout {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* ── Day Overview Banner ── */
        .day-overview-banner {
          padding: 1.25rem 1.5rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #bae6fd;
          border-radius: var(--radius-xl);
          border-left: 4px solid #0284c7;
        }
        .day-banner-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0.3rem 0 0;
          letter-spacing: -0.3px;
        }
        .day-banner-notes {
          font-size: 0.85rem;
          color: #0369a1;
          margin-top: 0.35rem;
        }

        /* ── Timeline Card ── */
        .day-vertical-timeline {
          padding: 1.5rem 1.75rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-xl);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .timeline-section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
        }

        /* ── Hourly Events ── */
        .hourly-events-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .hourly-event-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding-bottom: 1.25rem;
        }
        .event-time-column {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: 60px;
          padding-top: 3px;
        }
        .event-time-text {
          font-size: 0.92rem;
          font-weight: 800;
          color: #0284c7;
          line-height: 1;
        }
        .event-duration-tag {
          font-size: 0.7rem;
          color: #94a3b8;
          margin-top: 0.15rem;
        }
        .timeline-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .node-circle {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #0284c7;
          border: 2.5px solid #ffffff;
          box-shadow: 0 0 0 2px #0284c7;
          margin-top: 4px;
          flex-shrink: 0;
        }
        .node-line {
          width: 2px;
          flex: 1;
          min-height: 60px;
          background: linear-gradient(to bottom, #bae6fd, #e2e8f0);
          margin-top: 4px;
        }
        .event-card-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          transition: all 0.15s ease;
          margin-bottom: 0;
        }
        .event-card-box:hover {
          background: #f0f9ff;
          border-color: #bae6fd;
          box-shadow: 0 2px 8px rgba(2,132,199,0.1);
        }
        .event-thumb-img {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .event-main-info {
          flex: 1;
          min-width: 0;
        }
        .event-name-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .event-cost-pill {
          font-weight: 800;
          color: #059669;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .event-description-text {
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 0.2rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .event-notes-inline {
          font-size: 0.78rem;
          color: #0369a1;
          margin-top: 0.2rem;
        }
        .event-tags-row {
          display: flex;
          gap: 0.35rem;
          margin-top: 0.35rem;
          flex-wrap: wrap;
        }
        .btn-delete-event {
          color: #cbd5e1;
          padding: 0.3rem;
          border-radius: 6px;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .btn-delete-event:hover {
          color: #dc2626;
          background: #fee2e2;
        }

        /* ── Empty Day State ── */
        .empty-day-state {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #94a3b8;
          font-size: 0.9rem;
        }
        .empty-day-state::before {
          content: '📅';
          display: block;
          font-size: 2rem;
          margin-bottom: 0.65rem;
        }
      `}</style>
    </div>
  );
};

export default TripCalendarPage;
