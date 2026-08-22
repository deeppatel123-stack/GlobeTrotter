import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Users, Search, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
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
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userSearch, roleFilter, statusFilter]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminService.toggleUserStatus(id);
      if (res.success) {
        toast.success(res.message);
        fetchUsers();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error updating status');
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      const res = await adminService.updateUserRole(id, newRole);
      if (res.success) {
        toast.success(res.message);
        fetchUsers();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error updating role');
    }
  };

  return (
    <div className="page-container admin-users-page animate-fade">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">User Management & Permissions</h1>
          <p className="page-subtitle">Inspect registered accounts, toggle roles, and manage access status.</p>
        </div>
      </div>

      <div className="filters-bar-card card" style={{ margin: '1.25rem 0' }}>
        <div className="search-wrapper" style={{ maxWidth: '300px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search users..."
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
              <th>Status</th>
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
                    onChange={(e) => handleUpdateRole(u._id, e.target.value)}
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
                    onClick={() => handleToggleStatus(u._id)}
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
  );
};

export default AdminUsersPage;
