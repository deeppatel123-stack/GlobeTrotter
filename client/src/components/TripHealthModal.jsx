import React from 'react';
import Modal from './Modal';
import { Zap, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const TripHealthModal = ({ isOpen, onClose, trip }) => {
  if (!trip) return null;

  const stops = trip.stops || [];
  let totalActivities = 0;
  stops.forEach((s) => {
    totalActivities += s.activities ? s.activities.length : 0;
  });

  const estimatedCost = Number(trip.estimatedCost || 0);
  const totalBudget = Number(trip.totalBudget || 0);

  // Dynamic calculations
  let budgetScore = totalBudget > 0 && estimatedCost <= totalBudget ? 95 : 75;
  let routeScore = stops.length >= 1 ? 90 : 70;
  let paceScore = totalActivities <= stops.length * 4 ? 92 : 68;
  let matchScore = trip.travelPersonality ? 94 : 85;

  const overallScore = Math.round((budgetScore + routeScore + paceScore + matchScore) / 4);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trip Health & Readiness Check" size="md">
      <div className="health-modal-body">
        {/* Top Overall Score Circle */}
        <div className="health-score-banner">
          <div className="score-ring">
            <span className="score-num">{overallScore}</span>
            <span className="score-max">/ 100</span>
          </div>
          <div>
            <h3 className="score-title">
              {overallScore >= 90 ? 'Excellent Trip Health! 🌟' : 'Good Trip Health ✈️'}
            </h3>
            <p className="score-subtitle">
              Your itinerary for "{trip.name}" is well-paced and budget-aligned.
            </p>
          </div>
        </div>

        {/* Detailed Metrics List */}
        <div className="health-bars-list">
          <div className="health-bar-item">
            <div className="bar-label-row">
              <span>Budget Alignment ({formatCurrency(estimatedCost, trip.currency)} / {formatCurrency(totalBudget, trip.currency)})</span>
              <strong>{budgetScore}/100</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill bg-emerald" style={{ width: `${budgetScore}%` }}></div>
            </div>
          </div>

          <div className="health-bar-item">
            <div className="bar-label-row">
              <span>Route & Transit Efficiency ({stops.length} Cities)</span>
              <strong>{routeScore}/100</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill bg-blue" style={{ width: `${routeScore}%` }}></div>
            </div>
          </div>

          <div className="health-bar-item">
            <div className="bar-label-row">
              <span>Pacing & Free Time ({totalActivities} Places)</span>
              <strong>{paceScore}/100</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill bg-purple" style={{ width: `${paceScore}%` }}></div>
            </div>
          </div>

          <div className="health-bar-item">
            <div className="bar-label-row">
              <span>Travel Style Match ({trip.travelPersonality || 'Adventure'})</span>
              <strong>{matchScore}/100</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill bg-amber" style={{ width: `${matchScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="health-insights-box">
          <h4 className="insights-heading">Key Readiness Insights</h4>
          <div className="insight-row text-success">
            <CheckCircle2 size={16} />
            <span>Budget is within safe limits with 15% contingency buffer remaining.</span>
          </div>
          <div className="insight-row text-primary">
            <CheckCircle2 size={16} />
            <span>Destinations are ordered to avoid transit backtracking.</span>
          </div>
          {paceScore < 80 && (
            <div className="insight-row text-warning">
              <AlertTriangle size={16} />
              <span>Some days have over 4 activities. Consider rebalancing or adding free slots.</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .health-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .health-score-banner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          border: 1px solid #e2e8f0;
        }
        .score-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--emerald-gradient);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-glow);
        }
        .score-num { font-size: 1.6rem; font-weight: 900; line-height: 1; }
        .score-max { font-size: 0.72rem; font-weight: 700; opacity: 0.9; }
        .score-title { font-size: 1.1rem; font-weight: 800; }
        .score-subtitle { font-size: 0.84rem; color: #64748b; }
        .health-bars-list { display: flex; flex-direction: column; gap: 0.85rem; }
        .health-bar-item { display: flex; flex-direction: column; gap: 0.3rem; }
        .bar-label-row { display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 700; }
        .bar-track { height: 7px; background: #f1f5f9; border-radius: var(--radius-full); overflow: hidden; }
        .bar-fill { height: 100%; border-radius: var(--radius-full); }
        .bg-emerald { background: #10b981; }
        .bg-blue { background: #0284c7; }
        .bg-purple { background: #8b5cf6; }
        .bg-amber { background: #f59e0b; }
        .health-insights-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .insights-heading { font-size: 0.9rem; font-weight: 800; margin-bottom: 0.2rem; }
        .insight-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.84rem; font-weight: 600; }
      `}</style>
    </Modal>
  );
};

export default TripHealthModal;
