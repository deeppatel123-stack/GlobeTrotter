import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { useTrip } from '../context/TripContext';
import ActivityCard from '../components/ActivityCard';
import Modal from '../components/Modal';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  Search,
  Filter,
  Sparkles,
  Compass,
  Star,
  Clock,
  DollarSign,
  Tag,
  MapPin,
  Plus,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const ActivitySearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [minRating, setMinRating] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick View Modal & Add to Itinerary Modal
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [addToTripModalOpen, setAddToTripModalOpen] = useState(false);
  const [activityToAssign, setActivityToAssign] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedStopId, setSelectedStopId] = useState('');

  const { trips, fetchTrips, addActivity, currency, setCurrency } = useTrip();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await activityService.getActivities({
          search: search || undefined,
          category: category !== 'all' ? category : undefined,
          minRating: minRating || undefined,
          maxCost: maxCost || undefined,
          sort: sortBy,
        });
        if (res.success) {
          setActivities(res.data);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchActivities();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, category, minRating, maxCost, sortBy]);

  const handleOpenAdd = (act) => {
    setActivityToAssign(act);
    if (trips && trips.length > 0) {
      setSelectedTripId(trips[0]._id);
      if (trips[0].stops && trips[0].stops.length > 0) {
        setSelectedStopId(trips[0].stops[0]._id);
      }
      setAddToTripModalOpen(true);
    } else {
      toast('Please create a trip first to add this experience.');
      navigate('/trips/create');
    }
  };

  const handleAssignToStop = async () => {
    if (!selectedTripId || !selectedStopId || !activityToAssign) return;
    try {
      await addActivity(selectedTripId, selectedStopId, {
        activityId: activityToAssign._id,
        name: activityToAssign.name,
        category: activityToAssign.category,
        image: activityToAssign.image,
        duration: activityToAssign.duration,
        cost: activityToAssign.estimatedCost,
      });
      setAddToTripModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const selectedTrip = trips.find((t) => t._id === selectedTripId);

  return (
    <div className="page-container activity-search-page animate-fade">
      {/* Header */}
      <div className="activity-search-hero">
        <div className="header-badge">
          <Sparkles size={14} /> Things to Do & Experiences
        </div>
        <h1 className="activity-hero-title">Explore Tours, Food & Activities</h1>
        <p className="activity-hero-subtitle">
          Enrich your travel days with walking tours, foodie crawls, monuments, and outdoor adventures worldwide.
        </p>

        {/* Search */}
        <div className="big-search-box">
          <Search size={22} className="big-search-icon" />
          <input
            type="text"
            className="big-search-input"
            placeholder="Search tours, cooking class, scuba, safari, museum..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="categories-filter-bar">
        {[
          { id: 'all', label: 'All Activities' },
          { id: 'sightseeing', label: 'Sightseeing' },
          { id: 'food', label: 'Food & Dining' },
          { id: 'adventure', label: 'Adventure' },
          { id: 'culture', label: 'Culture & History' },
          { id: 'nature', label: 'Nature & Parks' },
          { id: 'entertainment', label: 'Entertainment' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-pill ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="filters-bar-card card">
        <div className="filters-left">
          {/* Currency Dropdown Selector */}
          <div className="filter-select-group">
            <span className="filter-label">Currency:</span>
            <select
              className="form-select filter-select currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">₹ INR (Rupees)</option>
              <option value="USD">$ USD (Dollars)</option>
              <option value="EUR">€ EUR (Euros)</option>
              <option value="GBP">£ GBP (Pounds)</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">Rating:</span>
            <select
              className="form-select filter-select"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4.5">★ 4.5 & Above</option>
              <option value="4.8">★ 4.8 & Above</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">Max Cost:</span>
            <select
              className="form-select filter-select"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
            >
              <option value="">Any Price</option>
              <option value="1500">Under ₹1,500 ($18)</option>
              <option value="3500">Under ₹3,500 ($42)</option>
              <option value="6000">Under ₹6,000 ($75)</option>
            </select>
          </div>
        </div>

        <div className="filters-right">
          <span className="filter-label">Sort by:</span>
          <select
            className="form-select filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity">Most Popular</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="cost-asc">Cost: Low to High</option>
            <option value="cost-desc">Cost: High to Low</option>
            <option value="duration-asc">Shortest Duration</option>
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="grid-responsive">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : activities.length > 0 ? (
        <div className="grid-responsive">
          {activities.map((act) => (
            <ActivityCard
              key={act._id}
              activity={act}
              currency={currency}
              onQuickView={(a) => setSelectedActivity(a)}
              onAddToStop={handleOpenAdd}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No activities found"
          description="Try switching categories or clearing search filters to find exciting activities."
          actionLabel="View All Activities"
          onAction={() => {
            setSearch('');
            setCategory('all');
            setMinRating('');
            setMaxCost('');
          }}
        />
      )}

      {/* Quick View Activity Details Modal */}
      {selectedActivity && (
        <Modal
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          title={selectedActivity.name}
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedActivity(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const act = selectedActivity;
                  setSelectedActivity(null);
                  handleOpenAdd(act);
                }}
              >
                <Plus size={16} /> Add to Itinerary
              </button>
            </div>
          }
        >
          <div className="activity-quickview-content">
            <img
              src={selectedActivity.image}
              alt={selectedActivity.name}
              className="quickview-img"
            />
            <div className="quickview-meta-row">
              <span className="badge badge-primary">{selectedActivity.category}</span>
              <span className="quickview-star">
                <Star size={14} fill="#f59e0b" color="#f59e0b" /> {selectedActivity.rating}
              </span>
              <span className="quickview-time">
                <Clock size={14} /> {selectedActivity.duration} Hours
              </span>
              <span className="quickview-cost">
                {formatCurrency(selectedActivity.estimatedCost, 'INR')}
              </span>
            </div>
            {selectedActivity.city && (
              <p className="quickview-city">
                <MapPin size={14} /> {selectedActivity.city.name}, {selectedActivity.city.country}
              </p>
            )}
            <p className="quickview-desc">{selectedActivity.description}</p>
          </div>
        </Modal>
      )}

      {/* Assign to Trip Stop Modal */}
      {addToTripModalOpen && activityToAssign && (
        <Modal
          isOpen={addToTripModalOpen}
          onClose={() => setAddToTripModalOpen(false)}
          title={`Add "${activityToAssign.name}" to Trip`}
          size="sm"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setAddToTripModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAssignToStop}
                disabled={!selectedTripId || !selectedStopId}
              >
                Confirm & Add
              </button>
            </>
          }
        >
          <div className="assign-stop-form">
            <div className="form-group">
              <label className="form-label">Select Trip</label>
              <select
                className="form-select"
                value={selectedTripId}
                onChange={(e) => {
                  setSelectedTripId(e.target.value);
                  const t = trips.find((item) => item._id === e.target.value);
                  if (t && t.stops && t.stops.length > 0) {
                    setSelectedStopId(t.stops[0]._id);
                  } else {
                    setSelectedStopId('');
                  }
                }}
              >
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Destination Stop</label>
              {selectedTrip?.stops && selectedTrip.stops.length > 0 ? (
                <select
                  className="form-select"
                  value={selectedStopId}
                  onChange={(e) => setSelectedStopId(e.target.value)}
                >
                  {selectedTrip.stops.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.cityName}, {s.country}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#dc2626' }}>
                  This trip has no stops yet. Please add a stop in the Itinerary Builder first.
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        .activity-search-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .activity-search-hero {
          text-align: center;
          padding: 2.5rem 1.5rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%);
          border-radius: var(--radius-xl);
          color: #ffffff;
          box-shadow: var(--shadow-xl);
        }
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(6px);
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #ccfbf1;
        }
        .activity-hero-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.4rem;
          color: #ffffff;
        }
        .activity-hero-subtitle {
          font-size: 0.98rem;
          color: #ccfbf1;
          max-width: 600px;
          margin: 0 auto 0.5rem;
          line-height: 1.5;
        }
        .categories-filter-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.25rem 0;
        }
        .category-pill {
          padding: 0.5rem 1.15rem;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-muted);
          background: #ffffff;
          border: 1px solid var(--border-color);
          white-space: nowrap;
          cursor: pointer;
          transition: var(--transition);
        }
        .category-pill:hover {
          background: #f1f5f9;
          color: var(--text-main);
          border-color: #cbd5e1;
        }
        .category-pill.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
        }
        .activity-quickview-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .quickview-img {
          width: 100%;
          height: 200px;
          border-radius: var(--radius-lg);
          object-fit: cover;
        }
        .quickview-meta-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .quickview-star {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 700;
          color: #d97706;
        }
        .quickview-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .quickview-cost {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--accent-emerald);
          margin-left: auto;
        }
        .quickview-city {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .quickview-desc {
          font-size: 0.95rem;
          color: var(--text-main);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default ActivitySearchPage;
