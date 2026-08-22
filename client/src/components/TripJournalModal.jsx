import React, { useState } from 'react';
import Modal from './Modal';
import { Camera, Sparkles, Star, MapPin, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const TripJournalModal = ({ isOpen, onClose, trip }) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(5);
  const [journalEntries, setJournalEntries] = useState([
    {
      photoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
      note: 'Sunset at Calangute beach with fresh coconut water!',
      location: 'Goa',
      rating: 5,
    },
    {
      photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
      note: 'Scuba diving at Grand Island — saw amazing coral reefs!',
      location: 'Grand Island',
      rating: 5,
    },
  ]);

  if (!trip) return null;

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    const newEntry = {
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      note: note.trim(),
      location: trip.stops?.[0]?.cityName || 'Travel Spot',
      rating: Number(rating),
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setNote('');
    setPhotoUrl('');
    toast.success('Added memory to your Trip Story!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Travel Memory & Trip Story" size="lg">
      <div className="journal-modal-body">
        <div className="journal-header-banner">
          <Camera size={22} color="#ec4899" />
          <div>
            <h3>My Trip Story — {trip.name}</h3>
            <p>Transform your itinerary and photos into a digital travel journal.</p>
          </div>
        </div>

        {/* Add Memory Form */}
        <form onSubmit={handleAddEntry} className="add-memory-form card-glass">
          <h4>Add a Memorable Moment</h4>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">
                <ImageIcon size={14} /> Photo URL
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Experience Rating</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Unforgettable)</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars (Great)</option>
                <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Memory Note / Story</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="What made this moment special? Food, sunset, conversation..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            <Sparkles size={15} /> Save to Trip Story
          </button>
        </form>

        {/* Journal Entries Grid */}
        <div className="journal-entries-grid">
          {journalEntries.map((item, idx) => (
            <div key={idx} className="journal-entry-card card">
              <img src={item.photoUrl} alt="Memory" className="entry-img" />
              <div className="entry-body">
                <div className="flex-between mb-1">
                  <span className="location-tag">
                    <MapPin size={12} /> {item.location}
                  </span>
                  <span className="rating-tag">★ {item.rating}</span>
                </div>
                <p className="entry-note">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .journal-modal-body { display: flex; flex-direction: column; gap: 1.25rem; }
        .journal-header-banner { display: flex; align-items: center; gap: 0.75rem; background: #fdf2f8; padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid #fbcfe8; color: #be185d; }
        .add-memory-form { padding: 1rem; border: 1px solid #e2e8f0; border-radius: var(--radius-md); background: #f8fafc; display: flex; flex-direction: column; gap: 0.75rem; }
        .add-memory-form h4 { font-size: 0.95rem; font-weight: 800; }
        .journal-entries-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-height: 280px; overflow-y: auto; }
        .journal-entry-card { display: flex; flex-direction: column; border-radius: var(--radius-md); overflow: hidden; }
        .entry-img { width: 100%; height: 120px; object-fit: cover; }
        .entry-body { padding: 0.75rem; }
        .location-tag { font-size: 0.75rem; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 0.2rem; }
        .rating-tag { font-size: 0.75rem; font-weight: 800; color: #f59e0b; }
        .entry-note { font-size: 0.82rem; color: #334155; line-height: 1.4; }
      `}</style>
    </Modal>
  );
};

export default TripJournalModal;
