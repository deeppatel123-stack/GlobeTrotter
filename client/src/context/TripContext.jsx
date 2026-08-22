import React, { createContext, useContext, useState, useCallback } from 'react';
import { tripService } from '../services/tripService';
import toast from 'react-hot-toast';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('globetrotter_currency') || 'INR';
  });

  const changeCurrency = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem('globetrotter_currency', newCurr);
  };

  const fetchTrips = useCallback(async (params = {}) => {
    const token = localStorage.getItem('globetrotter_token');
    if (!token) return;
    setLoading(true);
    try {
      const res = await tripService.getTrips(params);
      if (res.success) {
        setTrips(res.data);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error fetching trips:', error);
        toast.error('Failed to load your trips');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTripById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await tripService.getTripById(id);
      if (res.success) {
        setCurrentTrip(res.data);
        return res.data;
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error fetching trip by id:', error);
        toast.error('Failed to load trip details');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardSummary = useCallback(async () => {
    const token = localStorage.getItem('globetrotter_token');
    if (!token) return;
    try {
      const res = await tripService.getDashboardSummary();
      if (res.success) {
        setDashboardData(res.data);
        return res.data;
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error fetching dashboard stats:', error);
      }
    }
  }, []);

  const createTrip = async (tripData) => {
    try {
      const res = await tripService.createTrip(tripData);
      if (res.success) {
        toast.success('Trip created successfully!');
        // Optimistically add new trip to local state
        setTrips((prev) => [res.data, ...prev]);
        // Refresh dashboard summary counts in background (not trips list - avoid race)
        fetchDashboardSummary();
        return res.data;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create trip';
      toast.error(msg);
      throw error;
    }
  };

  const updateTrip = async (id, tripData) => {
    try {
      const res = await tripService.updateTrip(id, tripData);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success('Trip updated successfully');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to update trip');
      throw error;
    }
  };

  const deleteTrip = async (id) => {
    try {
      const res = await tripService.deleteTrip(id);
      if (res.success) {
        setTrips((prev) => prev.filter((t) => t._id !== id));
        toast.success('Trip deleted successfully');
        // Refresh dashboard stats so counts drop immediately
        setTimeout(() => fetchDashboardSummary(), 300);
        return true;
      }
    } catch (error) {
      toast.error('Failed to delete trip');
      return false;
    }
  };

  const duplicateTrip = async (id) => {
    try {
      const res = await tripService.duplicateTrip(id);
      if (res.success) {
        setTrips((prev) => [res.data, ...prev]);
        toast.success('Trip duplicated successfully!');
        // Refresh dashboard stats to reflect new trip count
        setTimeout(() => fetchDashboardSummary(), 300);
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to duplicate trip');
      return null;
    }
  };

  const addStop = async (tripId, stopData) => {
    try {
      const res = await tripService.addStop(tripId, stopData);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success(res.message || 'Stop added to itinerary');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to add stop');
      throw error;
    }
  };

  const updateStop = async (tripId, stopId, stopData) => {
    try {
      const res = await tripService.updateStop(tripId, stopId, stopData);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success('Stop updated');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to update stop');
      throw error;
    }
  };

  const deleteStop = async (tripId, stopId) => {
    try {
      const res = await tripService.deleteStop(tripId, stopId);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success('Stop removed from itinerary');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to remove stop');
      throw error;
    }
  };

  const reorderStops = async (tripId, orderedIds) => {
    try {
      const res = await tripService.reorderStops(tripId, orderedIds);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success('Itinerary order updated');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to reorder stops');
      throw error;
    }
  };

  const addActivity = async (tripId, stopId, activityData) => {
    try {
      const res = await tripService.addActivityToStop(tripId, stopId, activityData);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success('Activity added to stop');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to add activity');
      throw error;
    }
  };

  const removeActivity = async (tripId, stopId, activityId) => {
    try {
      const res = await tripService.removeActivityFromStop(tripId, stopId, activityId);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success('Activity removed');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to remove activity');
      throw error;
    }
  };

  const addExpense = async (tripId, stopId, expenseData) => {
    try {
      const res = await tripService.addExpenseToStop(tripId, stopId, expenseData);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success('Expense recorded');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to add expense');
      throw error;
    }
  };

  const removeExpense = async (tripId, stopId, expenseId) => {
    try {
      const res = await tripService.deleteExpenseFromStop(tripId, stopId, expenseId);
      if (res.success) {
        setCurrentTrip(res.data);
        toast.success('Expense removed');
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to remove expense');
      throw error;
    }
  };

  const toggleShare = async (tripId) => {
    try {
      const res = await tripService.toggleShareTrip(tripId);
      if (res.success) {
        toast.success(res.message);
        if (currentTrip && currentTrip._id === tripId) {
          setCurrentTrip((prev) => ({
            ...prev,
            isPublic: res.data.isPublic,
            publicSlug: res.data.publicSlug,
          }));
        }
        return res.data;
      }
    } catch (error) {
      toast.error('Failed to update share settings');
      return null;
    }
  };

  const value = {
    trips,
    currentTrip,
    dashboardData,
    loading,
    fetchTrips,
    fetchTripById,
    fetchDashboardSummary,
    createTrip,
    updateTrip,
    deleteTrip,
    duplicateTrip,
    addStop,
    updateStop,
    deleteStop,
    reorderStops,
    addActivity,
    removeActivity,
    addExpense,
    removeExpense,
    toggleShare,
    setCurrentTrip,
    currency,
    setCurrency: changeCurrency,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
