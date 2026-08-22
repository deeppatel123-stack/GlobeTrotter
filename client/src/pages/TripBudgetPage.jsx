import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { tripService } from '../services/tripService';
import { CategoryPieChart, DailySpendingBarChart } from '../components/BudgetChart';
import StatCard from '../components/StatCard';
import { formatCurrency, formatDateRange, formatDate } from '../utils/formatters';
import {
  DollarSign,
  PieChart,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  MapPin,
  Car,
  Home,
  Utensils,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

const TripBudgetPage = () => {
  const { id } = useParams();
  const { currentTrip, fetchTripById } = useTrip();
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true);
      try {
        if (!currentTrip || currentTrip._id !== id) {
          await fetchTripById(id);
        }
        const res = await tripService.getTripBudget(id);
        if (res.success) {
          setBudgetData(res.data);
        }
      } catch (e) {
        console.error('Failed to load trip budget:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [id, currentTrip, fetchTripById]);

  if (loading || !budgetData) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Calculating Trip Budget & Costs...</p>
      </div>
    );
  }

  const {
    totalBudget,
    totalCost,
    remainingBudget,
    budgetPercentage,
    isOverBudget,
    durationDays,
    averageDailyCost,
    dailyBudgetLimit,
    categories,
    dailyCosts,
    overBudgetDays,
    currency = currentTrip?.currency || 'INR',
  } = budgetData;

  return (
    <div className="page-container trip-budget-page animate-fade">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <Link to={`/trips/${id}/builder`} className="back-link">
            <ArrowLeft size={16} /> Back to Itinerary Builder
          </Link>
          <h1 className="page-title">{currentTrip?.name || 'Trip'} — Budget & Cost Breakdown</h1>
          <p className="page-subtitle">
            Financial analytics, category breakdown, daily spending averages, and budget alerts.
          </p>
        </div>

        <div className="header-actions">
          <Link to={`/trips/${id}/itinerary`} className="btn btn-secondary">
            View Itinerary
          </Link>
          <Link to={`/trips/${id}/builder`} className="btn btn-primary">
            Manage Expenses in Builder
          </Link>
        </div>
      </div>

      {/* Over-Budget Alert Banner */}
      {isOverBudget && (
        <div className="alert-overbudget animate-slide-up">
          <AlertTriangle size={22} className="alert-icon" />
          <div className="alert-text">
            <strong>Warning: Trip is Over Target Budget!</strong> Total estimated cost ({formatCurrency(totalCost, currency)}) exceeds your planned budget allocation ({formatCurrency(totalBudget, currency)}) by {formatCurrency(Math.abs(remainingBudget), currency)}.
          </div>
        </div>
      )}

      {/* Daily Overbudget Warning */}
      {overBudgetDays && overBudgetDays.length > 0 && !isOverBudget && (
        <div className="alert-overbudget warning-subtle animate-slide-up">
          <AlertTriangle size={20} className="alert-icon" />
          <div className="alert-text">
            <strong>Daily Spike Alert:</strong> {overBudgetDays.length} specific day(s) exceed your average daily target allocation ({formatCurrency(dailyBudgetLimit, currency)}/day).
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Target Budget"
          value={formatCurrency(totalBudget, currency)}
          subtitle="Trip financial ceiling"
          icon={DollarSign}
          color="primary"
        />
        <StatCard
          title="Total Estimated Cost"
          value={formatCurrency(totalCost, currency)}
          subtitle={`${budgetPercentage}% of target budget`}
          icon={PieChart}
          color={isOverBudget ? 'danger' : 'success'}
        />
        <StatCard
          title={remainingBudget >= 0 ? 'Remaining Funds' : 'Deficit / Overbudget'}
          value={formatCurrency(Math.abs(remainingBudget), currency)}
          subtitle={remainingBudget >= 0 ? 'Available for contingencies' : 'Exceeding budget'}
          icon={remainingBudget >= 0 ? TrendingDown : AlertTriangle}
          color={remainingBudget >= 0 ? 'success' : 'danger'}
        />
        <StatCard
          title="Average Cost Per Day"
          value={formatCurrency(averageDailyCost, currency)}
          subtitle={`Across ${durationDays} travel days`}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Budget Progress Bar */}
      <div className="budget-progress-card card">
        <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
          <span className="progress-title">Budget Utilization</span>
          <span className="progress-percentage-label">{budgetPercentage}% Used</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${isOverBudget ? 'fill-danger' : 'fill-primary'}`}
            style={{ width: `${Math.min(100, budgetPercentage)}%` }}
          ></div>
        </div>
      </div>

      {/* Two-Column Visual Charts */}
      <div className="grid-cols-2">
        {/* Category Breakdown Donut */}
        <div className="chart-card card">
          <h3 className="chart-title">Expense Breakdown by Category</h3>
          <p className="chart-subtitle">Distribution across accommodation, activities, food & transit</p>
          <CategoryPieChart categories={categories} currency={currency} />
        </div>

        {/* Daily Spending Bar Chart */}
        <div className="chart-card card">
          <h3 className="chart-title">Daily Spending Trend</h3>
          <p className="chart-subtitle">Cost per day compared to average daily budget allocation</p>
          <DailySpendingBarChart
            dailyCosts={dailyCosts}
            dailyLimit={dailyBudgetLimit}
            currency={currency}
          />
        </div>
      </div>

      {/* Category Summary Breakdown Cards */}
      <div className="category-cards-grid">
        <div className="category-item-card card">
          <div className="cat-icon-wrap bg-blue">
            <Car size={20} />
          </div>
          <div className="cat-info">
            <span className="cat-name">Transport & Transit</span>
            <span className="cat-amount">{formatCurrency(categories.transport, currency)}</span>
          </div>
        </div>

        <div className="category-item-card card">
          <div className="cat-icon-wrap bg-purple">
            <Home size={20} />
          </div>
          <div className="cat-info">
            <span className="cat-name">Stay & Accommodation</span>
            <span className="cat-amount">{formatCurrency(categories.stay, currency)}</span>
          </div>
        </div>

        <div className="category-item-card card">
          <div className="cat-icon-wrap bg-emerald">
            <Sparkles size={20} />
          </div>
          <div className="cat-info">
            <span className="cat-name">Activities & Sightseeing</span>
            <span className="cat-amount">{formatCurrency(categories.activities, currency)}</span>
          </div>
        </div>

        <div className="category-item-card card">
          <div className="cat-icon-wrap bg-amber">
            <Utensils size={20} />
          </div>
          <div className="cat-info">
            <span className="cat-name">Meals & Food</span>
            <span className="cat-amount">{formatCurrency(categories.meals, currency)}</span>
          </div>
        </div>

        <div className="category-item-card card">
          <div className="cat-icon-wrap bg-pink">
            <ShoppingBag size={20} />
          </div>
          <div className="cat-info">
            <span className="cat-name">Other / Miscellaneous</span>
            <span className="cat-amount">{formatCurrency(categories.other, currency)}</span>
          </div>
        </div>
      </div>

      <style>{`
        .trip-budget-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .warning-subtle {
          background: #fffbeb;
          border-color: #fde68a;
          color: #92400e;
        }
        .budget-progress-card {
          padding: 1.25rem 1.5rem;
        }
        .progress-title {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .progress-percentage-label {
          font-weight: 800;
          color: var(--primary);
        }
        .progress-track {
          width: 100%;
          height: 12px;
          background: #e2e8f0;
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.6s ease;
        }
        .fill-primary {
          background: var(--primary-gradient);
        }
        .fill-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        .chart-card {
          padding: 1.5rem;
        }
        .chart-title {
          font-size: 1.15rem;
          font-weight: 800;
        }
        .chart-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }
        .category-cards-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1024px) {
          .category-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 640px) {
          .category-cards-grid {
            grid-template-columns: 1fr;
          }
        }
        .category-item-card {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .cat-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .bg-blue { background: #3b82f6; }
        .bg-purple { background: #8b5cf6; }
        .bg-emerald { background: #10b981; }
        .bg-amber { background: #f59e0b; }
        .bg-pink { background: #ec4899; }
        .cat-info {
          display: flex;
          flex-direction: column;
        }
        .cat-name {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .cat-amount {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};

export default TripBudgetPage;
