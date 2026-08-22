import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useTrip } from '../context/TripContext';
import CityCard from '../components/CityCard';
import CityDetailModal from '../components/CityDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  User,
  Mail,
  Lock,
  Globe,
  Heart,
  Trash2,
  Save,
  Shield,
  Sparkles,
  Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
];

const ProfileSettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { dashboardData, fetchDashboardSummary } = useTrip();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'saved' | 'security'
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || AVATAR_PRESETS[0]);
  const [languagePreference, setLanguagePreference] = useState(user?.languagePreference || 'English');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Saved Destinations
  const [savedCities, setSavedCities] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [selectedCityModal, setSelectedCityModal] = useState(null);

  // Delete Account modal
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfilePhoto(user.profilePhoto || AVATAR_PRESETS[0]);
      setLanguagePreference(user.languagePreference || 'English');
    }
  }, [user]);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoadingSaved(true);
      try {
        const res = await authService.getSavedDestinations();
        if (res.success) {
          setSavedCities(res.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSaved(false);
      }
    };

    if (activeTab === 'saved') {
      fetchSaved();
    }
  }, [activeTab, user?.savedDestinations]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSaving(true);
    await updateProfile({
      name: name.trim(),
      email: email.trim(),
      profilePhoto,
      languagePreference,
      password: newPassword ? newPassword : undefined,
    });
    setNewPassword('');
    setConfirmNewPassword('');
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await authService.deleteAccount();
      if (res.success) {
        toast.success('Your account has been deleted.');
        logout();
      }
    } catch (e) {
      toast.error('Failed to delete account');
    } finally {
      setDeleting(false);
      setDeleteAccountModalOpen(false);
    }
  };

  return (
    <div className="page-container profile-settings-page animate-fade">
      {/* Header */}
      <div className="profile-header-card card">
        <div className="profile-user-summary">
          <img src={profilePhoto} alt={name} className="profile-big-avatar" />
          <div className="profile-title-col">
            <h1 className="profile-full-name">{name}</h1>
            <p className="profile-email-text">{email}</p>
            <div className="profile-badge-row">
              <span className="badge badge-primary">{user?.role}</span>
              <span className="badge badge-neutral">{languagePreference}</span>
              <span className="badge badge-success">
                <Heart size={12} /> {user?.savedDestinations?.length || 0} Saved Cities
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="tabs-container profile-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} /> Edit Profile
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Heart size={16} /> Saved Destinations ({user?.savedDestinations?.length || 0})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} /> Account & Privacy
          </button>
        </div>
      </div>

      {/* Tab 1: Profile Edit */}
      {activeTab === 'profile' && (
        <div className="profile-form-card card animate-slide-up">
          <h2 className="form-card-title">Personal Profile & Preferences</h2>
          <p className="form-card-desc">Update your traveler display identity and localized language.</p>

          <form onSubmit={handleSaveProfile} className="profile-edit-form">
            {/* Avatar Selector */}
            <div className="form-group">
              <label className="form-label">
                <Camera size={16} /> Choose Profile Avatar
              </label>
              <div className="avatar-presets-grid">
                {AVATAR_PRESETS.map((preset, i) => (
                  <img
                    key={i}
                    src={preset}
                    alt={`Avatar ${i}`}
                    className={`avatar-preset-thumb ${profilePhoto === preset ? 'selected' : ''}`}
                    onClick={() => setProfilePhoto(preset)}
                  />
                ))}
              </div>
              <input
                type="url"
                className="form-input"
                style={{ marginTop: '0.6rem' }}
                placeholder="Or paste custom image URL (https://...)"
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
              />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">
                  <User size={15} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={15} /> Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Globe size={15} /> Language Preference
              </label>
              <select
                className="form-select"
                value={languagePreference}
                onChange={(e) => setLanguagePreference(e.target.value)}
              >
                <option value="English">English (Default)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Japanese">Japanese (日本語)</option>
              </select>
            </div>

            {/* Optional Change Password */}
            <div className="password-change-box">
              <h4 className="password-section-title">Change Password (Optional)</h4>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">
                    <Lock size={15} /> New Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Leave blank to keep unchanged"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Repeat new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={saving}
              >
                <Save size={18} />
                <span>{saving ? 'Saving changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Saved Destinations */}
      {activeTab === 'saved' && (
        <div className="saved-destinations-section animate-slide-up">
          <div className="section-header-flex" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h2 className="section-heading">My Favorite Destinations</h2>
              <p className="section-subheading">
                Quickly review bookmarked cities to add them into your upcoming itineraries.
              </p>
            </div>
          </div>

          {loadingSaved ? (
            <p>Loading saved destinations...</p>
          ) : savedCities.length > 0 ? (
            <div className="grid-responsive">
              {savedCities.map((city) => (
                <CityCard
                  key={city._id}
                  city={city}
                  onSelectCity={(c) => setSelectedCityModal(c)}
                  onAddToTrip={(c) => {
                    if (dashboardData?.recentTrips && dashboardData.recentTrips.length > 0) {
                      const t = dashboardData.recentTrips[0];
                      window.location.href = `/trips/${t._id}/builder?addCity=${encodeURIComponent(c.name)}&cityId=${c._id}`;
                    } else {
                      window.location.href = `/trips/create?city=${encodeURIComponent(c.name)}`;
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="card empty-state-box" style={{ padding: '3rem', textAlign: 'center' }}>
              <Heart size={44} color="#f43f5e" style={{ margin: '0 auto 1rem' }} />
              <h3>No saved destinations yet</h3>
              <p style={{ color: '#64748b', margin: '0.4rem 0 1.25rem' }}>
                Browse our destination explorer and click the heart icon on any city to bookmark it here!
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => (window.location.href = '/explore/cities')}
              >
                Explore Destinations
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Security & Delete Account */}
      {activeTab === 'security' && (
        <div className="security-section-card card animate-slide-up">
          <h2 className="form-card-title">Privacy & Danger Zone</h2>
          <p className="form-card-desc">Manage data sovereignty and permanent account closure.</p>

          <div className="danger-zone-box">
            <div className="danger-info">
              <h4 className="danger-title">Delete Account & Travel Data</h4>
              <p className="danger-desc">
                Permanently delete your profile, all created trips, itinerary stops, and saved expense records from the database.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setDeleteAccountModalOpen(true)}
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>
      )}

      {/* City Detail Modal */}
      {selectedCityModal && (
        <CityDetailModal
          isOpen={!!selectedCityModal}
          onClose={() => setSelectedCityModal(null)}
          city={selectedCityModal}
          onAddToTrip={(c) => {
            if (dashboardData?.recentTrips && dashboardData.recentTrips.length > 0) {
              const t = dashboardData.recentTrips[0];
              window.location.href = `/trips/${t._id}/builder?addCity=${encodeURIComponent(c.name)}&cityId=${c._id}`;
            } else {
              window.location.href = `/trips/create?city=${encodeURIComponent(c.name)}`;
            }
          }}
        />
      )}

      {/* Confirm Delete Account Modal */}
      <ConfirmDialog
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete GlobeTrotter Account?"
        message="Are you completely sure? This will delete all your trips, stops, and saved records permanently from MongoDB. This action cannot be reversed."
        confirmText="Permanently Delete"
        isLoading={deleting}
      />

      <style>{`
        .profile-settings-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .profile-header-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .profile-user-summary {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .profile-big-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: var(--shadow-md);
          border: 3px solid #ffffff;
        }
        .profile-full-name {
          font-size: 1.8rem;
          font-weight: 800;
        }
        .profile-email-text {
          font-size: 0.92rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .profile-badge-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .profile-tabs {
          width: fit-content;
        }
        .profile-form-card, .security-section-card {
          padding: 2rem;
        }
        .form-card-title {
          font-size: 1.35rem;
          font-weight: 800;
        }
        .form-card-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .avatar-presets-grid {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 0.35rem;
        }
        .avatar-preset-thumb {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          cursor: pointer;
          border: 3px solid transparent;
          transition: var(--transition);
        }
        .avatar-preset-thumb:hover {
          transform: scale(1.1);
        }
        .avatar-preset-thumb.selected {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.3);
        }
        .password-change-box {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
        }
        .password-section-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .form-actions {
          margin-top: 1.5rem;
        }
        .danger-zone-box {
          padding: 1.5rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .danger-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #991b1b;
        }
        .danger-desc {
          font-size: 0.88rem;
          color: #b91c1c;
          margin-top: 0.2rem;
          max-width: 600px;
        }
      `}</style>
    </div>
  );
};

export default ProfileSettingsPage;
