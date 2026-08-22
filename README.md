# GlobeTrotter — Empowering Personalized Travel Planning

> A production-grade, full-stack travel planning platform built for the **Odoo Hackathon**. Plan multi-city journeys, organize daily stops and activities, track categorized budgets with real-time analytics, and share read-only itineraries with friends.

---

## 🌟 Key Features & 13 Screens Overview

1. **Login & Signup (`/login`, `/signup`)**
   - JWT-based authentication with bcrypt password hashing.
   - 1-click Demo Traveler & Demo Admin login buttons.
   - Forgot password recovery flow with development fallback.
   - Language preferences (English, Gujarati, Hindi, Spanish, French, German, Japanese).

2. **Dashboard / Home (`/dashboard`)**
   - Personalized welcome hero (*"Welcome back, Traveler!"*).
   - Quick KPI metrics: Total Trips, Destinations, Spending, and Total Budget.
   - Recent trips preview and 1-click **"Plan New Trip"** CTA.
   - Curated **Recommended Destinations** and trending global city hotspots.

3. **Create Trip (`/trips/create`)**
   - Trip name, start & end date validation (end date cannot be earlier than start date).
   - Cover photo picker with curated Unsplash presets and custom image URL input.
   - Multi-currency support (INR `₹`, USD `$`, EUR `€`, GBP `£`) and target budget setting.
   - Instant redirection into the **Itinerary Builder**.

4. **My Trips (`/trips`)**
   - Complete grid and list views of user travel plans.
   - Live search by trip name and status filters (*All, Upcoming, Ongoing, Completed, Draft*).
   - Sort by newest, earliest start date, and budget.
   - Actions: View Itinerary, Edit in Builder, Duplicate Trip, Delete with confirmation, Share.

5. **Itinerary Builder (`/trips/:id/builder`)**
   - Core planning hub: Add multiple destination cities / stops in sequence.
   - Up/Down destination reordering with automatic sequence recalculation.
   - Add activities from the destination's pre-loaded catalog or create custom activities.
   - Log destination-specific expenses (Stay, Transport, Food, Other).
   - Real-time automatic recalculation of total duration, activity count, and estimated costs.

6. **Itinerary View (`/trips/:id/itinerary`)**
   - Presentation layout with structured day-by-day sequence and city headers.
   - Toggle between **Structured List View** and **Day-by-Day Timeline View**.
   - Print & PDF export ready layout.

7. **City Search & Discovery (`/explore/cities`)**
   - Search across global destinations with debounce.
   - Filters: Region (Asia, Europe, Middle East, etc.) and Cost Index ($ to $$$$$).
   - City cards with popularity scores, descriptions, and 1-click bookmarking.
   - City Detail Modal with top attractions and **"Add to Trip"** action.

8. **Activity Search & Discovery (`/explore/activities`)**
   - Browse activities by category (*Sightseeing, Food & Dining, Adventure, Culture, Nature, Entertainment*).
   - Filters for Star Rating (★ 4.5+), Max Price Range, and Duration.
   - Quick View detail modal and **"Add to Itinerary"** trip assigner.

9. **Trip Budget & Cost Breakdown (`/trips/:id/budget`)**
   - Visual financial dashboard with **Donut Pie Chart** for category spending (*Transport, Stay, Activities, Meals, Other*).
   - **Bar Chart** comparing daily spend against the average daily target limit.
   - Real-time budget progress bar and remaining funds tracking.
   - Automatic alert banner when total cost or daily spend exceeds budget.

10. **Trip Calendar & Timeline (`/trips/:id/calendar`)**
    - Day-by-day interactive calendar carousel strip showing trip duration.
    - Hour-by-hour vertical timeline schedule for any selected day.
    - Quick activity additions, rescheduling, and deletion.

11. **Public / Shared Itinerary (`/public/trip/:slug`)**
    - Clean read-only shareable itinerary view with creator profile badge.
    - Day-by-day sequence and cost breakdown.
    - **"Copy Trip"** button that clones the entire itinerary to the viewer's account with a new ID.
    - Social media share links (WhatsApp, Twitter/X, Facebook, Email, Copy Link).

12. **User Profile & Settings (`/profile`)**
    - Profile details editor (Name, Avatar presets/URL, Email).
    - Language preference selector.
    - **Saved Destinations** gallery to view and manage favorite cities.
    - Account security and permanent delete account confirmation.

