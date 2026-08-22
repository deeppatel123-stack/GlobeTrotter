import React, { useState } from 'react';
import Modal from './Modal';
import { ShieldAlert, RefreshCw, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const PlanBModal = ({ isOpen, onClose, trip }) => {
  const [contingencies, setContingencies] = useState([
    {
      id: 1,
      primaryName: 'Grand Island Scuba Diving & Snorkeling',
      primaryCost: 3500,
      planBName: 'Old Goa Museums & Basilica Heritage Tour',
      planBCost: 600,
      activePlan: 'Primary', // 'Primary' | 'PlanB'
    },
    {
      id: 2,
      primaryName: 'Paragliding at Solang Valley',
      primaryCost: 3200,
      planBName: 'Manali Hot Springs Bath & Old Town Cafe Walk',
      planBCost: 400,
      activePlan: 'Primary',
    },
  ]);

  if (!trip) return null;

  const handleTogglePlan = (id) => {
    setContingencies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextPlan = c.activePlan === 'Primary' ? 'PlanB' : 'Primary';
          toast.success(
            nextPlan === 'PlanB'
              ? `Switched activity to Plan B: ${c.planBName}`
              : `Switched back to Primary: ${c.primaryName}`
          );
          return { ...c, activePlan: nextPlan };
        }
        return c;
      })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plan B & Contingency Manager" size="md">
      <div className="planb-modal-body">
        <div className="planb-header-box">
          <ShieldAlert size={20} color="#d97706" />
          <div>
            <h3>Weather & Contingency Backup Plans</h3>
            <p>Easily swap outdoor activities with indoor alternatives if weather or schedules change.</p>
          </div>
        </div>

        <div className="contingencies-list">
          {contingencies.map((item) => (
            <div key={item.id} className="contingency-card card">
              <div className="contingency-row">
                <div className={`plan-box ${item.activePlan === 'Primary' ? 'active-plan' : ''}`}>
                  <span className="plan-label">Primary Option</span>
                  <strong className="plan-title">{item.primaryName}</strong>
                  <span className="plan-cost">₹{item.primaryCost}</span>
                </div>

                <div className="swap-icon-col">
                  <button
                    type="button"
                    className="swap-btn"
                    onClick={() => handleTogglePlan(item.id)}
                    title="Switch between Primary and Plan B"
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                </div>

                <div className={`plan-box ${item.activePlan === 'PlanB' ? 'active-plan-b' : ''}`}>
                  <span className="plan-label">Plan B Backup</span>
                  <strong className="plan-title">{item.planBName}</strong>
                  <span className="plan-cost">₹{item.planBCost}</span>
                </div>
              </div>

              <div className="contingency-footer">
                <span className="status-text">
                  Currently Active:{' '}
                  <strong>
                    {item.activePlan === 'Primary' ? item.primaryName : item.planBName}
                  </strong>
                </span>
                <span className={`badge ${item.activePlan === 'Primary' ? 'badge-primary' : 'badge-warning'}`}>
                  {item.activePlan === 'Primary' ? 'Primary Active' : 'Plan B Swapped'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .planb-modal-body { display: flex; flex-direction: column; gap: 1.25rem; }
        .planb-header-box { display: flex; align-items: center; gap: 0.75rem; background: #fffbe6; padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid #ffe58f; color: #d97706; font-size: 0.85rem; }
        .contingencies-list { display: flex; flex-direction: column; gap: 1rem; }
        .contingency-card { padding: 1rem; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; }
        .contingency-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.85rem; align-items: center; }
        .plan-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-md); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.2rem; }
        .active-plan { background: #e0f2fe; border-color: #0284c7; }
        .active-plan-b { background: #fef3c7; border-color: #f59e0b; }
        .plan-label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .plan-title { font-size: 0.85rem; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .plan-cost { font-size: 0.78rem; font-weight: 700; color: #10b981; }
        .swap-btn { width: 34px; height: 34px; border-radius: 50%; background: #ffffff; border: 1px solid #cbd5e1; color: #0284c7; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); transition: var(--transition); }
        .swap-btn:hover { background: #0284c7; color: #ffffff; }
        .contingency-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px dashed #e2e8f0; font-size: 0.8rem; }
      `}</style>
    </Modal>
  );
};

export default PlanBModal;
