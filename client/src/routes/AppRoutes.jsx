import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import CreateTripPage from '../pages/CreateTripPage';
import MyTripsPage from '../pages/MyTripsPage';
import ItineraryBuilderPage from '../pages/ItineraryBuilderPage';
import ItineraryViewPage from '../pages/ItineraryViewPage';
import CitySearchPage from '../pages/CitySearchPage';
import ActivitySearchPage from '../pages/ActivitySearchPage';
import TripBudgetPage from '../pages/TripBudgetPage';
import TripCalendarPage from '../pages/TripCalendarPage';
import PublicTripPage from '../pages/PublicTripPage';
import ProfileSettingsPage from '../pages/ProfileSettingsPage';
import SavedPlacesPage from '../pages/SavedPlacesPage';
import CopilotPage from '../pages/CopilotPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth & Landing Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Public Exploration & Shared Views */}
      <Route path="/explore/cities" element={<CitySearchPage />} />
      <Route path="/explore/activities" element={<ActivitySearchPage />} />
      <Route path="/public/trip/:slug" element={<PublicTripPage />} />
      <Route path="/globetrotter/trip/public/:slug" element={<PublicTripPage />} />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/copilot"
        element={
          <ProtectedRoute>
            <CopilotPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <MyTripsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/create"
        element={
          <ProtectedRoute>
            <CreateTripPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id"
        element={
          <ProtectedRoute>
            <ItineraryViewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id/builder"
        element={
          <ProtectedRoute>
            <ItineraryBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id/itinerary"
        element={
          <ProtectedRoute>
            <ItineraryViewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id/budget"
        element={
          <ProtectedRoute>
            <TripBudgetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id/calendar"
        element={
          <ProtectedRoute>
            <TripCalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ProfileSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <SavedPlacesPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Route */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalyticsPage />
          </AdminRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
