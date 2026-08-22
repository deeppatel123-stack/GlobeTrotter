# GlobeTrotter — Empowering Personalized Travel Planning

> A production-grade, full-stack travel planning platform built for the **Odoo Hackathon**. Featuring a Real-Time Date-Wise AI Planner, multi-city journey builder, categorized budget analytics, shared read-only itineraries, and dedicated Traveler & Admin dashboards.

---

## 🌟 Key Features & 15 Core Screens Overview

1. **Login & Signup (`/login`, `/signup`)**
   - JWT-based authentication with bcrypt password hashing.
   - 1-click Demo Traveler (`traveler@globetrotter.com`) & Demo Admin (`admin@globetrotter.com`) login buttons.
   - Forgot password recovery flow with development fallback.
   - Language preference settings.

2. **Dashboard / Home (`/dashboard`)**
   - Personalized welcome hero (*"Welcome back, Traveler!"*).
   - Quick KPI metrics: Total Trips, Destinations, Spending, and Total Budget.
   - Recent trips preview and 1-click **"Plan New Trip"** & **"AI Planner"** CTAs.
   - Curated **Recommended Destinations** and trending global city hotspots.

3. **Real-Time Date-Wise AI Trip Planner (`/copilot`)**
   - Explicit **Destination City** (e.g. *Rajkot*, *Paris*, *Tokyo*, *Jaipur*, *Goa*, *Dubai*, *Manali*, *London*) & **Destination Country** (e.g. *India*, *France*, *Japan*, *UAE*) inputs.
   - Real-time online database lookup (`cityService.getCities`) for authentic local attractions, real HD Unsplash cover photos, popularity ratings, and latitude/longitude coordinates.
   - Automatic date-wise schedule generation (Day 1 to Day N) with exact time slots, categories, and itemized costs in ₹.
   - 1-click single-toast success confirmation (`"Trip planned successfully!"`) with real-time MongoDB database persistence for all generated stops and activities.

4. **Create Trip (`/trips/create`)**
   - Explicit **Destination City** & **Destination Country** input fields with auto-generated trip titles.
   - Start & end date validation (end date cannot be earlier than start date).
   - Cover photo picker with curated Unsplash presets and custom image URL input.
   - Multi-currency support (INR `₹`, USD `$`, EUR `€`, GBP `£`) and target budget setting.
   - Instant redirection into the **Itinerary Builder**.

5. **My Trips (`/trips`)**
   - Complete grid and list views of user travel plans.
   - Live search by trip name and status filters (*All, Upcoming, Ongoing, Completed, Draft*).
   - Sort by newest, earliest start date, and budget.
   - Actions: View Itinerary, Edit in Builder, Duplicate Trip, Delete with confirmation, Share.

6. **Itinerary Builder (`/trips/:id/builder`)**
   - Core planning hub: Add multiple destination cities / stops in sequence.
   - Up/Down destination reordering with automatic sequence recalculation.
   - Add activities from the destination's pre-loaded catalog or create custom activities.
   - Log destination-specific expenses (Stay, Transport, Food, Other).
   - Real-time automatic recalculation of total duration, activity count, and estimated costs.

7. **Itinerary View (`/trips/:id/itinerary`)**
   - Presentation layout with structured day-by-day sequence and city headers.
   - Toggle between **Structured List View** and **Day-by-Day Timeline View**.
   - Print & PDF export ready layout.

8. **City Search & Discovery (`/explore/cities`)**
   - Search across global destinations with debounce.
   - Filters: Region (Asia, Europe, Middle East, etc.) and Cost Index ($ to $$$$$).
   - City cards with popularity scores, descriptions, and 1-click bookmarking.
   - City Detail Modal with top attractions and **"Add to Trip"** action.

9. **Activity Search & Discovery (`/explore/activities`)**
   - Browse activities by category (*Sightseeing, Food & Dining, Adventure, Culture, Nature, Entertainment*).
   - Filters for Star Rating (★ 4.5+), Max Price Range, and Duration.
   - Quick View detail modal and **"Add to Itinerary"** trip assigner.

10. **Trip Budget & Cost Breakdown (`/trips/:id/budget`)**
    - Visual financial dashboard with **Donut Pie Chart** for category spending (*Transport, Stay, Activities, Meals, Other*).
    - **Bar Chart** comparing daily spend against the average daily target limit.
    - Real-time budget progress bar and remaining funds tracking.
    - Automatic alert banner when total cost or daily spend exceeds budget.

11. **Trip Calendar & Timeline (`/trips/:id/calendar`)**
    - Day-by-day interactive calendar carousel strip showing trip duration.
    - Hour-by-hour vertical timeline schedule for any selected day.
    - Quick activity additions, rescheduling, and deletion.

12. **Public / Shared Itinerary (`/public/trip/:slug`)**
    - Clean read-only shareable itinerary view with creator profile badge.
    - Day-by-day sequence and cost breakdown.
    - **"Copy Trip"** button that clones the entire itinerary to the viewer's account with a new ID.
    - Social media share links (WhatsApp, Twitter/X, Facebook, Email, Copy Link).

