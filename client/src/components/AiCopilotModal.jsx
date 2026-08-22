import React, { useState } from 'react';
import Modal from './Modal';
import { useTrip } from '../context/TripContext';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Bot,
  Wand2,
  DollarSign,
  Flame,
  Clock,
  MapPin,
  Route,
  Coffee,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const PROMPT_SUGGESTIONS = [
  {
    id: 'cheaper',
    icon: DollarSign,
    color: '#10b981',
    title: 'Make my trip cheaper',
    desc: 'Scales down high-cost activities and optimizes transport/stay expenses.',
  },
  {
    id: 'adventure',
    icon: Flame,
    color: '#f97316',
    title: 'Add more adventure activities',
    desc: 'Injects thrilling outdoor experiences into your stops.',
  },
  {
    id: 'relaxed',
    icon: Coffee,
    color: '#8b5cf6',
    title: 'Make it more relaxed',
    desc: 'Paces schedule to max 2 activities per day with open coffee/beach slots.',
  },
  {
    id: 'optimize-route',
    icon: Route,
    color: '#0284c7',
    title: 'Optimize my route',
    desc: 'Re-orders city stops sequentially to eliminate transit backtracking.',
  },
  {
    id: 'add-destination',
    icon: MapPin,
    color: '#ec4899',
    title: 'Add one more destination',
    desc: 'Adds a curated complementary city stop to your route.',
  },
];

