import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { cityService } from '../services/cityService';
import { useTrip } from '../context/TripContext';
import CityCard from '../components/CityCard';
import CityDetailModal from '../components/CityDetailModal';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  SlidersHorizontal,
  Compass,
  DollarSign,
  Globe,
} from 'lucide-react';

const CitySearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [region, setRegion] = useState('all');
  const [costIndex, setCostIndex] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [cities, setCities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({ regions: [], countries: [] });

  const [selectedCityModal, setSelectedCityModal] = useState(null);

  const { dashboardData, fetchDashboardSummary, currency, setCurrency } = useTrip();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardSummary();
    const fetchFilters = async () => {
      try {
        const res = await cityService.getFilterOptions();
        if (res.success) {
          setFilterOptions(res.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchFilters();
  }, [fetchDashboardSummary]);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const res = await cityService.getCities({
          search: search || undefined,
          region: region !== 'all' ? region : undefined,
          costIndex: costIndex !== 'all' ? costIndex : undefined,
          sort: sortBy,
        });
        if (res.success) {
          setCities(res.data);
          setTotalCount(res.total || res.data.length);
        }
      } catch (err) {
        console.error('Error loading cities:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCities();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [search, region, costIndex, sortBy]);

  const handleAddToTrip = (city) => {
    if (dashboardData?.recentTrips && dashboardData.recentTrips.length > 0) {
      const targetTrip = dashboardData.recentTrips[0];
      navigate(`/trips/${targetTrip._id}/builder?addCity=${encodeURIComponent(city.name)}&cityId=${city._id}`);
    } else {
      navigate(`/trips/create?city=${encodeURIComponent(city.name)}`);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setRegion('all');
    setCostIndex('all');
    setSortBy('popularity');
  };

  return (
    <div className="page-container city-search-page animate-fade">
      {/* Header Banner */}
      <div className="city-search-header">
        <div className="header-badge">
          <Globe size={14} /> Destination Explorer
        </div>
        <h1 className="city-search-title">Discover Global Cities</h1>
        <p className="city-search-subtitle">
          Search iconic cities across continents, evaluate cost index, and seamlessly add them into your itineraries.
        </p>

        {/* Big Search Input */}
        <div className="big-search-box">
          <Search size={22} className="big-search-icon" />
          <input
            type="text"
            className="big-search-input"
            placeholder="Search by city name, country, or keyword (e.g. Paris, Tokyo, India, Beach)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips & Controls */}
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

          {/* Region Dropdown */}
          <div className="filter-select-group">
            <span className="filter-label">Region:</span>
            <select
              className="form-select filter-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="all">All Regions</option>
              {filterOptions.regions?.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Cost Index Dropdown with Exact Numerical Prices */}
          <div className="filter-select-group">
            <span className="filter-label">Budget:</span>
            <select
              className="form-select filter-select"
              value={costIndex}
              onChange={(e) => setCostIndex(e.target.value)}
            >
              <option value="all">Any Budget Range</option>
              {currency === 'USD' ? (
                <>
                  <option value="1">Under $25 / day (Budget)</option>
                  <option value="2">$25 – $50 / day (Affordable)</option>
                  <option value="3">$50 – $100 / day (Moderate)</option>
                  <option value="4">$100 – $200 / day (Upscale)</option>
                  <option value="5">$200+ / day (Luxury)</option>
                </>
              ) : currency === 'EUR' ? (
                <>
                  <option value="1">Under €20 / day (Budget)</option>
                  <option value="2">€20 – €45 / day (Affordable)</option>
                  <option value="3">€45 – €90 / day (Moderate)</option>
                  <option value="4">€90 – €180 / day (Upscale)</option>
                  <option value="5">€180+ / day (Luxury)</option>
                </>
              ) : currency === 'GBP' ? (
                <>
                  <option value="1">Under £18 / day (Budget)</option>
                  <option value="2">£18 – £40 / day (Affordable)</option>
                  <option value="3">£40 – £80 / day (Moderate)</option>
                  <option value="4">£80 – £160 / day (Upscale)</option>
                  <option value="5">£160+ / day (Luxury)</option>
                </>
              ) : (
                <>
                  <option value="1">Under ₹2,000 / day (Budget)</option>
                  <option value="2">₹2,000 – ₹4,000 / day (Affordable)</option>
                  <option value="3">₹4,000 – ₹8,000 / day (Moderate)</option>
                  <option value="4">₹8,000 – ₹15,000 / day (Upscale)</option>
                  <option value="5">₹15,000+ / day (Luxury)</option>
                </>
              )}
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
            <option value="cost-asc">Cost: Low to High</option>
            <option value="cost-desc">Cost: High to Low</option>
            <option value="name-asc">City Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex-between results-summary-row">
        <p className="results-count-text">
          Showing <strong>{cities.length}</strong> destinations {search && `for "${search}"`} • Prices in <strong>{currency}</strong>
        </p>
        {(search || region !== 'all' || costIndex !== 'all') && (
          <button type="button" onClick={handleResetFilters} className="btn-reset-filters">
            Reset all filters
          </button>
        )}
      </div>

      {/* Grid of City Cards */}
      {loading ? (
        <div className="grid-responsive">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : cities.length > 0 ? (
        <div className="grid-responsive">
          {cities.map((city) => (
            <CityCard
              key={city._id}
              city={city}
              currency={currency}
              onSelectCity={(c) => setSelectedCityModal(c)}
              onAddToTrip={handleAddToTrip}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No cities found"
          description="We couldn't find any destinations matching your criteria. Try adjusting your search query or filters."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* City Detail Modal */}
      {selectedCityModal && (
        <CityDetailModal
          isOpen={!!selectedCityModal}
          onClose={() => setSelectedCityModal(null)}
          city={selectedCityModal}
          currency={currency}
          onAddToTrip={handleAddToTrip}
        />
      )}

      <style>{`
        .city-search-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .city-search-header {
          text-align: center;
          padding: 2.5rem 1.5rem;
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
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
        }
        .city-search-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.4rem;
          color: #ffffff;
        }
        .city-search-subtitle {
          font-size: 0.98rem;
          color: #e0f2fe;
          max-width: 600px;
          margin: 0 auto 1.5rem;
          line-height: 1.5;
        }
        .big-search-box {
          position: relative;
          max-width: 650px;
          margin: 0 auto;
        }
        .big-search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3.25rem;
          border-radius: var(--radius-full);
          border: none;
          font-size: 1rem;
          box-shadow: var(--shadow-lg);
          outline: none;
          color: var(--text-main);
        }
        .big-search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .clear-search-btn {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
        }
        .filters-bar-card {
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .filters-left, .filters-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .filter-select-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .filter-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .filter-select {
          padding: 0.4rem 0.75rem;
          font-size: 0.85rem;
          width: auto;
        }
        .results-summary-row {
          margin-top: -0.5rem;
        }
        .results-count-text {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .btn-reset-filters {
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 600;
        }
        .btn-reset-filters:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default CitySearchPage;
