import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('globetrotter_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('globetrotter_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('globetrotter_user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.error('Session validation error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('globetrotter_token', res.data.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(res.data.user));
        toast.success(res.message || 'Logged in successfully!');
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const isNetworkError = !error.response || error.code === 'ERR_NETWORK';
      const msg = isNetworkError
        ? 'Unable to connect to the server. Please try again.'
        : error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      return { success: false, message: msg, isNetworkError };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('globetrotter_token', res.data.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(res.data.user));
        toast.success(res.message || 'Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success && res.data) {
        setUser((prev) => ({ ...prev, ...res.data }));
        localStorage.setItem('globetrotter_user', JSON.stringify({ ...user, ...res.data }));
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const toggleSaveDestination = async (cityId) => {
    if (!user) {
      toast.error('Please login to save destinations to your favorites.');
      return false;
    }
    try {
      const res = await authService.toggleSavedDestination(cityId);
      if (res.success) {
        setUser((prev) => ({
          ...prev,
          savedDestinations: res.data.savedDestinations,
        }));
        toast.success(res.message);
        return res.data.isSaved;
      }
    } catch (error) {
      toast.error('Failed to update saved destinations');
      return false;
    }
  };

  const isDestinationSaved = (cityId) => {
    if (!user || !user.savedDestinations) return false;
    return user.savedDestinations.some((d) => {
      const id = typeof d === 'object' ? d._id : d;
      return id?.toString() === cityId?.toString();
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    toggleSaveDestination,
    isDestinationSaved,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
