import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

const CATEGORY_COLORS = {
  transport: '#3b82f6',
  stay: '#8b5cf6',
  activities: '#10b981',
  meals: '#f59e0b',
  other: '#ec4899',
};

export const CategoryPieChart = ({ categories = {}, currency = 'INR' }) => {
  const data = [
    { name: 'Transport', value: categories.transport || 0, color: '#3b82f6' },
    { name: 'Stay / Hotels', value: categories.stay || 0, color: '#8b5cf6' },
    { name: 'Activities', value: categories.activities || 0, color: '#10b981' },
    { name: 'Meals & Food', value: categories.meals || 0, color: '#f59e0b' },
    { name: 'Other Expenses', value: categories.other || 0, color: '#ec4899' },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="empty-chart-box">
        <p>No expenses recorded yet. Add activities or stop expenses to see cost distribution.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">
            {formatCurrency(payload[0].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: '#0f172a', fontSize: '0.85rem' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      <style>{`
        .custom-chart-tooltip {
          background: #0f172a;
          color: #ffffff;
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          box-shadow: var(--shadow-lg);
          font-size: 0.85rem;
        }
        .tooltip-label {
          font-weight: 500;
          color: #cbd5e1;
        }
        .tooltip-value {
          font-weight: 700;
          color: #38bdf8;
        }
        .empty-chart-box {
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
          padding: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export const DailySpendingBarChart = ({ dailyCosts = {}, dailyLimit = 0, currency = 'INR' }) => {
  const data = Object.keys(dailyCosts).map((dateKey) => ({
    date: dateKey,
    amount: dailyCosts[dateKey],
  }));

  if (data.length === 0) {
    return (
      <div className="empty-chart-box">
        <p>No daily spending entries recorded yet.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-label">Date: {label}</p>
          <p className="tooltip-value">
            Spent: {formatCurrency(payload[0].value, currency)}
          </p>
          {dailyLimit > 0 && (
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Daily Avg Budget: {formatCurrency(dailyLimit, currency)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
          <Tooltip content={<CustomTooltip />} />
          {dailyLimit > 0 && (
            <ReferenceLine
              y={dailyLimit}
              label={{ value: 'Daily Budget Limit', fill: '#ef4444', fontSize: 11, position: 'top' }}
              stroke="#ef4444"
              strokeDasharray="4 4"
            />
          )}
          <Bar dataKey="amount" fill="#0284c7" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
