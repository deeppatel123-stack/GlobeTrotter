import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import TripCard from '../components/TripCard';
import ShareModal from '../components/ShareModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  PlusCircle,
  Search,
  Filter,
  SlidersHorizontal,
  Calendar,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';

const MyTripsPage = () => {
  const { trips, loading, fetchTrips, fetchDashboardSummary, dashboardData, duplicateTrip, deleteTrip, toggleShare } = useTrip();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [shareTripModal, setShareTripModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, tripId: null, tripName: '' });

  const navigate = useNavigate();

  // Fetch dashboard summary once on mount only
  useEffect(() => {
    fetchDashboardSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch trips whenever filters/sort change
  useEffect(() => {
    fetchTrips({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
      sort: sortBy,
    });
  }, [statusFilter, searchQuery, sortBy, fetchTrips]);

  const handleDuplicate = async (id) => {
    await duplicateTrip(id);
    fetchTrips({ status: statusFilter !== 'all' ? statusFilter : undefined, sort: sortBy });
  };

  return (
    <div className="page-container my-trips-page animate-fade">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">My Travel Itineraries</h1>
          <p className="page-subtitle">
            {dashboardData?.stats?.totalTrips > 0
              ? `You have ${dashboardData.stats.totalTrips} trip${dashboardData.stats.totalTrips !== 1 ? 's' : ''} — ${dashboardData.stats.upcomingTrips || 0} upcoming, ${dashboardData.stats.completedTrips || 0} completed.`
              : 'Manage your past, ongoing, and upcoming travel adventures in one place.'}
          </p>
        </div>
        <Link to="/trips/create" className="btn btn-primary btn-lg">
          <PlusCircle size={20} /> Plan New Trip
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-control-card card">
        {/* Search */}
        <div className="search-col">
          <div className="search-wrapper">
            <Search size={15} className="search-icon-inside" />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search by trip name (e.g. Europe, Goa, Japan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Status Pills */}
        <div className="status-pills-col">
          {['all', 'Upcoming', 'Ongoing', 'Completed', 'Draft'].map((st) => (
            <button
              key={st}
              type="button"
              className={`status-filter-pill ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'all' ? 'All Trips' : st}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="sort-view-col">
          <select
            className="sort-select-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Recently Created</option>
            <option value="oldest">Oldest First</option>
            <option value="startDate">Earliest Start Date</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
          </select>
        </div>
      </div>

      {/* Trips Content */}
      {loading ? (
        <div className="grid-responsive">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : trips.length > 0 ? (
        <div className="grid-responsive">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDuplicate={handleDuplicate}
              onShare={(t) => setShareTripModal(t)}
              onDelete={(id, name) =>
                setDeleteConfirm({ isOpen: true, tripId: id, tripName: name })
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchQuery || statusFilter !== 'all' ? 'No matching trips found' : 'No trips created yet'}
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Try resetting your filter or search query.'
              : 'You haven\'t planned any trips yet. Create your first itinerary today!'
          }
          actionLabel="Plan New Trip"
          onAction={() => navigate('/trips/create')}
        />
      )}

      {/* Share Modal */}
      {shareTripModal && (
        <ShareModal
          isOpen={!!shareTripModal}
          onClose={() => setShareTripModal(null)}
          trip={shareTripModal}
          onTogglePublic={async () => {
            await toggleShare(shareTripModal._id);
            setShareTripModal((prev) => ({ ...prev, isPublic: !prev.isPublic }));
            fetchTrips({ status: statusFilter !== 'all' ? statusFilter : undefined, sort: sortBy });
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, tripId: null, tripName: '' })}
        onConfirm={async () => {
          if (deleteConfirm.tripId) {
            await deleteTrip(deleteConfirm.tripId);
            // Refresh trips list & counts
            fetchTrips({ status: statusFilter !== 'all' ? statusFilter : undefined, sort: sortBy });
            fetchDashboardSummary();
            setDeleteConfirm({ isOpen: false, tripId: null, tripName: '' });
          }
        }}
        title="Delete Trip?"
        message={`Are you sure you want to delete "${deleteConfirm.tripName}"? This action cannot be undone.`}
        confirmText="Delete Trip"
      />

      <style>{`
        .my-trips-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .page-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        /* ── Filter Bar ── */
        .filters-control-card {
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .search-col {
          flex: 1;
          min-width: 200px;
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon-inside {
          position: absolute;
          left: 0.75rem;
          color: #94a3b8;
          pointer-events: none;
          flex-shrink: 0;
        }
        .search-input-field {
          width: 100%;
          padding: 0.55rem 0.9rem 0.55rem 2.2rem;
          font-size: 0.88rem;
          font-family: inherit;
          color: var(--text-main);
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-md);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .search-input-field:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
          background: #ffffff;
        }
        .search-input-field::placeholder {
          color: #94a3b8;
        }

        /* ── Status Pills ── */
        .status-pills-col {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .status-filter-pill {
          padding: 0.42rem 0.9rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          border: 1.5px solid transparent;
          border-radius: 999px;
          transition: all 0.15s ease;
          white-space: nowrap;
          cursor: pointer;
        }
        .status-filter-pill:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .status-filter-pill.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);
        }

        /* ── Sort Select ── */
        .sort-view-col {
          min-width: 170px;
        }
        .sort-select-field {
          width: 100%;
          padding: 0.52rem 0.85rem;
          font-size: 0.85rem;
          font-family: inherit;
          color: var(--text-main);
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-md);
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
          appearance: auto;
        }
        .sort-select-field:focus {
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default MyTripsPage;
