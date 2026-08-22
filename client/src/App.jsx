import React, { useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import AppSidebar from './components/AppSidebar';
import MobileDrawer from './components/MobileDrawer';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const publicRoutes = ['/', '/welcome', '/login', '/signup', '/forgot-password'];
  const isPublicPage = publicRoutes.includes(location.pathname) || location.pathname.startsWith('/public/trip');

  // Pages where footer should NOT appear
  const hideFooterRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/explore/cities',
    '/explore/activities',
    '/trips',
    '/dashboard',
    '/copilot',
    '/admin',
    '/profile',
    '/saved',
  ];

  const shouldHideFooter = hideFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  ) || location.pathname.includes('/builder');

  const useSidebarLayout = isAuthenticated && !isPublicPage;

  return (
    <div className="app-container">
      {/* Global Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {useSidebarLayout ? (
        /* AUTHENTICATED APP WORKSPACE (SIDEBAR LAYOUT) */
        <div className="app-workspace-layout">
          <AppSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div className="app-workspace-main">
            <main className="main-content">
              <AppRoutes />
            </main>
          </div>
        </div>
      ) : (
        /* PUBLIC LANDING & AUTH LAYOUT */
        <>
          <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          <MobileDrawer
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
          <main className="main-content">
            <AppRoutes />
          </main>
          {!shouldHideFooter && <Footer />}
        </>
      )}

      <style>{`
        .app-workspace-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          width: 100%;
        }
        .app-workspace-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <AppContent />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
