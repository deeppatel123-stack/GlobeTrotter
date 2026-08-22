import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Luggage,
  Sparkles,
  Shirt,
  Smartphone,
  FileText,
  HeartPulse,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_CATEGORIES = [
  {
    id: 'clothing',
    name: 'Clothing & Wearables',
    icon: Shirt,
    items: [
      { id: '1', text: 'Comfortable Walking Shoes', done: true },
      { id: '2', text: 'Breathable T-shirts & Tops (4-5)', done: false },
      { id: '3', text: 'Light Jacket / Windbreaker', done: true },
      { id: '4', text: 'Swimwear & Beach Towel', done: false },
      { id: '5', text: 'Undergarments & Socks (5 pairs)', done: false },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    icon: Smartphone,
    items: [
      { id: '6', text: 'Smartphone & Fast Charger', done: true },
      { id: '7', text: 'Portable Power Bank (10,000mAh+)', done: false },
      { id: '8', text: 'Universal Travel Adapter', done: false },
      { id: '9', text: 'Noise-Cancelling Headphones', done: true },
    ],
  },
  {
    id: 'documents',
    name: 'Travel Documents & Money',
    icon: FileText,
    items: [
      { id: '10', text: 'Passport / National ID (Physical & Copy)', done: true },
      { id: '11', text: 'Flight Tickets & Hotel Bookings', done: true },
      { id: '12', text: 'Travel Insurance Documents', done: false },
      { id: '13', text: 'International Forex Card / Cash', done: false },
    ],
  },
  {
    id: 'toiletries',
    name: 'Toiletries & Healthcare',
    icon: HeartPulse,
    items: [
      { id: '14', text: 'Toothbrush & Travel Toothpaste', done: true },
      { id: '15', text: 'SPF 50+ Sunscreen & Moisturizer', done: false },
      { id: '16', text: 'First-Aid Kit & Basic Meds', done: false },
      { id: '17', text: 'Hand Sanitizer & Disinfectant Wipes', done: true },
    ],
  },
];

const PackingChecklist = ({ tripName }) => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newItemText, setNewItemText] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  const toggleItem = (catId, itemId) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, done: !item.done } : item
            ),
          };
        }
        return cat;
      })
    );
  };

  const handleAddItem = (catId) => {
    const text = newItemText[catId]?.trim();
    if (!text) return;

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            items: [
              ...cat.items,
              { id: Date.now().toString(), text, done: false },
            ],
          };
        }
        return cat;
      })
    );
    setNewItemText((prev) => ({ ...prev, [catId]: '' }));
    toast.success('Item added to packing list!');
  };

  const handleDeleteItem = (catId, itemId) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            items: cat.items.filter((item) => item.id !== itemId),
          };
        }
        return cat;
      })
    );
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedItems = categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.done).length,
    0
  );
  const percentDone = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="packing-checklist-wrapper card animate-fade">
      {/* Header */}
      <div className="flex-between packing-header">
        <div className="packing-title-box">
          <div className="icon-badge">
            <Luggage size={22} color="#0284c7" />
          </div>
          <div>
            <h3 className="checklist-title">Trip Packing & Essentials Checklist</h3>
            <p className="checklist-subtitle">
              Interactive travel checklist for {tripName || 'your journey'}. Tick items as you pack!
            </p>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="packing-progress-badge">
          <span className="progress-num">{completedItems} / {totalItems} Packed</span>
          <span className="progress-percent">({percentDone}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="checklist-progress-bar">
        <div
          className="checklist-progress-fill"
          style={{ width: `${percentDone}%` }}
        ></div>
      </div>

      {/* Categories Grid */}
      <div className="packing-categories-grid">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          const catTotal = cat.items.length;
          const catDone = cat.items.filter((i) => i.done).length;

          return (
            <div key={cat.id} className="category-checklist-card card">
              <div className="flex-between cat-head">
                <div className="cat-title-row">
                  <CatIcon size={18} className="cat-icon" />
                  <h4 className="cat-title">{cat.name}</h4>
                </div>
                <span className="cat-count-badge">
                  {catDone}/{catTotal}
                </span>
              </div>

              {/* Items List */}
              <div className="checklist-items-flow">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className={`checklist-item-row ${item.done ? 'is-done' : ''}`}
                    onClick={() => toggleItem(cat.id, item.id)}
                  >
                    <button
                      type="button"
                      className="checkbox-toggle-btn"
                      aria-label="Toggle item"
                    >
                      {item.done ? (
                        <CheckSquare size={18} color="#0284c7" />
                      ) : (
                        <Square size={18} color="#94a3b8" />
                      )}
                    </button>
                    <span className="item-text">{item.text}</span>
                    <button
                      type="button"
                      className="btn-delete-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(cat.id, item.id);
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Item Input */}
              <div className="add-item-form-row">
                <input
                  type="text"
                  placeholder="Add item..."
                  className="add-item-input"
                  value={newItemText[cat.id] || ''}
                  onChange={(e) =>
                    setNewItemText((prev) => ({
                      ...prev,
                      [cat.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddItem(cat.id);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm add-btn-compact"
                  onClick={() => handleAddItem(cat.id)}
                >
                  <Plus size={15} /> Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .packing-checklist-wrapper {
          padding: 1.75rem;
          margin-top: 1.5rem;
        }
        .packing-header {
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .packing-title-box {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .checklist-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .checklist-subtitle {
          font-size: 0.86rem;
          color: var(--text-muted);
        }
        .packing-progress-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
        }
        .checklist-progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .checklist-progress-fill {
          height: 100%;
          background: var(--primary-gradient);
          transition: width 0.4s ease;
        }
        .packing-categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .category-checklist-card {
          padding: 1.25rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
        }
        .cat-head {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .cat-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cat-icon {
          color: var(--primary);
        }
        .cat-title {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .cat-count-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          background: #ffffff;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
        }
        .checklist-items-flow {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .checklist-item-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.45rem 0.6rem;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .checklist-item-row:hover {
          border-color: var(--primary);
        }
        .checklist-item-row.is-done {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }
        .checklist-item-row.is-done .item-text {
          text-decoration: line-through;
          color: #94a3b8;
        }
        .checkbox-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }
        .item-text {
          flex: 1;
          font-size: 0.86rem;
          font-weight: 500;
          color: var(--text-main);
        }
        .btn-delete-item {
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          transition: var(--transition);
          padding: 0.2rem;
        }
        .btn-delete-item:hover {
          color: #dc2626;
        }
        .add-item-form-row {
          display: flex;
          gap: 0.4rem;
        }
        .add-item-input {
          flex: 1;
          padding: 0.4rem 0.65rem;
          font-size: 0.82rem;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-md);
          background: #ffffff;
          outline: none;
        }
        .add-item-input:focus {
          border-color: var(--primary);
        }
        .add-btn-compact {
          padding: 0.35rem 0.65rem;
          font-size: 0.78rem;
        }
      `}</style>
    </div>
  );
};

export default PackingChecklist;
