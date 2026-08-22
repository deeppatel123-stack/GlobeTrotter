import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', trend }) => {
  return (
    <div className={`stat-card stat-${color} card animate-fade`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-card-body">
        <h3 className="stat-card-value">{value}</h3>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
        {trend && (
          <span className={`stat-trend ${trend.positive ? 'trend-up' : 'trend-neutral'}`}>
            {trend.text}
          </span>
        )}
      </div>

      <style>{`
        .stat-card {
          padding: 1.5rem;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          transition: var(--transition);
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .stat-card-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-primary .stat-icon-wrapper {
          background: var(--primary-light);
          color: var(--primary);
        }
        .stat-success .stat-icon-wrapper {
          background: #dcfce7;
          color: #16a34a;
        }
        .stat-warning .stat-icon-wrapper {
          background: #fef3c7;
          color: #d97706;
        }
        .stat-purple .stat-icon-wrapper {
          background: #f3e8ff;
          color: #9333ea;
        }
        .stat-card-value {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.5px;
          line-height: 1.1;
        }
        .stat-card-subtitle {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.35rem;
        }
        .stat-trend {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          margin-top: 0.5rem;
        }
        .trend-up {
          background: #dcfce7;
          color: #15803d;
        }
        .trend-neutral {
          background: #f1f5f9;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default StatCard;