13. **Saved Destinations Gallery (`/saved`)**
    - Dedicated page displaying all saved/bookmarked cities and destinations.
    - Quick access to view city details or add directly to active itineraries.

14. **User Profile & Settings (`/profile`)**
    - Profile details editor (Name, Avatar presets/URL, Email).
    - Language preference selector.
    - Account security and password management.

15. **Admin & Analytics Dashboard (`/admin`)**
    - Protected route accessible exclusively to administrator accounts.
    - Platform KPIs: Total Users, Total Trips, Public Trips, Active Accounts, Catalog Size.
    - Growth trends **Area Chart** showing monthly itinerary creation.
    - **Status Distribution Pie Chart** (*Upcoming, Ongoing, Draft, Completed*).
    - User management table with live search, role modification (User/Admin), and user deactivation.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 & Vite
  - React Router DOM v6
  - Axios
  - Recharts (Donut Pie Charts, Bar Charts, Area Growth Charts)
  - Lucide React (Modern icon library)
  - React Hot Toast (Toast notifications)
  - Date-fns (Date calculations and formatting)
  - Pure CSS3 Design System with Custom Glassmorphism Tokens

- **Backend**:
  - Node.js & Express.js (REST API Architecture)
  - MongoDB & Mongoose (Schema modeling, auto-recalculation methods, text indexes)
  - JSON Web Tokens (JWT) & bcryptjs
  - Express Validator & CORS
  - Centralized Error Handling Middleware

---

## 📁 Project Directory Structure

```text
GlobeTrotter/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, AppSidebar, Footer, TripCard, CityCard, ActivityCard, Modals, Charts
│   │   ├── context/          # AuthContext, TripContext
│   │   ├── pages/            # All 15 Screens
│   │   │   ├── admin/        # AdminDashboardPage
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CopilotPage.jsx (Real-Time Date-Wise AI Planner)
│   │   │   ├── CreateTripPage.jsx
│   │   │   ├── MyTripsPage.jsx
│   │   │   ├── ItineraryBuilderPage.jsx
│   │   │   ├── ItineraryViewPage.jsx
│   │   │   ├── CitySearchPage.jsx
│   │   │   ├── ActivitySearchPage.jsx
│   │   │   ├── TripBudgetPage.jsx
│   │   │   ├── TripCalendarPage.jsx
│   │   │   ├── PublicTripPage.jsx
│   │   │   ├── SavedPlacesPage.jsx
│   │   │   └── ProfileSettingsPage.jsx
│   │   ├── routes/           # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/         # api.js, authService, tripService, cityService, activityService, adminService
│   │   ├── utils/            # formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css         # Modern design system, high contrast, responsive layout
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/               # db.js (MongoDB Connection)
│   ├── controllers/          # auth, trip, city, activity, admin, publicTrip
│   ├── middleware/           # auth, adminAuth, errorHandler, validator
│   ├── models/               # User, Trip, City, Activity, Expense
│   ├── routes/               # authRoutes, tripRoutes, cityRoutes, activityRoutes, publicRoutes, adminRoutes
│   ├── seed/                 # seedData.js (Global cities, activities, demo users, sample trips)
│   ├── utils/                # budgetEngine.js, jwt.js, slug.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally on `mongodb://127.0.0.1:27017/globetrotter` (or Atlas URI in `server/.env`)

### 2. Install Dependencies
From the root folder:
```bash
npm run install-all
```
Or individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Seed Database
Populate destinations (Rajkot, Mumbai, Delhi, Goa, Jaipur, Paris, London, Rome, Tokyo, Dubai, etc.), rich activities, demo users, and sample itineraries:
```bash
cd server
npm run seed
```

### 4. Run the Application
Start the Backend Server (Port 5000):
```bash
cd server
npm run dev
```

In a second terminal, start the Frontend Client (Port 5173 / 5174):
```bash
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Demo Traveler** | `traveler@globetrotter.com` | `password123` |
| **Administrator** | `admin@globetrotter.com` | `password123` |

---

## 🏆 Feature Checklist

```text
[✓] Real-Time Date-Wise AI Trip Planner (/copilot) with City & Country Inputs
[✓] Real Online Database API Lookup (cityService.getCities) & Unsplash HD Cover Sync
[✓] Single Clean Success Toast Notification ("Trip planned successfully!")
[✓] Traveler & Admin Sidebar Role-Based Navigation
[✓] Dedicated Saved Places / Bookmarked Cities Page (/saved)
[✓] Multi-Stop Sequential Itinerary Builder with Dynamic Costs & Duration
[✓] Financial Dashboard with Recharts Donut Pie & Bar Analytics
[✓] Interactive Calendar Carousel & Hourly Vertical Timeline Schedule
[✓] Shareable Public Itinerary with 1-Click "Copy Trip" Clone Feature
[✓] Protected Admin Dashboard with Monthly Growth & Status Pie Charts
[✓] Clean High-Contrast Accessible Design Tokens & Glassmorphism Styling
[✓] Production Build Clean Compile (npm run build -> 0 Errors)
```

Developed with passion for **GlobeTrotter — Empowering Personalized Travel Planning**.
