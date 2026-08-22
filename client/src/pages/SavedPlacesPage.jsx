import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles, Plus, Compass } from 'lucide-react';
import CityCard from '../components/CityCard';
import CityDetailModal from '../components/CityDetailModal';
import AddStopModal from '../components/AddStopModal';
import toast from 'react-hot-toast';

const SavedPlacesPage = () => {
  const { user, isDestinationSaved } = useAuth();
  const { trips } = useTrip();

  const [selectedCity, setSelectedCity] = useState(null);
  const [cityForAddStop, setCityForAddStop] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');

  // Extract saved destinations from user context or default popular cities
  const savedCityList = user?.savedDestinations || [];

  return (
    <div className="page-container saved-places-page animate-fade">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="page-header-badge">
            <Heart size={14} color="#f43f5e" /> My Saved Destinations
          </div>
          <h1 className="page-title">Saved Places & Bookmarks</h1>
          <p className="page-subtitle">
            Your personal bucket-list of saved cities and travel destinations ready to be added to your next itinerary.
          </p>
        </div>
        <Link to="/explore/cities" className="btn btn-primary">
          <Compass size={18} />
          <span>Explore More Cities</span>
        </Link>
      </div>

      {/* Grid of Saved Places */}
      {savedCityList.length > 0 ? (
        <div className="grid-responsive mt-1">
          {savedCityList.map((city) => (
            <CityCard
              key={city._id || city.name}
              city={city}
              onSelectCity={(c) => setSelectedCity(c)}
              onAddToTrip={(c) => {
                setCityForAddStop(c);
                if (trips && trips.length > 0) {
                  setSelectedTripId(trips[0]._id);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="card empty-saved-card">
          <div className="empty-icon-wrap">
            <Heart size={36} color="#f43f5e" />
          </div>
          <h3>No Saved Places Yet</h3>
          <p>
            When you browse cities and click the heart icon, your favorite destinations will appear here for easy planning.
          </p>
          <Link to="/explore/cities" className="btn btn-primary btn-lg mt-1">
            <MapPin size={18} />
            <span>Browse Destinations</span>
          </Link>
        </div>
      )}

      {/* Modals */}
      {selectedCity && (
        <CityDetailModal
          city={selectedCity}
          isOpen={!!selectedCity}
          onClose={() => setSelectedCity(null)}
          onAddToTrip={(c) => {
            setCityForAddStop(c);
            setSelectedCity(null);
          }}
        />
      )}

      {cityForAddStop && (
        <AddStopModal
          isOpen={!!cityForAddStop}
          onClose={() => setCityForAddStop(null)}
          city={cityForAddStop}
          trips={trips}
          selectedTripId={selectedTripId}
          onSelectTripId={setSelectedTripId}
        />
      )}

      <style>{`
        .saved-places-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .page-header-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: #ffe4e6; color: #e11d48; font-size: 0.8rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 999px; margin-bottom: 0.5rem; }
        .page-title { font-size: 1.85rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
        .page-subtitle { font-size: 0.92rem; color: #475569; margin-top: 0.25rem; }
        .empty-saved-card { padding: 3.5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #cbd5e1; }
        .empty-icon-wrap { width: 72px; height: 72px; border-radius: 50%; background: #fff1f2; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; }
        .empty-saved-card h3 { font-size: 1.35rem; font-weight: 800; color: #0f172a; }
        .empty-saved-card p { font-size: 0.92rem; color: #475569; max-width: 480px; }
      `}</style>
    </div>
  );
};

export default SavedPlacesPage;
