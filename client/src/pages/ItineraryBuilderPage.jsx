import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import AddStopModal from '../components/AddStopModal';
import AddActivityModal from '../components/AddActivityModal';
import AddExpenseModal from '../components/AddExpenseModal';
import ShareModal from '../components/ShareModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, formatDateRange, formatDate } from '../utils/formatters';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Clock,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit,
  Share2,
  Eye,
  PieChart,
  CalendarDays,
  FileText,
  Tag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ItineraryBuilderPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const addCityParam = searchParams.get('addCity');
  const cityIdParam = searchParams.get('cityId');

  const {
    currentTrip,
    loading,
    fetchTripById,
    addStop,
    deleteStop,
    reorderStops,
    addActivity,
    removeActivity,
    addExpense,
    removeExpense,
    toggleShare,
  } = useTrip();

  const [addStopModalOpen, setAddStopModalOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);
  const [activeStopForExpense, setActiveStopForExpense] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, stopId: null, cityName: '' });

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTripById(id);
    }
  }, [id, fetchTripById]);

  // Handle URL param to auto-add city if navigated from City discovery
  useEffect(() => {
    if (addCityParam && currentTrip && currentTrip._id === id) {
      // Check if not already added
      const exists = currentTrip.stops?.some((s) => s.cityName.toLowerCase() === addCityParam.toLowerCase());
      if (!exists) {
        addStop(id, {
          cityId: cityIdParam || undefined,
          cityName: addCityParam,
          country: 'Global',
          startDate: currentTrip.startDate,
          endDate: currentTrip.endDate,
        });
      }
    }
  }, [addCityParam, cityIdParam, currentTrip, id, addStop]);

  const handleMoveStop = async (index, direction) => {
    if (!currentTrip || !currentTrip.stops) return;
    const newStops = [...currentTrip.stops];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newStops.length) return;

    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    const orderedIds = newStops.map((s) => s._id);
    await reorderStops(id, orderedIds);
  };

  if (loading || !currentTrip) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading Itinerary Builder...</p>
      </div>
    );
  }

  const stops = currentTrip.stops || [];
  const totalActivitiesCount = stops.reduce(
    (total, s) => total + (s.activities ? s.activities.length : 0),
    0
  );

  return (
    <div className="page-container itinerary-builder-page animate-fade">
      {/* Trip Hero Card */}
      <div className="trip-builder-hero card">
        <img
          src={currentTrip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
          alt={currentTrip.name}
          className="builder-hero-bg"
        />
        <div className="builder-hero-overlay"></div>

        <div className="builder-hero-content">
          <div className="builder-header-top">
            <span className="badge badge-primary">Itinerary Builder</span>
            <div className="builder-nav-pills">
              <Link to={`/trips/${currentTrip._id}/itinerary`} className="hero-nav-pill">
                <Eye size={15} /> Itinerary View
              </Link>
              <Link to={`/trips/${currentTrip._id}/budget`} className="hero-nav-pill">
                <PieChart size={15} /> Budget & Cost
              </Link>
              <Link to={`/trips/${currentTrip._id}/calendar`} className="hero-nav-pill">
                <CalendarDays size={15} /> Calendar & Timeline
              </Link>
              <button
                type="button"
                className="hero-nav-pill"
                onClick={() => setShareModalOpen(true)}
              >
                <Share2 size={15} /> Share
              </button>
            </div>
          </div>

          <h1 className="builder-trip-name">{currentTrip.name}</h1>

          <div className="builder-meta-row">
            <div className="builder-meta-item">
              <Calendar size={16} />
              <span>{formatDateRange(currentTrip.startDate, currentTrip.endDate)}</span>
            </div>
            <div className="builder-meta-item">
              <MapPin size={16} />
              <span>{stops.length} {stops.length === 1 ? 'City / Stop' : 'Cities / Stops'}</span>
            </div>
            <div className="builder-meta-item">
              <Sparkles size={16} />
              <span>{totalActivitiesCount} Activities</span>
            </div>
            <div className="builder-meta-item">
              <DollarSign size={16} />
              <span>
                Cost: {formatCurrency(currentTrip.estimatedCost, currentTrip.currency)} / Budget: {formatCurrency(currentTrip.totalBudget, currentTrip.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Builder Content Area */}
      <div className="builder-main-layout">
        {/* Stops List */}
        <div className="stops-container">
          <div className="flex-between stops-header-row">
            <div>
              <h2 className="stops-section-title">Trip Route & Destinations</h2>
              <p className="stops-section-subtitle">
                Add cities in sequence, assign activities to each stop, and organize expenses.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={() => setAddStopModalOpen(true)}
            >
              <Plus size={18} /> Add Destination Stop
            </button>
          </div>

          {stops.length === 0 ? (
            <div className="empty-stops-card card">
              <div className="empty-stops-icon">
                <MapPin size={36} />
              </div>
              <h3 className="empty-stops-title">No destinations added yet</h3>
              <p className="empty-stops-desc">
                Your itinerary is waiting for its first destination. Add a city to begin scheduling activities and managing costs!
              </p>
              <button
                type="button"
                className="btn btn-primary btn-md"
                onClick={() => setAddStopModalOpen(true)}
              >
                <Plus size={18} /> Add First Stop
              </button>
            </div>
          ) : (
            <div className="stops-list">
              {stops.map((stop, index) => (
                <div key={stop._id} className="stop-card card animate-slide-up">
                  {/* Stop Header */}
                  <div className="stop-card-header">
                    <div className="stop-number-badge">{index + 1}</div>
                    <div className="stop-header-info">
                      <h3 className="stop-city-name">
                        {stop.cityName}, <span className="stop-country">{stop.country}</span>
                      </h3>
                      <div className="stop-dates-info">
                        <Calendar size={13} />
                        <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
                        {stop.notes && <span className="stop-notes-tag">• {stop.notes}</span>}
                      </div>
                    </div>

                    <div className="stop-header-cost">
                      <span className="stop-cost-amount">
                        {formatCurrency(stop.estimatedCost, currentTrip.currency)}
                      </span>
                    </div>

                    {/* Reorder & Action Controls */}
                    <div className="stop-reorder-controls">
                      <button
                        type="button"
                        className="btn-icon"
                        disabled={index === 0}
                        onClick={() => handleMoveStop(index, 'up')}
                        title="Move stop up"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        disabled={index === stops.length - 1}
                        onClick={() => handleMoveStop(index, 'down')}
                        title="Move stop down"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon text-danger"
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            stopId: stop._id,
                            cityName: stop.cityName,
                          })
                        }
                        title="Delete stop"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Stop Body: Activities & Expenses */}
                  <div className="stop-card-body">
                    {/* Activities Sub-Section */}
                    <div className="stop-section-block">
                      <div className="flex-between stop-block-header">
                        <h4 className="stop-block-title">
                          <Compass size={15} /> Assigned Activities ({stop.activities?.length || 0})
                        </h4>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setActiveStopForActivity(stop)}
                        >
                          <Plus size={14} /> Add Activity
                        </button>
                      </div>

                      {stop.activities && stop.activities.length > 0 ? (
                        <div className="activities-list-grid">
                          {stop.activities.map((act) => (
                            <div key={act._id} className="builder-activity-item">
                              <img src={act.image} alt={act.name} className="builder-act-img" />
                              <div className="builder-act-content">
                                <h5 className="builder-act-name">{act.name}</h5>
                                <div className="builder-act-meta">
                                  <span className="badge badge-neutral">{act.category}</span>
                                  <span>
                                    <Clock size={12} /> {act.time} ({act.duration}h)
                                  </span>
                                  <span className="act-cost-val">
                                    {formatCurrency(act.cost, currentTrip.currency)}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn-icon-delete"
                                onClick={() => removeActivity(currentTrip._id, stop._id, act._id)}
                                title="Remove activity"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="empty-sub-text">
                          No activities assigned yet. Click "+ Add Activity" to schedule sightseeing, dining, and experiences.
                        </p>
                      )}
                    </div>

                    {/* Stop Expenses Sub-Section */}
                    <div className="stop-section-block">
                      <div className="flex-between stop-block-header">
                        <h4 className="stop-block-title">
                          <Tag size={15} /> Destination Expenses ({stop.expenses?.length || 0})
                        </h4>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setActiveStopForExpense(stop)}
                        >
                          <Plus size={14} /> Add Expense
                        </button>
                      </div>

                      {stop.expenses && stop.expenses.length > 0 ? (
                        <div className="expenses-table-card">
                          {stop.expenses.map((exp) => (
                            <div key={exp._id} className="expense-row-item">
                              <span className="badge badge-neutral">{exp.category}</span>
                              <span className="expense-desc">{exp.description}</span>
                              <span className="expense-amount">
                                {formatCurrency(exp.amount, currentTrip.currency)}
                              </span>
                              <button
                                type="button"
                                className="btn-icon-delete"
                                onClick={() => removeExpense(currentTrip._id, stop._id, exp._id)}
                                title="Delete expense"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="empty-sub-text">
                          No stop expenses recorded (hotel, cabs, transit). Click "+ Add Expense" to track spend.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Stop Modal */}
      <AddStopModal
        isOpen={addStopModalOpen}
        onClose={() => setAddStopModalOpen(false)}
        onAddStop={(stopData) => addStop(currentTrip._id, stopData)}
        tripDates={{ startDate: currentTrip.startDate, endDate: currentTrip.endDate }}
      />

      {/* Add Activity Modal */}
      {activeStopForActivity && (
        <AddActivityModal
          isOpen={!!activeStopForActivity}
          onClose={() => setActiveStopForActivity(null)}
          stop={activeStopForActivity}
          tripCurrency={currentTrip.currency}
          onAddActivity={(actData) =>
            addActivity(currentTrip._id, activeStopForActivity._id, actData)
          }
        />
      )}

      {/* Add Expense Modal */}
      {activeStopForExpense && (
        <AddExpenseModal
          isOpen={!!activeStopForExpense}
          onClose={() => setActiveStopForExpense(null)}
          stopName={activeStopForExpense.cityName}
          tripCurrency={currentTrip.currency}
          onAddExpense={(expData) =>
            addExpense(currentTrip._id, activeStopForExpense._id, expData)
          }
        />
      )}

      {/* Share Modal */}
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

      {/* Confirm Stop Deletion */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, stopId: null, cityName: '' })}
        onConfirm={async () => {
          if (deleteConfirm.stopId) {
            await deleteStop(currentTrip._id, deleteConfirm.stopId);
            setDeleteConfirm({ isOpen: false, stopId: null, cityName: '' });
          }
        }}
        title="Remove Destination Stop?"
        message={`Are you sure you want to remove ${deleteConfirm.cityName} from this itinerary? All associated activities will be removed.`}
        confirmText="Remove Stop"
      />

      <style>{`
        .itinerary-builder-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .trip-builder-hero {
          position: relative;
          height: 240px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }
        .builder-hero-bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .builder-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.88) 100%);
        }
        .builder-hero-content {
          position: absolute;
          inset: 0;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 5;
        }
        .builder-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .builder-nav-pills {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .hero-nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          transition: var(--transition);
        }
        .hero-nav-pill:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: translateY(-1px);
        }
        .builder-trip-name {
          color: #ffffff;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.25rem;
        }
        .builder-meta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          color: #e2e8f0;
          font-size: 0.9rem;
          flex-wrap: wrap;
        }
        .builder-meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .stops-header-row {
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .stops-section-title {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .stops-section-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }
        .empty-stops-card {
          text-align: center;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-stops-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .empty-stops-title {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }
        .empty-stops-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          max-width: 450px;
          margin-bottom: 1.5rem;
        }
        .stops-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .stop-card {
          border-left: 4px solid var(--primary);
        }
        .stop-card-header {
          display: flex;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid var(--border-color);
          gap: 1rem;
        }
        .stop-number-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .stop-header-info {
          flex: 1;
        }
        .stop-city-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .stop-country {
          font-weight: 500;
          color: var(--text-muted);
        }
        .stop-dates-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
        .stop-notes-tag {
          color: var(--primary);
          font-style: italic;
        }
        .stop-header-cost {
          padding: 0.35rem 0.85rem;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }
        .stop-cost-amount {
          font-weight: 800;
          color: var(--accent-emerald);
          font-size: 0.95rem;
        }
        .stop-reorder-controls {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .btn-icon {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .btn-icon:hover:not(:disabled) {
          background: #ffffff;
          color: var(--text-main);
          box-shadow: var(--shadow-sm);
        }
        .btn-icon:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .stop-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .stop-block-header {
          margin-bottom: 0.85rem;
        }
        .stop-block-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .activities-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 0.75rem;
        }
        .builder-activity-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }
        .builder-act-img {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
        }
        .builder-act-content {
          flex: 1;
        }
        .builder-act-name {
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.25;
        }
        .builder-act-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
        .act-cost-val {
          font-weight: 700;
          color: var(--accent-emerald);
          margin-left: auto;
        }
        .btn-icon-delete {
          color: #94a3b8;
          padding: 0.3rem;
          border-radius: 4px;
          transition: var(--transition);
        }
        .btn-icon-delete:hover {
          color: #dc2626;
          background: #fee2e2;
        }
        .expenses-table-card {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .expense-row-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
        }
        .expense-desc {
          flex: 1;
          font-size: 0.88rem;
          font-weight: 500;
        }
        .expense-amount {
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--accent-emerald);
        }
        .empty-sub-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
          padding: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default ItineraryBuilderPage;