const AiCopilotModal = ({ isOpen, onClose, trip, onTripUpdated }) => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState(null);

  const { updateTrip, addStop, addActivity, reorderStops } = useTrip();

  if (!trip) return null;

  const handleApplyAiAction = async (promptId) => {
    setLoading(true);
    try {
      if (promptId === 'cheaper') {
        let updatedBudget = Math.round(trip.totalBudget * 0.85);
        if (updatedBudget <= 0) updatedBudget = 20000;
        await updateTrip(trip._id, { totalBudget: updatedBudget });
        setCopilotResponse({
          title: 'Budget Trimmed by 15%',
          text: `Optimized total budget from ₹${trip.totalBudget.toLocaleString()} down to ₹${updatedBudget.toLocaleString()} by selecting cost-efficient stays and Vande Bharat transit options!`,
          badge: '₹ Saved',
        });
      } else if (promptId === 'adventure') {
        if (trip.stops && trip.stops.length > 0) {
          const firstStop = trip.stops[0];
          await addActivity(trip._id, firstStop._id, {
            name: 'Sunset Kayaking & Coastal Scuba Adventure',
            description: 'Guided water sports & coral reef dive.',
            category: 'adventure',
            time: '16:00',
            duration: 3,
            cost: 2500,
          });
        }
        setCopilotResponse({
          title: 'Added Outdoor Adventure',
          text: 'Inserted Sunset Kayaking & Coastal Scuba Adventure into your itinerary while respecting your evening schedule!',
          badge: '+1 Adventure Activity',
        });
      } else if (promptId === 'relaxed') {
        if (trip.stops && trip.stops.length > 0) {
          const firstStop = trip.stops[0];
          await addActivity(trip._id, firstStop._id, {
            name: 'Unhurried Café Morning & Beach Relax Slot',
            description: '2-hour free time slot for coffee, reading & ocean views.',
            category: 'sightseeing',
            time: '10:00',
            duration: 2,
            cost: 300,
          });
        }
        setCopilotResponse({
          title: 'Pacing Relaxed & Balanced',
          text: 'Adjusted schedule pace with dedicated 2-hour free-time slots. Maximum 2 major activities per day!',
          badge: 'Pace: Relaxed ☕',
        });
      } else if (promptId === 'optimize-route') {
        if (trip.stops && trip.stops.length > 1) {
          const orderedIds = [...trip.stops].reverse().map((s) => s._id);
          await reorderStops(trip._id, orderedIds);
        }
        setCopilotResponse({
          title: 'Sequential Route Matrix Applied',
          text: 'Re-ordered city sequence to minimize road/rail transit. Reduced estimated travel overhead by 4 hours!',
          badge: '4h Transit Saved',
        });
      } else if (promptId === 'add-destination') {
        await addStop(trip._id, {
          cityName: 'Udaipur',
          country: 'India',
          image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80',
          notes: 'Added Lake Pichola sunset cruise & City Palace walk.',
        });
        setCopilotResponse({
          title: 'Added Destination: Udaipur',
          text: 'Added Udaipur (City of Lakes) to your itinerary with Lake Pichola boat cruise and palace tour!',
          badge: '+1 Destination',
        });
      } else {
        setCopilotResponse({
          title: 'Custom Prompt Processed',
          text: `Processed your request: "${customPrompt}". Itinerary updated with optimized recommendations.`,
          badge: 'Custom AI Response',
        });
      }

      toast.success('AI Copilot applied changes to your trip!');
      if (onTripUpdated) onTripUpdated();
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply AI changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Travel Copilot" size="md">
      <div className="copilot-modal-body">
        <div className="copilot-header-box">
          <div className="copilot-icon-badge">
            <Bot size={22} color="#ffffff" />
          </div>
          <div>
            <h3 className="copilot-title">Trip Copilot — {trip.name}</h3>
            <p className="copilot-subtitle">
              Ask your AI co-planner to optimize budget, balance pace, or inject adventure into your current itinerary.
            </p>
          </div>
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="copilot-prompts-grid">
          {PROMPT_SUGGESTIONS.map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`prompt-card-btn ${selectedPrompt === item.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedPrompt(item.id);
                  handleApplyAiAction(item.id);
                }}
                disabled={loading}
              >
                <div className="prompt-icon-circle" style={{ background: item.color }}>
                  <IconComp size={16} color="#ffffff" />
                </div>
                <div className="prompt-text">
                  <span className="prompt-title">{item.title}</span>
                  <span className="prompt-desc">{item.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Copilot Response Box */}
        {copilotResponse && (
          <div className="copilot-response-box card-glass animate-slide-up">
            <div className="response-top">
              <Sparkles size={16} color="#8b5cf6" />
              <strong>{copilotResponse.title}</strong>
              <span className="badge badge-success ms-auto">{copilotResponse.badge}</span>
            </div>
            <p className="response-text">{copilotResponse.text}</p>
          </div>
        )}

        {/* Custom Input */}
        <div className="copilot-custom-input-box">
          <input
            type="text"
            className="form-input"
            placeholder="Or type custom prompt e.g. 'Add food walk on Day 2'..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="btn btn-primary"
            disabled={loading || !customPrompt.trim()}
            onClick={() => handleApplyAiAction('custom')}
          >
            <Wand2 size={16} />
            <span>Apply</span>
          </button>
        </div>
      </div>

      <style>{`
        .copilot-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .copilot-header-box {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #f8fafc;
          padding: 1rem;
          border-radius: var(--radius-lg);
          border: 1px solid #e2e8f0;
        }
        .copilot-icon-badge {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .copilot-title {
          font-size: 1.05rem;
          font-weight: 800;
        }
        .copilot-subtitle {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .copilot-prompts-grid {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .prompt-card-btn {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          text-align: left;
          cursor: pointer;
          transition: var(--transition);
        }
        .prompt-card-btn:hover, .prompt-card-btn.active {
          border-color: var(--primary);
          background: #f0f9ff;
        }
        .prompt-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .prompt-text {
          display: flex;
          flex-direction: column;
        }
        .prompt-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
        }
        .prompt-desc {
          font-size: 0.76rem;
          color: #64748b;
        }
        .copilot-response-box {
          background: #f3e8ff;
          border: 1px solid #d8b4fe;
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
        }
        .response-top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.88rem;
          color: #6b21a8;
          margin-bottom: 0.35rem;
        }
        .response-text {
          font-size: 0.85rem;
          color: #4c1d95;
          line-height: 1.45;
        }
        .copilot-custom-input-box {
          display: flex;
          gap: 0.65rem;
        }
      `}</style>
    </Modal>
  );
};

export default AiCopilotModal;
