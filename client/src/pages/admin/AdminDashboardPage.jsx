import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Users,
  Calendar,
  Globe,
  MapPin,
  Sparkles,
  TrendingUp,
  Shield,
  Activity as ActivityIcon,
  DollarSign,
  UserCheck,
  UserX,
  Search,
  Star,
  Compass,
} from 'lucide-react';
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
  BarChart,
  Bar,
} from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 4 Excalidraw Tabs: 'manage-users' | 'popular-cities' | 'popular-activities' | 'user-trends'
  const [activeTab, setActiveTab] = useState('user-trends');

  // Users Management State
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchAdminStats = async () => {
    try {
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStatsData(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch admin stats:', e);
      toast.error('Failed to load admin analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await adminService.getUsers({
        search: userSearch || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (res.success) {
        setUsersList(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(fetchAdminStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'manage-users') {
      fetchUsers();
    }
  }, [activeTab, userSearch, roleFilter, statusFilter]);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await adminService.toggleUserStatus(userId);
      if (res.success) {
        toast.success(res.message);
        fetchUsers();
        fetchAdminStats();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error updating user');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        toast.success(res.message);
        fetchUsers();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error updating user role');
    }
  };

  if (loading || !statsData) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading Admin Control Center...</p>
      </div>
    );
  }

  const { summary, statusDistribution, topCities, topActivities, recentUsers, recentTrips, trends } = statsData;

  return (
    <div className="page-container admin-dashboard-page animate-fade">
      {/* Header */}
      <div className="admin-header-card card">
          <div className="admin-header-top">
            <div className="admin-badge-icon">
              <Shield size={24} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="admin-title">Admin Panel & Platform Dashboard</h1>
              <p className="admin-subtitle">
                Manage platform users, inspect popular global destinations, and visualize user travel trends.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fetchAdminStats}
              style={{ alignSelf: 'flex-start', whiteSpace: 'nowrap' }}
            >
              🔄 Refresh Stats
            </button>
          </div>

        {/* 4 Excalidraw Tabs */}
        <div className="tabs-container admin-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'user-trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('user-trends')}
          >
            <TrendingUp size={16} /> User Trends & Analytics
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'manage-users' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-users')}
          >
            <Users size={16} /> Manage Users ({summary.totalUsers})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'popular-cities' ? 'active' : ''}`}
            onClick={() => setActiveTab('popular-cities')}
          >
            <MapPin size={16} /> Popular Cities
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'popular-activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('popular-activities')}
          >
            <Sparkles size={16} /> Popular Activities
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Registered Users"
          value={summary.totalUsers}
          subtitle={`${summary.activeUsers} Active Accounts`}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Total Trips Created"
          value={summary.totalTrips}
          subtitle={`${summary.publicTrips} Public Itineraries`}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Global Catalog"
          value={`${summary.totalCities} Cities`}
          subtitle={`${summary.totalActivities} Listed Activities`}
          icon={Globe}
          color="success"
        />
        <StatCard
          title="Average Trip Budget"
          value={formatCurrency(summary.averageCostPerTrip, 'INR')}
          subtitle={`Total Spending: ${formatCurrency(summary.totalEstimatedSpending, 'INR')}`}
          icon={DollarSign}
          color="warning"
        />
      </div>

      {/* TAB 1: User Trends & Analytics (Excalidraw Screen 12: User Trends) */}
      {activeTab === 'user-trends' && (
        <div className="admin-tab-content animate-slide-up">
          <div className="grid-cols-2">
            {/* Trip Creation Growth Chart */}
            <div className="chart-card card">
              <h3 className="chart-title">Trip Planning Growth Trend</h3>
              <p className="chart-subtitle">Monthly volume of itineraries planned across GlobeTrotter</p>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <AreaChart data={trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="trips" stroke="#0284c7" fillOpacity={1} fill="url(#colorTrips)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trip Status Distribution Pie */}
            <div className="chart-card card">
              <h3 className="chart-title">Trip Status Distribution</h3>
              <p className="chart-subtitle">Breakdown of upcoming, active, draft, and completed itineraries</p>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
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

          {/* Recent Trips & Recent Users Flow */}
          <div className="grid-cols-2" style={{ marginTop: '1.5rem' }}>
            <div className="admin-list-card card">
              <h3 className="list-card-title">Recent Trips Created</h3>
              <div className="admin-table-flow">
                {recentTrips.map((t) => (
                  <div key={t._id} className="admin-row-item">
                    <div className="row-info">
                      <span className="row-name">{t.name}</span>
                      <span className="row-meta">
                        by {t.user?.name || 'User'} • {formatDate(t.createdAt)}
                      </span>
                    </div>
                    <span className="badge badge-primary">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-list-card card">
              <h3 className="list-card-title">Recent User Registrations</h3>
              <div className="admin-table-flow">
                {recentUsers.map((u) => (
                  <div key={u._id} className="admin-row-item">
                    <div className="row-info">
                      <span className="row-name">{u.name}</span>
                      <span className="row-meta">{u.email} • {u.languagePreference}</span>
                    </div>
                    <span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-neutral'}`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Users (Excalidraw Screen 12: Manage Users Section) */}
      {activeTab === 'manage-users' && (
        <div className="admin-tab-content animate-slide-up">
          <div className="filters-bar-card card" style={{ marginBottom: '1.25rem' }}>
            <div className="search-wrapper" style={{ maxWidth: '320px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <div className="flex-gap">
              <select
                className="form-select filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <select
                className="form-select filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>
          </div>

          <div className="users-table-card card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Language</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="table-user-cell">
                        <img
                          src={u.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={u.name}
                          className="table-avatar"
                        />
                        <span className="table-user-name">{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.languagePreference || 'English'}</td>
                    <td>
                      <select
                        className="form-select role-select"
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => handleToggleUserStatus(u._id)}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Popular Cities (Excalidraw Screen 12: Popular Cities) */}
      {activeTab === 'popular-cities' && (
        <div className="admin-tab-content animate-slide-up">
          <div className="grid-cols-2">
            {/* Top Destinations Chart */}
            <div className="chart-card card">
              <h3 className="chart-title">Most Visited / Planned Cities</h3>
              <p className="chart-subtitle">Stops count based on real user itineraries</p>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={topCities} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Cities Frequency List */}
            <div className="admin-list-card card">
              <h3 className="list-card-title">Destination Rankings</h3>
              <p className="list-card-subtitle">Top global hotspots planned by travelers</p>
              <div className="top-frequency-list">
                {topCities.map((c, i) => (
                  <div key={i} className="frequency-row">
                    <span className="freq-rank">#{i + 1}</span>
                    <span className="freq-name">{c.name}</span>
                    <div className="freq-bar-wrap">
                      <div
                        className="freq-bar"
                        style={{ width: `${Math.min(100, (c.count / (topCities[0]?.count || 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="freq-count">{c.count} planned stops</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Popular Activities (Excalidraw Screen 12: Popular Activities) */}
      {activeTab === 'popular-activities' && (
        <div className="admin-tab-content animate-slide-up">
          <div className="grid-cols-2">
            {/* Popular Experiences List */}
            <div className="admin-list-card card">
              <h3 className="list-card-title">Top Rated & Booked Experiences</h3>
              <p className="list-card-subtitle">Highest rated activities added by users</p>
              <div className="top-frequency-list">
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

            {/* Experience Category Breakdown */}
            <div className="chart-card card">
              <h3 className="chart-title">Activity Category Distribution</h3>
              <p className="chart-subtitle">Variety of experiences across sightseeing, food & adventure</p>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sightseeing', value: 35, color: '#3b82f6' },
                        { name: 'Food & Dining', value: 25, color: '#f59e0b' },
                        { name: 'Adventure', value: 20, color: '#10b981' },
                        { name: 'Culture & Museums', value: 15, color: '#8b5cf6' },
                        { name: 'Nature & Parks', value: 5, color: '#ec4899' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {[
                        '#3b82f6',
                        '#f59e0b',
                        '#10b981',
                        '#8b5cf6',
                        '#ec4899',
                      ].map((color, idx) => (
                        <Cell key={`cat-cell-${idx}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
        }
        .admin-header-card {
          padding: 2rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          min-width: 0;
        }
        .admin-header-top {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .admin-badge-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: var(--sunset-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .admin-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
        }
        .admin-subtitle {
          font-size: 0.92rem;
          color: #cbd5e1;
          margin-top: 0.2rem;
        }
        .admin-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          max-width: 100%;
          padding-bottom: 0.25rem;
        }
        .admin-tab-content {
          width: 100%;
          min-width: 0;
        }
        .chart-card {
          padding: 1.5rem;
          width: 100%;
          min-width: 0;
          overflow: hidden;
        }
        .admin-list-card {
          padding: 1.5rem;
          width: 100%;
          min-width: 0;
          overflow: hidden;
        }
        .list-card-title {
          font-size: 1.15rem;
          font-weight: 800;
        }
        .list-card-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }
        .admin-table-flow {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .admin-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }
        .row-info {
          display: flex;
          flex-direction: column;
        }
        .row-name {
          font-weight: 700;
          font-size: 0.92rem;
        }
        .row-meta {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .users-table-card {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .admin-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
        }
        .table-user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .table-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
        }
        .table-user-name {
          font-weight: 700;
        }
        .role-select {
          padding: 0.25rem 0.5rem;
          font-size: 0.82rem;
          width: 95px;
        }
        .top-frequency-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .frequency-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.65rem 0.85rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }
        .freq-rank {
          font-weight: 800;
          color: var(--primary);
          width: 25px;
        }
        .freq-name {
          font-weight: 700;
          font-size: 0.92rem;
          min-width: 100px;
        }
        .freq-act-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .freq-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .freq-bar-wrap {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .freq-bar {
          height: 100%;
          background: var(--primary-gradient);
          border-radius: var(--radius-full);
        }
        .freq-count {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