13. **Admin & Analytics Dashboard (`/admin`)**
    - Protected route accessible exclusively to administrator accounts.
    - Platform KPIs: Total Users, Total Trips, Public Trips, Active Accounts, Catalog Size.
    - Growth trends **Area Chart** showing monthly itinerary creation.
    - **Status Distribution Pie Chart** (*Upcoming, Ongoing, Draft, Completed*).
    - User management table with live search, role modification (User/Admin), and user deactivation.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18
  - Vite
  - React Router DOM v6
  - Axios
  - Recharts (Donut Pie Charts, Bar Charts, Area Growth Charts)
  - Lucide React (Modern icon library)
  - React Hot Toast (Toast notifications)
  - Date-fns (Date calculations and formatting)
  - Canvas Confetti (Celebration effects on cloning/publishing)
  - Pure CSS3 Design System with Glassmorphism and Custom CSS Variables

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
│   │   ├── components/       # Navbar, MobileDrawer, Footer, TripCard, CityCard, ActivityCard, Modals, Charts
│   │   ├── context/          # AuthContext, TripContext
│   │   ├── pages/            # All 13 Screens
│   │   │   ├── admin/        # AdminDashboardPage
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CreateTripPage.jsx
│   │   │   ├── MyTripsPage.jsx
│   │   │   ├── ItineraryBuilderPage.jsx
│   │   │   ├── ItineraryViewPage.jsx
│   │   │   ├── CitySearchPage.jsx
│   │   │   ├── ActivitySearchPage.jsx
│   │   │   ├── TripBudgetPage.jsx
│   │   │   ├── TripCalendarPage.jsx
│   │   │   ├── PublicTripPage.jsx
│   │   │   └── ProfileSettingsPage.jsx
│   │   ├── routes/           # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/         # api.js, authService, tripService, cityService, activityService, adminService
│   │   ├── utils/            # formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css         # Modern design tokens, glassmorphism, responsive grid
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
│   ├── seed/                 # seedData.js (14 global cities, 25+ activities, demo users, sample trips)
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
Populate 14 global destinations (Mumbai, Delhi, Goa, Jaipur, Paris, London, Rome, Tokyo, Dubai, etc.), rich activities, demo users, and sample itineraries:
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

In a second terminal, start the Frontend Client (Port 5173):
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
| **Standard User** | `priya.sharma@example.com` | `password123` |

*(You can also use the 1-Click Demo Login buttons directly on the Login Screen)*

---

## 🌐 API Overview

| Endpoint | Method | Description | Access |
|---|---|---|---|
| `/api/auth/register` | `POST` | Register a new traveler | Public |
| `/api/auth/login` | `POST` | User login & JWT generation | Public |
| `/api/auth/me` | `GET` | Get current user profile | Private |
| `/api/users/profile` | `PUT` | Update profile / language / password | Private |
| `/api/users/saved-destinations` | `GET` | Get bookmarked destination cities | Private |
| `/api/trips` | `GET` / `POST` | Get user trips / Create new trip | Private |
| `/api/trips/:id` | `GET` / `PUT` / `DELETE` | Manage trip details | Private |
| `/api/trips/:id/stops` | `POST` | Add destination stop | Private |
| `/api/trips/:id/stops/reorder` | `PUT` | Reorder destination stops | Private |
| `/api/trips/:id/stops/:stopId/activities` | `POST` | Assign activity to stop | Private |
| `/api/trips/:id/stops/:stopId/expenses` | `POST` | Log stop expense | Private |
| `/api/trips/:id/budget` | `GET` | Calculate full budget analytics | Private |
| `/api/trips/:id/duplicate` | `POST` | Clone an existing trip | Private |
| `/api/cities` | `GET` | Search and filter global cities | Public |
| `/api/activities` | `GET` | Discover experiences & tours | Public |
| `/api/public/trips/:slug` | `GET` | View read-only public itinerary | Public |
| `/api/public/trips/:slug/copy` | `POST` | Clone public itinerary to user account | Private |
| `/api/admin/dashboard` | `GET` | Platform KPI stats & analytics | Admin |
| `/api/admin/users` | `GET` | User administration list | Admin |
| `/api/admin/users/:id/status` | `PATCH` | Activate / Deactivate user | Admin |

---

## 🏆 Hackathon Quality Checklist

```text
[✓] Screen 1: Login / Signup / Forgot Password Flow with JWT
[✓] Screen 2: Dashboard / Home with KPI Stats & Inspirations
[✓] Screen 3: Create Trip with Date Validations & Presets
[✓] Screen 4: My Trips List & Grid with Status Filters & Search
[✓] Screen 5: Itinerary Builder with Multi-Stop Ordering & Activity Assignment
[✓] Screen 6: Itinerary View with Structured & Timeline Modes
[✓] Screen 7: City Search with Cost Index & Region Filters
[✓] Screen 8: Activity Search with Rating, Duration, Category Filters
[✓] Screen 9: Trip Budget with Donut & Bar Charts and Overbudget Alerts
[✓] Screen 10: Trip Calendar with Day Carousel and Hourly Schedule
[✓] Screen 11: Public / Shared Itinerary with Read-Only View & Social Links
[✓] Screen 12: Copy Trip Feature (Clones itinerary to user account)
[✓] Screen 13: User Profile / Settings & Saved Destinations Gallery
[✓] Screen 14: Admin Analytics Dashboard & User Management Tools
[✓] MongoDB & Mongoose Relational Structure & Auto-recalculations
[✓] Fully Responsive Design for Mobile, Tablet, and Desktop
```

Developed with passion for **GlobeTrotter — Empowering Personalized Travel Planning**.
