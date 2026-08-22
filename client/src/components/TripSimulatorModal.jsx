import React, { useState } from 'react';
import Modal from './Modal';
import { useTrip } from '../context/TripContext';
import toast from 'react-hot-toast';
import { SlidersHorizontal, Check, RotateCcw, Zap, DollarSign, Clock, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const TripSimulatorModal = ({ isOpen, onClose, trip, onTripUpdated }) => {
  const { updateTrip, addStop } = useTrip();

  const [simState, setSimState] = useState({
    extraDay: false,
    trimBudget: false,
    addDestination: false,
    flightTransport: false,
  });

  const [applying, setApplying] = useState(false);

  if (!trip) return null;

  // Calculate dynamic simulation values
  const baseCost = Number(trip.estimatedCost || 0);
  const baseBudget = Number(trip.totalBudget || 0);
  const baseStops = trip.stops ? trip.stops.length : 1;

  let simCost = baseCost;
  let simBudget = baseBudget;
  let simTransitHours = baseStops * 4;
  let simScore = 91;

  if (simState.extraDay) {
    simCost += 3500;
    simScore += 2;
  }
  if (simState.trimBudget) {
    simBudget = Math.max(10000, simBudget - 5000);
    simScore -= 2;
  }
  if (simState.addDestination) {
    simCost += 4200;
    simTransitHours += 3;
    simScore += 3;
  }
  if (simState.flightTransport) {
    simCost += 3000;
    simTransitHours = Math.max(3, simTransitHours - 6);
    simScore += 4;
  }

  const handleApplySimulation = async () => {
    setApplying(true);
    try {
      if (simState.trimBudget) {
        await updateTrip(trip._id, { totalBudget: simBudget });
      }
      if (simState.addDestination) {
        await addStop(trip._id, {
          cityName: 'Udaipur',
          country: 'India',
          image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80',
          notes: 'Simulated destination added.',
        });
      }
      toast.success('Simulation changes applied to your trip!');
      if (onTripUpdated) onTripUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply simulation changes');
    } finally {
      setApplying(false);
    }
  };

  const handleResetSimulation = () => {
    setSimState({
      extraDay: false,
      trimBudget: false,
      addDestination: false,
      flightTransport: false,
    });
    toast('Simulation reset to original trip values', { icon: '🔄' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What-If Trip Simulator" size="md">
      <div className="simulator-modal-body">
        <div className="sim-intro-box">
          <SlidersHorizontal size={20} color="#0284c7" />
          <p>
            Toggle hypothetical scenarios to simulate their impact on cost, transit time, and trip score without affecting your live itinerary.
          </p>
        </div>

        {/* Control Toggles */}
        <div className="sim-toggles-grid">
          <button
            type="button"
            className={`sim-chip-btn ${simState.extraDay ? 'active' : ''}`}
            onClick={() => setSimState({ ...simState, extraDay: !simState.extraDay })}
          >
            <span>+1 Day</span>
            <small>{simState.extraDay ? 'Added (+₹3,500)' : 'Click to simulate'}</small>
          </button>

          <button
            type="button"
            className={`sim-chip-btn ${simState.trimBudget ? 'active' : ''}`}
            onClick={() => setSimState({ ...simState, trimBudget: !simState.trimBudget })}
          >
            <span>-₹5,000 Budget Trim</span>
            <small>{simState.trimBudget ? 'Applied (-₹5,000)' : 'Click to simulate'}</small>
          </button>

          <button
            type="button"
            className={`sim-chip-btn ${simState.addDestination ? 'active' : ''}`}
            onClick={() => setSimState({ ...simState, addDestination: !simState.addDestination })}
          >
            <span>+1 Destination (Udaipur)</span>
            <small>{simState.addDestination ? 'Added (+1 Stop)' : 'Click to simulate'}</small>
          </button>

          <button
            type="button"
            className={`sim-chip-btn ${simState.flightTransport ? 'active' : ''}`}
            onClick={() => setSimState({ ...simState, flightTransport: !simState.flightTransport })}
          >
            <span>Flight Express Transit</span>
            <small>{simState.flightTransport ? 'Flight (-6h transit)' : 'Click to simulate'}</small>
          </button>
        </div>

        {/* Live Simulation Preview Box */}
        <div className="sim-preview-box">
          <div className="sim-metric-row">
            <span className="lbl">Estimated Total Cost:</span>
            <strong className="val text-emerald">{formatCurrency(simCost, trip.currency)}</strong>
          </div>
          <div className="sim-metric-row">
            <span className="lbl">Target Budget Limit:</span>
            <strong className="val text-primary">{formatCurrency(simBudget, trip.currency)}</strong>
          </div>
          <div className="sim-metric-row">
            <span className="lbl">Est. Transit Overhead:</span>
            <strong className="val">{simTransitHours} Hours</strong>
          </div>
          <div className="sim-metric-row">
            <span className="lbl">Simulated Trip Score:</span>
            <strong className="val text-purple">{Math.min(99, simScore)} / 100</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sim-actions-row">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleResetSimulation}
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm flex-1"
            onClick={handleApplySimulation}
            disabled={applying}
          >
            <Check size={16} /> <span>{applying ? 'Applying...' : 'Apply Simulation to Trip'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .simulator-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .sim-intro-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: #0369a1;
        }
        .sim-toggles-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .sim-chip-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.2rem;
          padding: 0.75rem 0.9rem;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
          cursor: pointer;
          transition: var(--transition);
        }
        .sim-chip-btn:hover, .sim-chip-btn.active {
          border-color: var(--primary);
          background: #f0f9ff;
          color: var(--primary-hover);
        }
        .sim-chip-btn small {
          font-size: 0.72rem;
          font-weight: 500;
          color: #64748b;
        }
        .sim-preview-box {
          background: #0f172a;
          color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .sim-metric-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
        }
        .sim-metric-row .lbl { color: #94a3b8; }
        .sim-metric-row .val { font-size: 1rem; font-weight: 800; }
        .text-emerald { color: #10b981; }
        .sim-actions-row {
          display: flex;
          gap: 0.75rem;
        }
      `}</style>
    </Modal>
  );
};

export default TripSimulatorModal;
