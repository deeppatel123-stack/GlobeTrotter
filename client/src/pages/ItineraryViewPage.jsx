import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import ShareModal from '../components/ShareModal';
import PackingChecklist from '../components/PackingChecklist';
import AiCopilotModal from '../components/AiCopilotModal';
import TripSimulatorModal from '../components/TripSimulatorModal';
import TripHealthModal from '../components/TripHealthModal';
import CollaborationModal from '../components/CollaborationModal';
import TripJournalModal from '../components/TripJournalModal';
import PlanBModal from '../components/PlanBModal';
import { formatCurrency, formatDateRange, formatDate } from '../utils/formatters';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Share2,
  Edit,
  List,
  CalendarDays,
  Printer,
  Sparkles,
  PieChart,
  CheckCircle,
  Luggage,
  Bot,
  SlidersHorizontal,
  Activity,
  Users,
  Camera,
  ShieldAlert,
} from 'lucide-react';

const ItineraryViewPage = () => {
  const { id } = useParams();
  const { currentTrip, loading, fetchTripById, toggleShare } = useTrip();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'timeline' | 'packing'
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [healthOpen, setHealthOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [planBOpen, setPlanBOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTripById(id);
    }
  }, [id, fetchTripById]);

  if (loading || !currentTrip) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading Itinerary View...</p>
      </div>
    );
  }

  const stops = currentTrip.stops || [];

  return (
    <div className="page-container itinerary-view-page animate-fade">
      {/* Itinerary Header */}
      <div className="itinerary-header-card card">
        <div className="itinerary-hero-img-wrap">
          <img
            src={currentTrip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
            alt={currentTrip.name}
            className="itinerary-hero-img"
          />
          <div className="itinerary-hero-overlay"></div>
          <div className="itinerary-hero-content">
            <div className="header-badges-row">
              <span className="badge badge-primary">{currentTrip.status}</span>
              {currentTrip.isPublic && (
                <span className="badge badge-info">Public Itinerary</span>
              )}
            </div>
            <h1 className="itinerary-hero-title">{currentTrip.name}</h1>
            <div className="itinerary-hero-meta">
              <span className="meta-pill">
                <Calendar size={15} /> {formatDateRange(currentTrip.startDate, currentTrip.endDate)}
              </span>
              <span className="meta-pill">
                <MapPin size={15} /> {stops.length} {stops.length === 1 ? 'Destination' : 'Destinations'}
              </span>
              <span className="meta-pill">
                <DollarSign size={15} /> {formatCurrency(currentTrip.estimatedCost, currentTrip.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* View Controls & Action Bar */}
        <div className="itinerary-action-bar">
          <div className="tabs-container">
            <button
              type="button"
              className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} /> Structured List
            </button>
            <button
              type="button"
              className={`tab-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <CalendarDays size={16} /> Day-by-Day Timeline
            </button>
            <button
              type="button"
              className={`tab-btn ${viewMode === 'packing' ? 'active' : ''}`}
              onClick={() => setViewMode('packing')}
            >
              <Luggage size={16} /> Packing Checklist
            </button>
          </div>

          <div className="action-buttons-group">
            <button
              type="button"
              className="btn btn-secondary btn-sm copilot-btn"
              onClick={() => setCopilotOpen(true)}
              style={{ background: '#f3e8ff', color: '#7c3aed', borderColor: '#c084fc' }}
            >
              <Bot size={15} /> AI Copilot
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSimulatorOpen(true)}
            >
              <SlidersHorizontal size={15} /> What-If Simulator
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setHealthOpen(true)}
            >
              <Activity size={15} /> Trip Health
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setCollabOpen(true)}
            >
              <Users size={15} /> Team Collab
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setJournalOpen(true)}
            >
              <Camera size={15} /> Trip Story
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setPlanBOpen(true)}
            >
              <ShieldAlert size={15} /> Plan B
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => window.print()}
            >
              <Printer size={15} /> Print / PDF
            </button>
            <Link to={`/trips/${currentTrip._id}/budget`} className="btn btn-secondary btn-sm">
              <PieChart size={15} /> Budget View
            </Link>
            <Link to={`/trips/${currentTrip._id}/builder`} className="btn btn-secondary btn-sm">
              <Edit size={15} /> Edit in Builder
            </Link>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2 size={15} /> Share Trip
            </button>
          </div>
        </div>
      </div>

      {/* Structured View by Stops */}
      {stops.length === 0 ? (
        <div className="card empty-state-box">
          <p>No stops added to this trip yet.</p>
          <Link to={`/trips/${currentTrip._id}/builder`} className="btn btn-primary btn-md">
            Go to Itinerary Builder
          </Link>
        </div>
      ) : viewMode === 'list' ? (
        <div className="itinerary-stops-sequence">
          {stops.map((stop, stopIdx) => (
            <div key={stop._id} className="itinerary-stop-section card animate-slide-up">
              {/* City Destination Banner */}
              <div className="stop-destination-header">
                <div className="destination-badge-number">{stopIdx + 1}</div>
                <div className="destination-title-col">
                  <h2 className="destination-name">
                    {stop.cityName}, <span className="destination-country">{stop.country}</span>
                  </h2>
                  <div className="destination-meta-dates">
                    <Calendar size={14} />
                    <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
                    {stop.notes && <span className="destination-notes">({stop.notes})</span>}
                  </div>
                </div>

                <div className="destination-subtotal-box">
                  <span className="subtotal-label">Stop Est. Cost</span>
                  <span className="subtotal-value">
                    {formatCurrency(stop.estimatedCost, currentTrip.currency)}
                  </span>
                </div>
              </div>

              {/* Day / Activity Blocks */}
              <div className="destination-activities-flow">
                {stop.activities && stop.activities.length > 0 ? (
                  stop.activities.map((act, actIdx) => (
                    <div key={act._id || actIdx} className="itinerary-activity-row">
                      <div className="activity-time-col">
                        <span className="time-badge">{act.time || '10:00'}</span>
                        <span className="duration-label">{act.duration}h</span>
                      </div>

                      <div className="activity-details-col">
                        <div className="flex-between">
                          <h4 className="activity-title-text">{act.name}</h4>
                          <span className="activity-cost-pill">
                            {formatCurrency(act.cost, currentTrip.currency)}
                          </span>
                        </div>
                        {act.description && (
                          <p className="activity-description-text">{act.description}</p>
                        )}
                        {act.notes && (
                          <p className="activity-notes-text">
                            <strong>Note:</strong> {act.notes}
                          </p>
                        )}
                        <div className="activity-chips-bar">
                          <span className="badge badge-neutral">{act.category}</span>
                          {act.date && (
                            <span className="badge badge-primary">{formatDate(act.date)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-activities-note">
                    No activities scheduled for this destination yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'packing' ? (
        /* Packing Checklist View */
        <PackingChecklist tripName={currentTrip.name} />
      ) : (
        /* Timeline View */
        <div className="itinerary-vertical-timeline">
          {stops.map((stop, sIdx) => (
            <div key={stop._id} className="timeline-city-group">
              <div className="timeline-city-marker">
                <div className="city-marker-dot"></div>
                <h3 className="timeline-city-heading">
                  Stop {sIdx + 1}: {stop.cityName}, {stop.country}
                </h3>
                <span className="timeline-city-dates">
                  {formatDateRange(stop.startDate, stop.endDate)}
                </span>
              </div>

              <div className="timeline-items-stream">
                {stop.activities?.map((act, aIdx) => (
                  <div key={act._id || aIdx} className="timeline-event-card card">
                    <div className="event-time-flag">{act.time || '10:00'}</div>
                    <div className="event-info">
                      <div className="flex-between">
                        <h4 className="event-title">{act.name}</h4>
                        <span className="event-cost">{formatCurrency(act.cost, currentTrip.currency)}</span>
                      </div>
                      <p className="event-desc">{act.description || act.notes}</p>
                      <span className="badge badge-neutral">{act.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Intelligence Modals */}
      {shareModalOpen && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          trip={currentTrip}
          onTogglePublic={async () => {
            await toggleShare(currentTrip._id);
          }}
        />
      )}

      {copilotOpen && (
        <AiCopilotModal
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          trip={currentTrip}
          onTripUpdated={() => fetchTripById(id)}
        />
      )}

      {simulatorOpen && (
        <TripSimulatorModal
          isOpen={simulatorOpen}
          onClose={() => setSimulatorOpen(false)}
          trip={currentTrip}
          onTripUpdated={() => fetchTripById(id)}
        />
      )}

      {healthOpen && (
        <TripHealthModal
          isOpen={healthOpen}
          onClose={() => setHealthOpen(false)}
          trip={currentTrip}
        />
      )}

      {collabOpen && (
        <CollaborationModal
          isOpen={collabOpen}
          onClose={() => setCollabOpen(false)}
          trip={currentTrip}
          onTripUpdated={() => fetchTripById(id)}
        />
      )}

      {journalOpen && (
        <TripJournalModal
          isOpen={journalOpen}
          onClose={() => setJournalOpen(false)}
          trip={currentTrip}
        />
      )}

      {planBOpen && (
        <PlanBModal
          isOpen={planBOpen}
          onClose={() => setPlanBOpen(false)}
          trip={currentTrip}
        />
      )}

      <style>{`
        .itinerary-view-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* ── Hero Card ── */
        .itinerary-header-card {
          overflow: hidden;
          border-radius: var(--radius-xl);
          border: none;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
        }
        .itinerary-hero-img-wrap {
          position: relative;
          height: 280px;
        }
        .itinerary-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .itinerary-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.88) 100%);
        }
        .itinerary-hero-content {
          position: absolute;
          bottom: 1.5rem;
          left: 1.75rem;
          right: 1.75rem;
          z-index: 5;
        }
        .header-badges-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.45rem;
        }
        .itinerary-hero-title {
          color: #ffffff;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.6rem;
          line-height: 1.2;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        .itinerary-hero-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          color: #ffffff;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* ── Action Bar ── */
        .itinerary-action-bar {
          padding: 0.9rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        /* ── Stops List ── */
        .itinerary-stops-sequence {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .itinerary-stop-section {
          border-radius: var(--radius-xl);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          border-left: 4px solid #0284c7;
        }
        .stop-destination-header {
          display: flex;
          align-items: center;
          padding: 1.1rem 1.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
          border-bottom: 1px solid #e2e8f0;
          gap: 1rem;
        }
        .destination-badge-number {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(2,132,199,0.35);
          flex-shrink: 0;
        }
        .destination-title-col {
          flex: 1;
        }
        .destination-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.3px;
        }
        .destination-country {
          font-weight: 500;
          color: #64748b;
        }
        .destination-meta-dates {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 0.2rem;
        }
        .destination-notes {
          color: #0369a1;
          font-style: italic;
        }
        .destination-subtotal-box {
          text-align: right;
          flex-shrink: 0;
        }
        .subtotal-label {
          display: block;
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .subtotal-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: #059669;
        }

        /* ── Activities Flow ── */
        .destination-activities-flow {
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .itinerary-activity-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.85rem 1rem;
          background: #f8fafc;
          border: 1px solid #e9f0f5;
          border-radius: var(--radius-lg);
          transition: all 0.15s ease;
        }
        .itinerary-activity-row:hover {
          background: #f0f9ff;
          border-color: #bae6fd;
          box-shadow: 0 2px 8px rgba(2,132,199,0.08);
        }
        .activity-time-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 52px;
          background: #e0f2fe;
          border-radius: var(--radius-md);
          padding: 0.4rem 0.5rem;
          flex-shrink: 0;
        }
        .time-badge {
          font-size: 0.82rem;
          font-weight: 800;
          color: #0284c7;
          line-height: 1;
        }
        .duration-label {
          font-size: 0.68rem;
          color: #64748b;
          margin-top: 0.1rem;
        }
        .activity-details-col {
          flex: 1;
          min-width: 0;
        }
        .activity-title-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }
        .activity-cost-pill {
          font-weight: 800;
          color: #059669;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .activity-description-text {
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 0.2rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .activity-notes-text {
          font-size: 0.78rem;
          color: #0369a1;
          background: #e0f2fe;
          padding: 0.25rem 0.55rem;
          border-radius: var(--radius-sm);
          margin-top: 0.35rem;
          display: inline-block;
        }
        .activity-chips-bar {
          display: flex;
          gap: 0.35rem;
          margin-top: 0.45rem;
          flex-wrap: wrap;
        }
        .no-activities-note {
          color: #94a3b8;
          font-size: 0.88rem;
          font-style: italic;
          padding: 0.75rem 0;
          text-align: center;
        }

        /* ── Empty State ── */
        .empty-state-box {
          padding: 3.5rem 2rem;
          text-align: center;
          border-radius: var(--radius-xl);
          border: 2px dashed #e2e8f0;
          background: #f8fafc;
        }
        .empty-state-box::before {
          content: '🗺️';
          display: block;
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }
        .empty-state-box p {
          color: #64748b;
          margin-bottom: 1.25rem;
          font-size: 0.95rem;
        }

        /* ── Vertical Timeline ── */
        .itinerary-vertical-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
          padding-left: 1.75rem;
          border-left: 2px dashed #bae6fd;
          margin-left: 0.75rem;
        }
        .timeline-city-marker {
          position: relative;
          margin-bottom: 0.75rem;
        }
        .city-marker-dot {
          position: absolute;
          left: -2.45rem;
          top: 5px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0284c7, #0369a1);
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 2px #0284c7, 0 2px 8px rgba(2,132,199,0.3);
        }
        .timeline-city-heading {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }
        .timeline-city-dates {
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 0.1rem;
        }
        .timeline-items-stream {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .timeline-event-card {
          padding: 0.85rem 1.1rem;
          display: flex;
          gap: 0.85rem;
          border-radius: var(--radius-lg);
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          transition: all 0.15s;
        }
        .timeline-event-card:hover {
          background: #f0f9ff;
          border-color: #bae6fd;
        }
        .event-time-flag {
          font-weight: 800;
          font-size: 0.85rem;
          color: #0284c7;
          min-width: 50px;
        }
        .event-info {
          flex: 1;
        }
        .event-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }
        .event-cost {
          font-weight: 800;
          color: #059669;
          font-size: 0.9rem;
        }
        .event-desc {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0.2rem 0 0.4rem;
        }
      `}</style>
    </div>
  );
};

export default ItineraryViewPage;
