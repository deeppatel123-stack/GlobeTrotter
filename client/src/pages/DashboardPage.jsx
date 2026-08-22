import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { cityService } from '../services/cityService';
import StatCard from '../components/StatCard';
import TripCard from '../components/TripCard';
import CityCard from '../components/CityCard';
import CityDetailModal from '../components/CityDetailModal';
import ShareModal from '../components/ShareModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Skeleton, CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  Compass,
  PlusCircle,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Heart,
  Globe,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    trips,
    dashboardData,
    fetchDashboardSummary,
    duplicateTrip,
    deleteTrip,
    toggleShare,
  } = useTrip();

  const [recommendedCities, setRecommendedCities] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [selectedCityModal, setSelectedCityModal] = useState(null);
  const [shareTripModal, setShareTripModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, tripId: null, tripName: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardSummary();

    const fetchDestinationInspiration = async () => {
      setLoadingCities(true);
      try {
        const res = await cityService.getRecommendedCities();
        if (res.success) {
          setRecommendedCities(res.data.recommended || []);
          setPopularCities(res.data.popular || []);
        }
      } catch (err) {
        console.error('Failed to load recommended cities:', err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchDestinationInspiration();
  }, [fetchDashboardSummary]);

  const handleAddToTrip = (city) => {
    // Navigate to create trip or open existing trip selector
    if (dashboardData?.recentTrips && dashboardData.recentTrips.length > 0) {
      const activeTrip = dashboardData.recentTrips[0];
      navigate(`/trips/${activeTrip._id}/builder?addCity=${encodeURIComponent(city.name)}&cityId=${city._id}`);
    } else {
      navigate(`/trips/create?city=${encodeURIComponent(city.name)}`);
    }
  };

  const stats = dashboardData?.stats || {
    totalTrips: 0,
    upcomingTrips: 0,
    ongoingTrips: 0,
    completedTrips: 0,
    totalDestinations: 0,
    totalEstimatedSpending: 0,
    totalBudget: 0,
  };

  const recentTrips = dashboardData?.recentTrips || [];

  return (
    <div className="page-container dashboard-page animate-fade">
      {/* Welcome Hero Banner */}
      <section className="dashboard-hero-banner">
        <div className="hero-banner-content">
          <div className="hero-badge">
            <Sparkles size={14} /> GlobeTrotter Travel Studio
          </div>
          <h1 className="hero-welcome-title">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
          </h1>
          <p className="hero-welcome-subtitle">
            Where to next? Craft your dream multi-city journey, organize daily stops, and stay comfortably within budget.
          </p>
          <div className="hero-cta-group">
            <Link to="/trips/create" className="btn btn-primary btn-lg">
              <PlusCircle size={20} /> Plan New Trip
            </Link>
            <Link to="/explore/cities" className="btn btn-secondary btn-lg">
              <Globe size={18} /> Discover Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats Row */}
      <section className="dashboard-stats-grid">
        <StatCard
          title="Total Trips"
          value={stats.totalTrips}
          subtitle={`${stats.upcomingTrips} Upcoming • ${stats.ongoingTrips} Active`}
          icon={Calendar}
          color="primary"
        />
        <StatCard
          title="Destinations Planned"
          value={stats.totalDestinations}
          subtitle="Cities & Stops worldwide"
          icon={MapPin}
          color="purple"
        />
        <StatCard
          title="Estimated Spending"
          value={formatCurrency(stats.totalEstimatedSpending, 'INR')}
          subtitle={`Across ${stats.totalTrips} itineraries`}
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Total Budget Allocated"
          value={formatCurrency(stats.totalBudget, 'INR')}
          subtitle="Planned trip limits"
          icon={TrendingUp}
          color="warning"
        />
      </section>

      {/* Recent Trips Section */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <div>
            <h2 className="section-heading">My Recent Trips</h2>
            <p className="section-subheading">Continue planning or review your upcoming journeys</p>
          </div>
          <Link to="/trips" className="section-see-all-link">
            <span>View All Trips ({stats.totalTrips})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentTrips.length > 0 ? (
          <div className="grid-responsive">
            {recentTrips.slice(0, 3).map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDuplicate={duplicateTrip}
                onShare={(t) => setShareTripModal(t)}
                onDelete={(id, name) => setDeleteConfirm({ isOpen: true, tripId: id, tripName: name })}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No trips created yet"
            description="Start building your first personalized multi-city itinerary in just a few minutes."
            actionLabel="Plan Your First Trip"
            onAction={() => navigate('/trips/create')}
          />
        )}
      </section>

      {/* Recommended Destinations Carousel / Grid */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <div>
            <h2 className="section-heading">Recommended Destinations</h2>
            <p className="section-subheading">Hand-picked iconic travel cities curated for your next adventure</p>
          </div>
          <Link to="/explore/cities" className="section-see-all-link">
            <span>Explore All Cities</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loadingCities ? (
          <div className="grid-responsive">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid-responsive">
            {recommendedCities.slice(0, 3).map((city) => (
              <CityCard
                key={city._id}
                city={city}
                onSelectCity={(c) => setSelectedCityModal(c)}
                onAddToTrip={handleAddToTrip}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Global Cities */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <div>
            <h2 className="section-heading">Trending Global Hotspots</h2>
            <p className="section-subheading">The most booked destinations and popular cultural escapes</p>
          </div>
          <Link to="/explore/activities" className="section-see-all-link">
            <span>Explore Activities</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-responsive">
          {popularCities.slice(0, 3).map((city) => (
            <CityCard
              key={city._id}
              city={city}
              onSelectCity={(c) => setSelectedCityModal(c)}
              onAddToTrip={handleAddToTrip}
            />
          ))}
        </div>
      </section>

      {/* Modals */}
      {selectedCityModal && (
        <CityDetailModal
          isOpen={!!selectedCityModal}
          onClose={() => setSelectedCityModal(null)}
          city={selectedCityModal}
          onAddToTrip={handleAddToTrip}
        />
      )}

      {shareTripModal && (
        <ShareModal
          isOpen={!!shareTripModal}
          onClose={() => setShareTripModal(null)}
          trip={shareTripModal}
          onTogglePublic={async () => {
            await toggleShare(shareTripModal._id);
            setShareTripModal((prev) => ({ ...prev, isPublic: !prev.isPublic }));
          }}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, tripId: null, tripName: '' })}
        onConfirm={async () => {
          if (deleteConfirm.tripId) {
            await deleteTrip(deleteConfirm.tripId);
            fetchDashboardSummary();
            setDeleteConfirm({ isOpen: false, tripId: null, tripName: '' });
          }
        }}
        title="Delete Trip?"
        message={`Are you sure you want to delete "${deleteConfirm.tripName}"? All stops, assigned activities, and logged expenses will be removed.`}
        confirmText="Delete Itinerary"
      />

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .dashboard-hero-banner {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%);
          border-radius: var(--radius-xl);
          padding: 3.5rem 2.5rem;
          color: #ffffff;
          box-shadow: var(--shadow-xl);
          position: relative;
          overflow: hidden;
        }
        .dashboard-hero-banner::before {
          content: '';
          position: absolute;
          right: -50px;
          bottom: -50px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0) 70%);
          pointer-events: none;
        }
        .hero-banner-content {
          max-width: 680px;
          position: relative;
          z-index: 2;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #7dd3fc;
        }
        .hero-welcome-title {
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.8px;
          line-height: 1.15;
          margin-bottom: 0.75rem;
          color: #ffffff;
        }
        .hero-welcome-subtitle {
          font-size: 1.05rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }
        .hero-cta-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .dashboard-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .dashboard-stats-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-hero-banner {
            padding: 2.25rem 1.5rem;
          }
          .hero-welcome-title {
            font-size: 1.8rem;
          }
        }
        .dashboard-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .section-header-flex {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .section-heading {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .section-subheading {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
        .section-see-all-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--primary);
          transition: var(--transition);
        }
        .section-see-all-link:hover {
          gap: 0.55rem;
          color: var(--primary-hover);
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
