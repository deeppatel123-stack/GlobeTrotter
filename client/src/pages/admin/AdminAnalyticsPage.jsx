import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Sparkles, Star, TrendingUp, MapPin, Globe } from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading Platform Analytics...</p>
      </div>
    );
  }

  const { trends, statusDistribution, topCities, topActivities } = stats;

  return (
    <div className="page-container admin-analytics-page animate-fade">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Destination & Activity Platform Analytics</h1>
          <p className="page-subtitle">Deep dive into user itinerary planning trends, hot cities, and top booked experiences.</p>
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginTop: '1.5rem' }}>
        <div className="chart-card card">
          <h3 className="chart-title">Trip Planning Growth Trend</h3>
          <p className="chart-subtitle">Monthly volume of itineraries created</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorTrips2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="trips" stroke="#0284c7" fillOpacity={1} fill="url(#colorTrips2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card card">
          <h3 className="chart-title">Itinerary Status Distribution</h3>
          <p className="chart-subtitle">Proportion of upcoming vs ongoing vs completed trips</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginTop: '1.5rem' }}>
        <div className="admin-list-card card">
          <h3 className="list-card-title">Top 5 Booked Destinations</h3>
          <div className="top-frequency-list" style={{ marginTop: '1rem' }}>
            {topCities.map((c, i) => (
              <div key={i} className="frequency-row">
                <span className="freq-rank">#{i + 1}</span>
                <span className="freq-name">{c.name}</span>
                <div className="freq-bar-wrap">
                  <div className="freq-bar" style={{ width: `${Math.min(100, (c.count / (topCities[0]?.count || 1)) * 100)}%` }}></div>
                </div>
                <span className="freq-count">{c.count} stops</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-list-card card">
          <h3 className="list-card-title">Top Rated Experiences</h3>
          <div className="top-frequency-list" style={{ marginTop: '1rem' }}>
            {topActivities.map((act, i) => (
              <div key={act._id} className="frequency-row">
                <span className="freq-rank">#{i + 1}</span>
                <div className="freq-act-info">
                  <span className="freq-name">{act.name}</span>
                  <span className="freq-sub">{act.city?.name}, {act.city?.country} • {act.category}</span>
                </div>
                <span className="badge badge-warning">★ {act.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
