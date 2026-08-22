import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Compass,
  Sparkles,
  MapPin,
  Route,
  Wallet,
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  CheckCircle2,
  Users,
  Share2,
  Heart,
  Star,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Globe2,
  Layers,
  Wand2,
  Bot,
  SlidersHorizontal,
  ThumbsUp,
  MessageSquare,
  Copy,
  Camera,
  Award,
  Play,
  Check,
  XCircle,
  Activity,
  Flame,
  Coffee,
  Mountain,
  UtensilsCrossed,
  Landmark,
  TreePalm,
  Building2,
  Luggage,
  Search,
} from 'lucide-react';

// Preset Trips for Interactive Hero Preview
const DEMO_TRIPS = [
  {
    id: 'west-coast',
    title: 'West Coast Coastal Circuit',
    duration: '5 Days',
    budget: '₹23,800',
    originalBudget: '₹28,500',
    citiesCount: 3,
    cities: ['Ahmedabad', 'Mumbai', 'Goa'],
    travelTime: '14 hrs',
    activitiesCount: 12,
    score: 93,
    badge: 'AI Optimized',
    highlights: ['Sunset Yacht Cruise', 'Old Goa Heritage Walk', 'Marine Drive Sunset', 'Malvan Water Sports'],
    days: [
      { day: 'Day 1', city: 'Ahmedabad → Mumbai', detail: 'Express Transit • Heritage Walk • Chowpatty Food Tour' },
      { day: 'Day 2', city: 'Mumbai', detail: 'Gateway of India • Marine Drive Sunset • Colaba Nightlife' },
      { day: 'Day 3', city: 'Mumbai → Goa', detail: 'Scenic Coastal Route • Beach Check-in • Calangute Dinner' },
      { day: 'Day 4', city: 'Goa', detail: 'Scuba Diving at Grand Island • Fort Aguada Sunset' },
      { day: 'Day 5', city: 'Goa', detail: 'Latin Quarter Walk in Fontainhas • Souvenir Shopping' },
    ],
  },
  {
    id: 'rajasthan-heritage',
    title: 'Royal Rajasthan Golden Circuit',
    duration: '7 Days',
    budget: '₹28,500',
    originalBudget: '₹34,000',
    citiesCount: 3,
    cities: ['Delhi', 'Agra', 'Jaipur'],
    travelTime: '11 hrs',
    activitiesCount: 16,
    score: 95,
    badge: 'Best Value',
    highlights: ['Taj Mahal Sunrise', 'Amber Fort Jeep Safari', 'Chokhi Dhani Rajasthani Feast', 'City Palace Tour'],
    days: [
      { day: 'Day 1-2', city: 'Delhi', detail: 'Red Fort • Chandni Chowk Food Trail • Qutub Minar' },
      { day: 'Day 3-4', city: 'Agra', detail: 'Taj Mahal Sunrise • Agra Fort • Mehtab Bagh View' },
      { day: 'Day 5-7', city: 'Jaipur', detail: 'Amber Fort • Hawa Mahal • Jal Mahal Sunset' },
    ],
  },
  {
    id: 'himalayan-escape',
    title: 'Himalayan Mountain Retreat',
    duration: '6 Days',
    budget: '₹32,000',
    originalBudget: '₹38,200',
    citiesCount: 3,
    cities: ['Chandigarh', 'Manali', 'Solang Valley'],
    travelTime: '16 hrs',
    activitiesCount: 14,
    score: 91,
    badge: 'Adventure Focus',
    highlights: ['Solang Paragliding', 'Atal Tunnel Drive', 'Old Manali Cafe Crawl', 'Hadimba Temple Walk'],
    days: [
      { day: 'Day 1', city: 'Chandigarh → Manali', detail: 'Scenic Mountain Transit • Beas River View' },
      { day: 'Day 2-4', city: 'Manali & Solang', detail: 'Paragliding • Snow Activities • Cafe Hopping' },
      { day: 'Day 5-6', city: 'Kasol & Manikaran', detail: 'Parvati Valley Trek • Hot Springs Bath' },
    ],
  },
];

// Quick Actions for AI Copilot Simulation
const COPILOT_ACTIONS = [
  {
    id: 'cheaper',
    label: 'Make it cheaper',
    userText: 'Can you optimize stays and transport to lower the total budget under ₹20,000?',
    aiText: 'Done! Replaced 4-star boutique stays with highly-rated heritage homestays and switched to Vande Bharat Express. New estimated budget: ₹19,200 (saved ₹4,600)!',
    statBadge: '₹4,600 Saved',
  },
  {
    id: 'adventure',
    label: 'Add adventure',
    userText: 'Include thrilling outdoor and adventure activities.',
    aiText: 'Added Scuba Diving at Grand Island, Scallop Kayaking in South Goa, and Parasailing at Baga Beach while preserving your relaxed evening schedule!',
    statBadge: '+3 Adventure Activities',
  },
  {
    id: 'relaxed',
    label: 'Make it more relaxed',
    userText: 'The schedule feels a bit packed. Give me more downtime.',
    aiText: 'Adjusted pace: reduced daily activities to 2 per day, added 3-hour open slots for beach relaxation and café visits in Fontainhas.',
    statBadge: 'Balanced Pace Score: 96',
  },
  {
    id: 'optimize-route',
    label: 'Optimize route',
    userText: 'Re-order cities to minimize backtracking and road transit.',
    aiText: 'Re-sequenced route from [Ahmedabad → Goa → Mumbai] to [Ahmedabad → Mumbai → Goa]. Cut out 4.5 hours of unnecessary travel!',
    statBadge: '4.5 hrs Travel Saved',
  },
  {
    id: 'add-day',
    label: 'Add one more day',
    userText: 'Extend this trip to 6 Days with cultural highlights.',
    aiText: 'Extended itinerary to 6 Days. Added Day 6 dedicated to Spice Plantation Tour, Dudhsagar Waterfalls trek, and authentic Goan lunch.',
    statBadge: '6 Days • 14 Activities',
  },
];

// Personalities Data
const TRAVEL_PERSONALITIES = [
  {
    id: 'adventure',
    title: 'Adventure',
    icon: Flame,
    color: '#f97316',
    description: 'Prioritize outdoor experiences, exciting activities, kayaking, trekking and active destinations.',
    sampleDestinations: ['Manali', 'Rishikesh', 'Goa', 'Leh Ladakh'],
    recommendation: 'Try white-water rafting in Rishikesh followed by cliff jumping and riverside camping under stars.',
  },
  {
    id: 'relaxed',
    title: 'Relaxed',
    icon: Coffee,
    color: '#10b981',
    description: 'Unwind with slow travel, beachside stays, spa retreats, and unhurried café mornings.',
    sampleDestinations: ['Varkala', 'Pondicherry', 'Coorg', 'Udaipur'],
    recommendation: 'Stay in a French Quarter villa in Pondicherry with morning croissant walks and sunset beach meditation.',
  },
  {
    id: 'budget',
    title: 'Budget',
    icon: Wallet,
    color: '#0284c7',
    description: 'Maximize experiences while staying cost-smart with hostel stays, public transit, and street food.',
    sampleDestinations: ['Jaipur', 'Varanasi', 'McLeod Ganj', 'Gokarna'],
    recommendation: 'Backpack through Varanasi ghats with ₹1,200/day daily budget including boat rides and thali feasts.',
  },
  {
    id: 'luxury',
    title: 'Luxury',
    icon: Sparkles,
    color: '#8b5cf6',
    description: 'Premium heritage palace stays, fine dining, private charters, and VIP concierge experiences.',
    sampleDestinations: ['Udaipur', 'Dubai', 'Maldives', 'Jaipur'],
    recommendation: 'Private lake-view suite at Lake Palace Udaipur with private boat transfers and royal thali dining.',
  },
  {
    id: 'foodie',
    title: 'Foodie',
    icon: UtensilsCrossed,
    color: '#ec4899',
    description: 'Curated by tastebuds: night markets, street food walks, cooking classes, and iconic local eateries.',
    sampleDestinations: ['Amritsar', 'Old Delhi', 'Kolkata', 'Hyderabad'],
    recommendation: 'Midnight street food trail in Old Delhi trying 80-year-old paranthe, rabri jalebi, and Karim’s kebabs.',
  },
  {
    id: 'nature',
    title: 'Nature',
    icon: Mountain,
    color: '#059669',
    description: 'Immerse in national parks, lush tea estates, waterfalls, and scenic wildlife sanctuaries.',
    sampleDestinations: ['Wayanad', 'Munnar', 'Kaziranga', 'Meghalaya'],
    recommendation: 'Trek living root bridges in Cherrapunji and stay in eco-lodges surrounded by cloud forests.',
  },
  {
    id: 'culture',
    title: 'Culture',
    icon: Landmark,
    color: '#d97706',
    description: 'Explore UNESCO heritage sites, ancient temples, artisan villages, and architectural marvels.',
    sampleDestinations: ['Hampi', 'Madurai', 'Varanasi', 'Khajuraho'],
    recommendation: 'Bicycle tour across 14th-century Vijayanagara ruins in Hampi with expert local historian guide.',
  },
  {
    id: 'photography',
    title: 'Photography',
    icon: Camera,
    color: '#06b6d4',
    description: 'Golden hour vantage points, dramatic landscapes, colorful streetscapes, and drone spots.',
    sampleDestinations: ['Jodhpur', 'Varanasi', 'Ladakh', 'Spiti'],
    recommendation: 'Sunrise shoot at Jodhpur Blue City rooftop viewpoints followed by Pangong Lake starry sky astrophotography.',
  },
  {
    id: 'family',
    title: 'Family',
    icon: Users,
    color: '#6366f1',
    description: 'Balanced itineraries suitable for all ages with comfortable transport, kid-friendly activities, and safety.',
    sampleDestinations: ['Ooty', 'Mysore', 'Singapore', 'Goa'],
    recommendation: 'Toy train ride in Ooty, visits to botanical gardens, and private family beach villa with pool.',
  },
  {
    id: 'backpacker',
    title: 'Backpacker',
    icon: Luggage,
    color: '#14b8a6',
    description: 'Spontaneous multi-destination circuits, dorm hostel banter, communal cooking, and offbeat trails.',
    sampleDestinations: ['Kasol', 'Hampi', 'Pushkar', 'Gokarna'],
    recommendation: 'Cliff-side hostel stays in Gokarna with beach treks to Kudle, Half-Moon, and Paradise beaches.',
  },
];

// Public Curated Trips
const PUBLIC_TRIPS = [
  {
    id: 'trip-1',
    slug: 'rajasthan-royal-7d',
    title: '7 Days Royal Rajasthan Odyssey',
    budget: '₹28,500',
    days: 7,
    citiesCount: 3,
    style: 'Culture • Food • Photography',
    score: 92,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    creator: 'Aarav Sharma',
    savesCount: 1420,
    tags: ['Culture', 'Heritage', 'Foodie'],
  },
  {
    id: 'trip-2',
    slug: 'goa-coastal-5d',
    title: '5 Days Goa Sun, Beach & Culture',
    budget: '₹22,400',
    days: 5,
    citiesCount: 3,
    style: 'Relaxed • Beach • Nightlife',
    score: 95,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    creator: 'Priya Verma',
    savesCount: 2180,
    tags: ['Beach', 'Relaxed'],
  },
  {
    id: 'trip-3',
    slug: 'kerala-nature-6d',
    title: '6 Days Kerala Backwaters & Tea Hills',
    budget: '₹34,000',
    days: 6,
    citiesCount: 3,
    style: 'Nature • Wellness • Scenic',
    score: 94,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    creator: 'Rohan Mehta',
    savesCount: 980,
    tags: ['Nature', 'Wellness'],
  },
  {
    id: 'trip-4',
    slug: 'himalaya-adventure-6d',
    title: '6 Days Himachal Mountain Trail',
    budget: '₹31,500',
    days: 6,
    citiesCount: 4,
    style: 'Adventure • Trekking • Cafe',
    score: 91,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    creator: 'Sneha Patel',
    savesCount: 1650,
    tags: ['Adventure', 'Nature'],
  },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State for Hero Demo
  const [selectedDemoTrip, setSelectedDemoTrip] = useState(DEMO_TRIPS[0]);

  // State for AI Copilot Demo
  const [activeCopilotAction, setActiveCopilotAction] = useState(COPILOT_ACTIONS[0]);

  // State for Personality Selector
  const [selectedPersonality, setSelectedPersonality] = useState(TRAVEL_PERSONALITIES[0]);

  // State for Optimization Before/After Toggle
  const [isOptimized, setIsOptimized] = useState(true);

  // State for Trip Simulator Scenarios
  const [simState, setSimState] = useState({
    extraDay: false,
    lowerBudget: false,
    extraCity: false,
    fastFlight: false,
  });

  // State for Journey Steps
  const [activeStep, setActiveStep] = useState(1);

  // State for Public Trips Filter
  const [activeTripFilter, setActiveTripFilter] = useState('All');

  // Handle CTA Planning click
  const handleStartPlanning = () => {
    if (isAuthenticated) {
      navigate('/trips/create');
    } else {
      navigate('/signup');
    }
  };

  // Handle Copy Trip
  const handleCopyTrip = (tripTitle) => {
    toast.success(`Copied "${tripTitle}" into your travel builder!`);
    if (isAuthenticated) {
      navigate('/trips/create');
    } else {
      navigate('/signup');
    }
  };

  // Calculate dynamic Simulator results
  const calculateSimResult = () => {
    let budget = 23800;
    let durationDays = 5;
    let travelHours = 14;
    let score = 91;

    if (simState.extraDay) {
      budget += 3500;
      durationDays += 1;
      score += 2;
    }
    if (simState.lowerBudget) {
      budget -= 4500;
      score -= 3;
    }
    if (simState.extraCity) {
      budget += 2800;
      travelHours += 4;
      score += 3;
    }
    if (simState.fastFlight) {
      budget += 3200;
      travelHours = Math.max(4, travelHours - 7);
      score += 4;
    }

    return { budget, durationDays, travelHours, score: Math.min(99, score) };
  };

  const simResult = calculateSimResult();

  // Filter public trips
  const filteredPublicTrips = PUBLIC_TRIPS.filter((t) => {
    if (activeTripFilter === 'All') return true;
    return t.tags.includes(activeTripFilter);
  });

  return (
    <div className="landing-page-wrapper">
      {/* =================================================================== */}
      {/* 1. HERO SECTION & HERO INTERACTIVE DEMO */}
      {/* =================================================================== */}
      <section className="hero-section">
        <div className="hero-background-shapes">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="grid-overlay"></div>
        </div>

        <div className="hero-container">
          <div className="hero-grid">
            {/* Left Hero Content */}
            <div className="hero-text-content animate-slide-up">
              <div className="hero-badge">
                <Sparkles size={16} className="badge-icon-sparkle" />
                <span>Next-Gen Intelligent Travel Platform</span>
              </div>

              <h1 className="hero-headline">
                Plan Less. <span className="gradient-text">Explore More.</span>
              </h1>

              <p className="hero-subtext">
                GlobeTrotter transforms your travel ideas into intelligent, personalized and optimized journeys — from the first destination to the final memory.
              </p>

              <div className="hero-cta-group">
                <button
                  type="button"
                  onClick={handleStartPlanning}
                  className="btn btn-primary btn-lg hero-cta-primary"
                >
                  <Sparkles size={18} />
                  <span>Start Planning</span>
                  <ArrowRight size={18} />
                </button>

                <a
                  href="#explore"
                  className="btn btn-secondary btn-lg hero-cta-secondary"
                >
                  <Compass size={18} />
                  <span>Explore Trips</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="hero-trust-metrics">
                <div className="trust-item">
                  <div className="trust-avatars">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="User" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="User" />
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="User" />
                  </div>
                  <div>
                    <div className="trust-rating">
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span className="rating-score">4.9 / 5</span>
                    </div>
                    <span className="trust-label">Loved by 25,000+ smart travelers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Component: Multi-City Journey Visual */}
            <div className="hero-visual-card animate-fade">
              <div className="card-glass hero-canvas-box">
                {/* Header Tag */}
                <div className="canvas-header">
                  <div className="canvas-live-badge">
                    <span className="pulse-dot"></span>
                    <span>AI Route Canvas</span>
                  </div>
                  <div className="canvas-score-pill">
                    <Zap size={14} color="#f59e0b" />
                    <span>Trip Score: {selectedDemoTrip.score}/100</span>
                  </div>
                </div>

                {/* Animated Interactive City Route Nodes */}
                <div className="route-visual-map">
                  <svg className="route-svg-lines" viewBox="0 0 500 120">
                    <path
                      d="M 50 60 Q 200 15, 250 60 T 450 60"
                      fill="none"
                      stroke="url(#route-grad)"
                      strokeWidth="3.5"
                      strokeDasharray="6,6"
                      className="animated-dash-line"
                    />
                    <defs>
                      <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="city-nodes-wrapper">
                    {selectedDemoTrip.cities.map((city, idx) => (
                      <div key={city} className={`city-node-marker step-${idx}`}>
                        <div className="node-icon-circle">
                          <MapPin size={16} />
                        </div>
                        <span className="node-city-name">{city}</span>
                        <span className="node-day-tag">Day {idx * 2 + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Preset Selector Tabs */}
                <div className="hero-demo-tabs">
                  <span className="demo-tabs-label">Sample Preset Trips:</span>
                  <div className="demo-pills-list">
                    {DEMO_TRIPS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedDemoTrip(t)}
                        className={`demo-tab-chip ${selectedDemoTrip.id === t.id ? 'active' : ''}`}
                      >
                        {t.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Hero Demo Metrics Strip (SECTION 2 REQUIREMENT) */}
                <div className="hero-demo-preview-card">
                  <div className="preview-top-row">
                    <div className="preview-badge-ai">
                      <Bot size={14} />
                      <span>{selectedDemoTrip.badge}</span>
                    </div>
                    <div className="preview-stats-pills">
                      <span>{selectedDemoTrip.duration}</span>
                      <span>•</span>
                      <span>{selectedDemoTrip.budget}</span>
                      <span>•</span>
                      <span>{selectedDemoTrip.citiesCount} Cities</span>
                    </div>
                  </div>

                  <div className="preview-metrics-grid">
                    <div className="metric-box">
                      <span className="metric-lbl">Total Budget</span>
                      <span className="metric-val text-primary">{selectedDemoTrip.budget}</span>
                      <span className="metric-sub">Est. vs {selectedDemoTrip.originalBudget}</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-lbl">Travel Time</span>
                      <span className="metric-val">{selectedDemoTrip.travelTime}</span>
                      <span className="metric-sub">Optimized Route</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-lbl">Curated Activities</span>
                      <span className="metric-val">{selectedDemoTrip.activitiesCount} Places</span>
                      <span className="metric-sub">Paced Comfortably</span>
                    </div>
                    <div className="metric-box score-box">
                      <span className="metric-lbl">Trip Score</span>
                      <span className="metric-val text-success">{selectedDemoTrip.score}/100</span>
                      <span className="metric-sub">High Quality</span>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="preview-highlights-list">
                    {selectedDemoTrip.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="highlight-tag">
                        <CheckCircle2 size={12} color="#10b981" /> {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. TRUST / VALUE STRIP */}
      {/* =================================================================== */}
      <section className="value-strip-section">
        <div className="landing-container">
          <div className="value-strip-grid">
            <div className="value-strip-item">
              <div className="value-icon-box icon-purple">
                <Sparkles size={20} />
              </div>
              <div className="value-text">
                <h3>Plan Smarter</h3>
                <p>AI-assisted itinerary planning</p>
              </div>
            </div>

            <div className="value-strip-item">
              <div className="value-icon-box icon-emerald">
                <Wallet size={20} />
              </div>
              <div className="value-text">
                <h3>Stay on Budget</h3>
                <p>Real-time trip cost insights</p>
              </div>
            </div>

            <div className="value-strip-item">
              <div className="value-icon-box icon-blue">
                <Route size={20} />
              </div>
              <div className="value-text">
                <h3>Travel Efficiently</h3>
                <p>Optimized routes and schedules</p>
              </div>
            </div>

            <div className="value-strip-item">
              <div className="value-icon-box icon-amber">
                <Users size={20} />
              </div>
              <div className="value-text">
                <h3>Share the Journey</h3>
                <p>Collaborate with friends</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. "TRAVEL PLANNING, REIMAGINED" */}
      {/* =================================================================== */}
      <section className="reimagined-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">The GlobeTrotter Difference</span>
            <h2 className="section-title">Your Trip Shouldn't Be a Spreadsheet.</h2>
            <p className="section-desc">
              Traditional travel planning forces you to juggle dozens of browser tabs, fragmented notes, budget calculators, and chat apps. GlobeTrotter brings everything into one connected, intelligent experience.
            </p>
          </div>

          <div className="transformation-comparison-grid">
            {/* Left: Messy Planning */}
            <div className="comparison-card messy-card">
              <div className="card-header-badge messy-badge">
                <XCircle size={16} />
                <span>Messy Traditional Planning</span>
              </div>
              <div className="messy-items-list">
                <div className="messy-item">
                  <MapPin size={18} className="item-icon-red" />
                  <span>Google Maps App (Separate Tabs)</span>
                </div>
                <div className="messy-item">
                  <Calendar size={18} className="item-icon-orange" />
                  <span>Notes App & Excel Sheets</span>
                </div>
                <div className="messy-item">
                  <Wallet size={18} className="item-icon-amber" />
                  <span>Expense Trackers & Calculators</span>
                </div>
                <div className="messy-item">
                  <Search size={18} className="item-icon-purple" />
                  <span>Random Activity Blog Lists</span>
                </div>
                <div className="messy-item">
                  <MessageSquare size={18} className="item-icon-blue" />
                  <span>Scattered WhatsApp Group Chats</span>
                </div>
              </div>
              <div className="comparison-footer-tag text-muted">
                Result: Stressful, chaotic, easy to overspend
              </div>
            </div>

            {/* Center Transformation Indicator */}
            <div className="transformation-arrow-box">
              <div className="arrow-circle">
                <Zap size={24} color="#0284c7" />
              </div>
              <span className="transformation-label">Reimagined</span>
            </div>

            {/* Right: One Intelligent Journey */}
            <div className="comparison-card smart-card card-glass">
              <div className="card-header-badge smart-badge">
                <Sparkles size={16} />
                <span>One Intelligent Journey</span>
              </div>
              <div className="smart-unified-preview">
                <div className="unified-feature-chip">
                  <Bot size={16} /> AI Copilot Route & Activity Builder
                </div>
                <div className="unified-feature-chip">
                  <Wallet size={16} /> Live Real-Time Budget Breakdown
                </div>
                <div className="unified-feature-chip">
                  <Route size={16} /> Distance & Transit Time Optimization
                </div>
                <div className="unified-feature-chip">
                  <Users size={16} /> Real-Time Shared Team Collaboration
                </div>
                <div className="unified-feature-chip">
                  <Camera size={16} /> Automated Travel Memory Journal
                </div>
              </div>
              <div className="comparison-footer-tag text-success">
                Result: Effortless, cost-smart & memorable
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. AI COPILOT SECTION */}
      {/* =================================================================== */}
      <section id="copilot" className="copilot-section">
        <div className="landing-container">
          <div className="copilot-grid">
            {/* Copilot Left Text */}
            <div className="copilot-text-box">
              <div className="section-eyebrow eyebrow-purple">
                <Bot size={16} /> AI Travel Intelligence
              </div>
              <h2 className="section-title">Meet Your AI Travel Copilot.</h2>
              <p className="section-desc">
                Ask questions, tweak budgets, balance pace, or add hidden gems on the fly. Your copilot understands your travel style and optimizes your trip in real time.
              </p>

              <div className="copilot-quick-actions-box">
                <span className="quick-actions-title">Try Interactive Prompt Actions:</span>
                <div className="action-chips-grid">
                  {COPILOT_ACTIONS.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => setActiveCopilotAction(action)}
                      className={`copilot-chip ${activeCopilotAction.id === action.id ? 'active' : ''}`}
                    >
                      <Sparkles size={14} />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="copilot-cta-wrapper">
                <button
                  type="button"
                  onClick={handleStartPlanning}
                  className="btn btn-primary btn-lg"
                >
                  <Wand2 size={18} />
                  <span>Try AI Planning</span>
                </button>
              </div>
            </div>

            {/* Copilot Right Interactive Chat Mockup */}
            <div className="copilot-chat-card card-glass">
              <div className="chat-header">
                <div className="copilot-avatar">
                  <Bot size={20} color="#ffffff" />
                </div>
                <div>
                  <h4 className="copilot-name">GlobeTrotter AI Copilot</h4>
                  <span className="copilot-status">Online • Ready to optimize</span>
                </div>
                <div className="copilot-stat-badge ms-auto">
                  {activeCopilotAction.statBadge}
                </div>
              </div>

              <div className="chat-body">
                {/* Fixed User Initial Prompt */}
                <div className="chat-bubble user-bubble">
                  <p>Plan a 5-day Goa trip under ₹25,000 with adventure activities.</p>
                </div>

                {/* Default AI Response */}
                <div className="chat-bubble ai-bubble">
                  <p>
                    Done. I've created a balanced itinerary with 3 major activities, optimized travel time and kept the estimated budget at ₹23,800.
                  </p>
                </div>

                {/* Interactive Action Prompt from user */}
                <div className="chat-bubble user-bubble animate-slide-up" key={`user-${activeCopilotAction.id}`}>
                  <p>{activeCopilotAction.userText}</p>
                </div>

                {/* Interactive Action Response from AI */}
                <div className="chat-bubble ai-bubble animate-slide-up" key={`ai-${activeCopilotAction.id}`}>
                  <div className="ai-response-header">
                    <Sparkles size={14} color="#8b5cf6" />
                    <span>AI Copilot Updated</span>
                  </div>
                  <p>{activeCopilotAction.aiText}</p>
                </div>
              </div>

              <div className="chat-footer">
                <input
                  type="text"
                  readOnly
                  value="Type a prompt like 'Make it more relaxed' or click buttons above..."
                  className="chat-input"
                />
                <button type="button" onClick={handleStartPlanning} className="chat-send-btn">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. SMART PLANNING SECTION */}
      {/* =================================================================== */}
      <section id="features" className="features-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Intelligent Features</span>
            <h2 className="section-title">Everything You Need for a Perfect Journey</h2>
            <p className="section-desc">
              From real-time budget intelligence to automated route optimization and simulated scenario planning.
            </p>
          </div>

          <div className="features-grid">
            {/* Card 1: Smart Budget */}
            <div className="feature-card" onClick={handleStartPlanning}>
              <div className="card-accent-strip banner-emerald"></div>
              <div className="feature-icon-box icon-emerald mb-2">
                <Wallet size={22} />
              </div>
              <h3>Smart Budget</h3>
              <p>Know where your money goes with automatic cost breakdowns and real-time over-budget warnings.</p>
            </div>

            {/* Card 2: Route Optimizer */}
            <div className="feature-card" onClick={handleStartPlanning}>
              <div className="card-accent-strip banner-blue"></div>
              <div className="feature-icon-box icon-blue mb-2">
                <Route size={22} />
              </div>
              <h3>Route Optimizer</h3>
              <p>Reduce unnecessary travel with automated city sequencing and distance-matrix calculations.</p>
            </div>

            {/* Card 3: Trip Health */}
            <div className="feature-card" onClick={handleStartPlanning}>
              <div className="card-accent-strip banner-purple"></div>
              <div className="feature-icon-box icon-purple mb-2">
                <Activity size={22} />
              </div>
              <h3>Trip Health</h3>
              <p>Understand how balanced your itinerary is across pace, transit fatigue, and activity density.</p>
            </div>

            {/* Card 4: Trip Simulator */}
            <div className="feature-card" onClick={handleStartPlanning}>
              <div className="card-accent-strip banner-orange"></div>
              <div className="feature-icon-box icon-orange mb-2">
                <SlidersHorizontal size={22} />
              </div>
              <h3>Trip Simulator</h3>
              <p>Explore "What If?" scenarios like adding days or switching transport before locking in your plan.</p>
            </div>

            {/* Card 5: Smart Recommendations */}
            <div className="feature-card" onClick={handleStartPlanning}>
              <div className="card-accent-strip banner-amber"></div>
              <div className="feature-icon-box icon-amber mb-2">
                <Sparkles size={22} />
              </div>
              <h3>Smart Recommendations</h3>
              <p>Discover hidden gems, local eateries, and experiences tailored directly to your travel personality.</p>
            </div>

            {/* Card 6: Free-Time Intelligence */}
            <div className="feature-card" onClick={handleStartPlanning}>
              <div className="card-accent-strip banner-rose"></div>
              <div className="feature-icon-box icon-rose mb-2">
                <Clock size={22} />
              </div>
              <h3>Free-Time Intelligence</h3>
              <p>Make the most of your journey with built-in buffer slots so you explore without overplanning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. "BUILD YOUR PERFECT TRIP" (STEP-BY-STEP WORKFLOW) */}
      {/* =================================================================== */}
      <section id="how-it-works" className="workflow-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">Build Your Perfect Trip in 5 Steps</h2>
            <p className="section-desc">
              A clear, connected workflow guiding you from inspiration to cherished travel memories.
            </p>
          </div>

          <div className="journey-line-container">
            <div className="journey-line"></div>

            <div className="steps-grid">
              {/* Step 01 */}
              <div
                className={`step-card ${activeStep === 1 ? 'active' : ''}`}
                onClick={() => setActiveStep(1)}
              >
                <div className="step-num-badge">01</div>
                <h3>Dream</h3>
                <p>Choose destinations and define your travel style & budget preferences.</p>
              </div>

              {/* Step 02 */}
              <div
                className={`step-card ${activeStep === 2 ? 'active' : ''}`}
                onClick={() => setActiveStep(2)}
              >
                <div className="step-num-badge">02</div>
                <h3>Design</h3>
                <p>Build your multi-city itinerary with activities, stays, and day-by-day schedules.</p>
              </div>

              {/* Step 03 */}
              <div
                className={`step-card ${activeStep === 3 ? 'active' : ''}`}
                onClick={() => setActiveStep(3)}
              >
                <div className="step-num-badge">03</div>
                <h3>Optimize</h3>
                <p>Balance budget, transit routes, and daily activity pace using AI intelligence.</p>
              </div>

              {/* Step 04 */}
              <div
                className={`step-card ${activeStep === 4 ? 'active' : ''}`}
                onClick={() => setActiveStep(4)}
              >
                <div className="step-num-badge">04</div>
                <h3>Experience</h3>
                <p>Follow your interactive journey live with real-time updates and group notes.</p>
              </div>

              {/* Step 05 */}
              <div
                className={`step-card ${activeStep === 5 ? 'active' : ''}`}
                onClick={() => setActiveStep(5)}
              >
                <div className="step-num-badge">05</div>
                <h3>Remember</h3>
                <p>Turn your completed itinerary into an automated visual travel story.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. PERSONALIZED TRAVEL PERSONALITY */}
      {/* =================================================================== */}
      <section className="personality-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Personalized AI Matching</span>
            <h2 className="section-title">What Kind of Traveler Are You?</h2>
            <p className="section-desc">
              GlobeTrotter tailors route pacing, stay styles, and activity recommendations based on your unique travel DNA.
            </p>
          </div>

          <div className="personality-selector-pills">
            {TRAVEL_PERSONALITIES.map((p) => {
              const IconComp = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPersonality(p)}
                  className={`personality-pill ${selectedPersonality.id === p.id ? 'active' : ''}`}
                  style={{
                    borderColor: selectedPersonality.id === p.id ? p.color : '',
                  }}
                >
                  <IconComp size={16} style={{ color: p.color }} />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Personality Display Box */}
          <div className="personality-preview-card card-glass animate-fade">
            <div className="personality-preview-header">
              <div className="personality-icon-circle" style={{ background: selectedPersonality.color }}>
                {React.createElement(selectedPersonality.icon, { size: 24, color: '#ffffff' })}
              </div>
              <div>
                <h3 className="personality-title">{selectedPersonality.title} Traveler</h3>
                <p className="personality-desc">{selectedPersonality.description}</p>
              </div>
            </div>

            <div className="personality-body-grid">
              <div className="personality-box">
                <span className="box-lbl">Curated Recommendation</span>
                <p className="box-val">{selectedPersonality.recommendation}</p>
              </div>

              <div className="personality-box">
                <span className="box-lbl">Top Matching Cities</span>
                <div className="city-tags-flex">
                  {selectedPersonality.sampleDestinations.map((dest) => (
                    <span key={dest} className="dest-tag">
                      <MapPin size={12} /> {dest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 9. TRIP OPTIMIZATION VISUAL (BEFORE / AFTER COMPARISON) */}
      {/* =================================================================== */}
      <section className="optimization-visual-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow eyebrow-emerald">Proven Results</span>
            <h2 className="section-title">See the Power of Smart Optimization</h2>
            <p className="section-desc">
              Compare a typical unoptimized travel plan with a GlobeTrotter AI-Optimized journey.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="optimization-toggle-container">
            <span className={`toggle-lbl ${!isOptimized ? 'active-lbl' : ''}`}>Before Optimization</span>
            <button
              type="button"
              onClick={() => setIsOptimized(!isOptimized)}
              className={`toggle-switch-btn ${isOptimized ? 'on' : ''}`}
            >
              <div className="switch-knob"></div>
            </button>
            <span className={`toggle-lbl ${isOptimized ? 'active-lbl text-primary' : ''}`}>
              GlobeTrotter Optimized Plan <Sparkles size={14} />
            </span>
          </div>

          {/* Comparison Cards Showcase */}
          <div className="opt-comparison-box grid-cols-2">
            {/* Card Before */}
            <div className={`opt-card ${!isOptimized ? 'highlighted-opt' : ''}`}>
              <div className="opt-card-header text-danger">
                <h3>Your Original Plan</h3>
                <span className="badge badge-danger">Unoptimized</span>
              </div>

              <div className="opt-metrics-list">
                <div className="opt-metric-row">
                  <span>Estimated Total Budget</span>
                  <strong className="text-danger">₹31,500</strong>
                </div>
                <div className="opt-metric-row">
                  <span>Total Travel & Transit</span>
                  <strong>18 hours</strong>
                </div>
                <div className="opt-metric-row">
                  <span>Backtracking Penalty</span>
                  <span className="text-danger">High (3 redundant routes)</span>
                </div>
                <div className="opt-metric-row">
                  <span>Overall Trip Score</span>
                  <strong className="score-badge score-low">68 / 100</strong>
                </div>
              </div>
            </div>

            {/* Card After */}
            <div className={`opt-card card-glass ${isOptimized ? 'highlighted-opt-success' : ''}`}>
              <div className="opt-card-header text-success">
                <h3>GlobeTrotter Optimized Plan</h3>
                <span className="badge badge-success">AI Optimized</span>
              </div>

              <div className="opt-metrics-list">
                <div className="opt-metric-row">
                  <span>Estimated Total Budget</span>
                  <strong className="text-success">₹25,800</strong>
                </div>
                <div className="opt-metric-row">
                  <span>Total Travel & Transit</span>
                  <strong className="text-success">13 hours</strong>
                </div>
                <div className="opt-metric-row">
                  <span>Backtracking Penalty</span>
                  <span className="text-success">Zero (Sequential Matrix)</span>
                </div>
                <div className="opt-metric-row">
                  <span>Overall Trip Score</span>
                  <strong className="score-badge score-high">91 / 100</strong>
                </div>
              </div>

              {/* Highlights Badge Summary */}
              <div className="opt-highlights-strip">
                <div className="opt-highlight-item text-success">
                  <CheckCircle2 size={16} /> <strong>₹5,700 saved</strong>
                </div>
                <div className="opt-highlight-item text-primary">
                  <Clock size={16} /> <strong>5 hours saved</strong>
                </div>
                <div className="opt-highlight-item text-purple">
                  <TrendingUp size={16} /> <strong>Better activity distribution</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 10. TRIP SIMULATOR SECTION */}
      {/* =================================================================== */}
      <section id="simulator" className="simulator-section">
        <div className="landing-container">
          <div className="sim-box card-glass">
            <div className="sim-header">
              <div>
                <span className="section-eyebrow">Interactive What-If Builder</span>
                <h2 className="sim-title">What If You Changed the Plan?</h2>
                <p className="sim-desc">
                  Toggle hypothetical scenario variables below to instantly simulate the impact on cost, transit time, and trip score!
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartPlanning}
                className="btn btn-primary btn-lg"
              >
                <SlidersHorizontal size={18} />
                <span>Simulate Your Trip</span>
              </button>
            </div>

            {/* Scenario Toggles */}
            <div className="sim-controls-grid">
              <button
                type="button"
                onClick={() => setSimState({ ...simState, extraDay: !simState.extraDay })}
                className={`sim-toggle-btn ${simState.extraDay ? 'active' : ''}`}
              >
                <span>+1 Day</span>
                <small>{simState.extraDay ? 'Added' : 'Click to add'}</small>
              </button>

              <button
                type="button"
                onClick={() => setSimState({ ...simState, lowerBudget: !simState.lowerBudget })}
                className={`sim-toggle-btn ${simState.lowerBudget ? 'active' : ''}`}
              >
                <span>-₹5,000 Budget</span>
                <small>{simState.lowerBudget ? 'Applied' : 'Click to trim'}</small>
              </button>

              <button
                type="button"
                onClick={() => setSimState({ ...simState, extraCity: !simState.extraCity })}
                className={`sim-toggle-btn ${simState.extraCity ? 'active' : ''}`}
              >
                <span>+1 Destination (Kochi)</span>
                <small>{simState.extraCity ? 'Added' : 'Click to add'}</small>
              </button>

              <button
                type="button"
                onClick={() => setSimState({ ...simState, fastFlight: !simState.fastFlight })}
                className={`sim-toggle-btn ${simState.fastFlight ? 'active' : ''}`}
              >
                <span>Change Transport (Flight)</span>
                <small>{simState.fastFlight ? 'Flight selected' : 'Train selected'}</small>
              </button>
            </div>

            {/* Live Simulated Result Bar */}
            <div className="sim-result-bar">
              <div className="sim-res-col">
                <span className="sim-res-lbl">Simulated Budget</span>
                <span className="sim-res-val text-primary">₹{simResult.budget.toLocaleString()}</span>
              </div>
              <div className="sim-res-col">
                <span className="sim-res-lbl">Trip Duration</span>
                <span className="sim-res-val">{simResult.durationDays} Days</span>
              </div>
              <div className="sim-res-col">
                <span className="sim-res-lbl">Est. Transit Time</span>
                <span className="sim-res-val">{simResult.travelHours} Hours</span>
              </div>
              <div className="sim-res-col">
                <span className="sim-res-lbl">Simulated Score</span>
                <span className="sim-res-val text-success">{simResult.score}/100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 11. COLLABORATIVE TRAVEL SECTION */}
      {/* =================================================================== */}
      <section className="collab-section">
        <div className="landing-container">
          <div className="collab-grid">
            <div className="collab-text">
              <span className="section-eyebrow eyebrow-blue">Real-Time Teamwork</span>
              <h2 className="section-title">Plan Together. Decide Together.</h2>
              <p className="section-desc">
                Invite friends and family to your trip workspace. Suggest activities, vote on stay options, comment on schedules, and approve changes together without endless chat threads.
              </p>

              <ul className="collab-bullet-list">
                <li>
                  <CheckCircle2 size={18} color="#10b981" /> Live multi-user cursor & avatar updates
                </li>
                <li>
                  <CheckCircle2 size={18} color="#10b981" /> Activity upvoting & instant poll consensus
                </li>
                <li>
                  <CheckCircle2 size={18} color="#10b981" /> Automatic budget splitting across group members
                </li>
              </ul>
            </div>

            {/* Collaborative UI Mockup */}
            <div className="collab-card card-glass">
              <div className="collab-card-header">
                <div className="collab-avatars">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Aarav" title="Aarav" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Priya" title="Priya" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Rohan" title="Rohan" />
                  <span className="avatar-more">+2</span>
                </div>
                <span className="badge badge-success">
                  <Users size={12} /> 4 Editing Live
                </span>
              </div>

              <div className="collab-activity-list">
                <div className="collab-activity-item">
                  <div className="activity-info">
                    <h4>Grand Island Scuba Diving & Snorkeling</h4>
                    <span className="activity-meta">Day 3 • Goa • ₹3,500 / person</span>
                  </div>
                  <div className="activity-votes">
                    <button type="button" className="vote-btn active-vote">
                      <ThumbsUp size={14} /> <span>4</span>
                    </button>
                    <span className="status-tag tag-approved">Approved</span>
                  </div>
                </div>

                <div className="collab-activity-item">
                  <div className="activity-info">
                    <h4>Fontainhas Heritage Latin Quarter Walk</h4>
                    <span className="activity-meta">Day 4 • Panjim • ₹500 / person</span>
                  </div>
                  <div className="activity-votes">
                    <button type="button" className="vote-btn">
                      <ThumbsUp size={14} /> <span>3</span>
                    </button>
                    <span className="status-tag tag-discussion">Voting</span>
                  </div>
                </div>
              </div>

              <div className="collab-chat-snippet">
                <MessageSquare size={16} color="#0284c7" />
                <span>
                  <strong>Aarav:</strong> "I added the sunset boat cruise for Day 3 evening. What do you think?"
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 12. PUBLIC TRIP DISCOVERY */}
      {/* =================================================================== */}
      <section id="explore" className="discovery-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Community Inspiration</span>
            <h2 className="section-title">Get Inspired by Real Journeys</h2>
            <p className="section-desc">
              Browse itineraries created by experienced travelers. Copy any trip directly into your personal workspace and customize it in seconds.
            </p>

            {/* Filters */}
            <div className="trip-filters-flex">
              {['All', 'Culture', 'Beach', 'Nature', 'Adventure', 'Wellness'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveTripFilter(filter)}
                  className={`filter-chip ${activeTripFilter === filter ? 'active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="public-trips-grid">
            {filteredPublicTrips.map((trip) => (
              <div key={trip.id} className="public-trip-card card">
                <div className="trip-card-img-wrapper">
                  <img src={trip.image} alt={trip.title} className="trip-card-img" />
                  <div className="trip-score-badge">
                    <Zap size={12} color="#f59e0b" />
                    <span>{trip.score}/100</span>
                  </div>
                </div>

                <div className="trip-card-body">
                  <span className="trip-style-tag">{trip.style}</span>
                  <h3 className="trip-card-title">{trip.title}</h3>

                  <div className="trip-card-meta">
                    <span>{trip.days} Days</span>
                    <span>•</span>
                    <span>{trip.citiesCount} Cities</span>
                    <span>•</span>
                    <strong className="text-primary">{trip.budget}</strong>
                  </div>

                  <div className="trip-card-actions">
                    <Link to={`/explore/cities`} className="btn btn-secondary btn-sm flex-1">
                      Explore Trip
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCopyTrip(trip.title)}
                      className="btn btn-primary btn-sm copy-trip-btn"
                    >
                      <Copy size={14} />
                      <span>Copy This Trip</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/explore/cities" className="btn btn-secondary btn-lg">
              <Compass size={18} />
              <span>Explore All Destinations</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 13. TRAVEL MEMORY SECTION */}
      {/* =================================================================== */}
      <section className="memory-section">
        <div className="landing-container">
          <div className="memory-grid">
            <div className="memory-card card-glass">
              <div className="memory-header">
                <div className="memory-title-wrap">
                  <Camera size={20} color="#ec4899" />
                  <h3>My Travel Journal — Goa Coastal Circuit</h3>
                </div>
                <span className="badge badge-primary">Completed Trip</span>
              </div>

              <div className="memory-photo-grid">
                <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80" alt="Memory 1" />
                <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80" alt="Memory 2" />
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80" alt="Memory 3" />
              </div>

              <div className="memory-stats-strip">
                <div>
                  <span className="lbl">Places Visited</span>
                  <strong>14 Destinations</strong>
                </div>
                <div>
                  <span className="lbl">Total Spending</span>
                  <strong className="text-success">₹23,400</strong>
                </div>
                <div>
                  <span className="lbl">Journal Badges</span>
                  <strong>Sunset Explorer 🌅</strong>
                </div>
              </div>
            </div>

            <div className="memory-text">
              <span className="section-eyebrow eyebrow-rose">Post-Trip Memories</span>
              <h2 className="section-title">Plan the Journey. Keep the Memories.</h2>
              <p className="section-desc">
                When your trip ends, GlobeTrotter automatically transforms your itinerary, saved photos, activity notes, and expense receipts into a beautiful digital travel story.
              </p>

              <button
                type="button"
                onClick={handleStartPlanning}
                className="btn btn-primary btn-lg"
              >
                <Camera size={18} />
                <span>Create Your Travel Story</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 14. TRIP SCORE SECTION */}
      {/* =================================================================== */}
      <section className="trip-score-section">
        <div className="landing-container">
          <div className="score-showcase-card card-glass">
            <div className="score-grid">
              {/* Left Score Ring */}
              <div className="score-circle-wrapper">
                <div className="score-circle-gauge">
                  <span className="score-big-num">91</span>
                  <span className="score-out-of">/ 100</span>
                </div>
                <span className="score-badge-label">GlobeTrotter Trip Score</span>
              </div>

              {/* Right Score Breakdown */}
              <div className="score-details-wrapper">
                <span className="section-eyebrow eyebrow-amber">Quality Assessment</span>
                <h2 className="score-headline">Know How Good Your Trip Really Is.</h2>

                <div className="score-bars-list">
                  <div className="score-bar-item">
                    <div className="bar-header">
                      <span>Budget Efficiency</span>
                      <strong>94 / 100</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '94%', background: '#10b981' }}></div>
                    </div>
                  </div>

                  <div className="score-bar-item">
                    <div className="bar-header">
                      <span>Route Efficiency</span>
                      <strong>88 / 100</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '88%', background: '#0284c7' }}></div>
                    </div>
                  </div>

                  <div className="score-bar-item">
                    <div className="bar-header">
                      <span>Time & Pacing Balance</span>
                      <strong>92 / 100</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '92%', background: '#8b5cf6' }}></div>
                    </div>
                  </div>

                  <div className="score-bar-item">
                    <div className="bar-header">
                      <span>Activity Diversity</span>
                      <strong>90 / 100</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '90%', background: '#f59e0b' }}></div>
                    </div>
                  </div>

                  <div className="score-bar-item">
                    <div className="bar-header">
                      <span>Personal Style Match</span>
                      <strong>93 / 100</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '93%', background: '#ec4899' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 15. FEATURED DASHBOARD PREVIEW */}
      {/* =================================================================== */}
      <section id="about" className="dashboard-preview-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Product Preview</span>
            <h2 className="section-title">Your Connected Travel Dashboard</h2>
            <p className="section-desc">
              Experience a unified command center managing your upcoming trips, budget tracking, saved destinations, and live recommendations.
            </p>
          </div>

          <div className="browser-mockup-frame card">
            <div className="browser-header-bar">
              <div className="browser-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="browser-address-bar">
                https://globetrotter.app/dashboard
              </div>
            </div>

            <div className="browser-content-body">
              <div className="dashboard-mock-grid">
                {/* Mock Header Row */}
                <div className="mock-top-banner">
                  <div>
                    <h2>Welcome back, Explorer! 👋</h2>
                    <p>You have 1 upcoming multi-city trip: <strong>Goa Beach & Heritage Circuit</strong></p>
                  </div>
                  <span className="badge badge-primary">
                    <Sparkles size={14} /> 75% Planned
                  </span>
                </div>

                {/* Mock Stats */}
                <div className="mock-stats-row grid-cols-4">
                  <div className="mock-stat-box">
                    <span className="lbl">Active Trip</span>
                    <strong>Goa Circuit</strong>
                    <small>5 Days • 3 Cities</small>
                  </div>
                  <div className="mock-stat-box">
                    <span className="lbl">Trip Budget</span>
                    <strong className="text-primary">₹23,800</strong>
                    <small>Limit: ₹25,000</small>
                  </div>
                  <div className="mock-stat-box">
                    <span className="lbl">Transit Time</span>
                    <strong className="text-success">14 Hours</strong>
                    <small>Route Optimized</small>
                  </div>
                  <div className="mock-stat-box">
                    <span className="lbl">Trip Score</span>
                    <strong className="text-purple">93 / 100</strong>
                    <small>AI Verified</small>
                  </div>
                </div>

                {/* Mock Content Row */}
                <div className="mock-main-row grid-cols-2">
                  <div className="mock-card">
                    <h4>Upcoming Day 1 Schedule</h4>
                    <div className="mock-schedule-item">
                      <span>09:00 AM</span>
                      <div>
                        <strong>Arrival at Dabolim Airport</strong>
                        <p>Private cab transfer to Panjim Hotel</p>
                      </div>
                    </div>
                    <div className="mock-schedule-item">
                      <span>01:30 PM</span>
                      <div>
                        <strong>Latin Quarter Heritage Walk</strong>
                        <p>Fontainhas colorful streets & bakery walk</p>
                      </div>
                    </div>
                  </div>

                  <div className="mock-card">
                    <h4>AI Smart Recommendations</h4>
                    <div className="mock-rec-item">
                      <MapPin size={16} color="#0284c7" />
                      <div>
                        <strong>Fisherman's Wharf Seafood Lunch</strong>
                        <small>98% match with your Foodie profile</small>
                      </div>
                    </div>
                    <div className="mock-rec-item">
                      <Camera size={16} color="#ec4899" />
                      <div>
                        <strong>Reis Magos Fort Sunset Vantage</strong>
                        <small>Top photography spot near Panjim</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleStartPlanning}
              className="btn btn-primary btn-lg"
            >
              <Compass size={18} />
              <span>Build Your First Trip</span>
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 16. FINAL CTA */}
      {/* =================================================================== */}
      <section className="final-cta-section">
        <div className="landing-container">
          <div className="final-cta-box">
            <div className="cta-content text-center">
              <span className="section-eyebrow eyebrow-light">Start Exploring Today</span>
              <h2 className="final-cta-title">Your Next Adventure Starts Here.</h2>
              <p className="final-cta-subtext">
                Turn a destination into a journey, and a journey into a memory.
              </p>

              <div className="final-cta-buttons">
                <button
                  type="button"
                  onClick={handleStartPlanning}
                  className="btn btn-primary btn-lg final-btn-primary"
                >
                  <Sparkles size={18} />
                  <span>Start Planning Your Trip</span>
                  <ArrowRight size={18} />
                </button>

                <a
                  href="#explore"
                  className="btn btn-secondary btn-lg final-btn-secondary"
                >
                  <Compass size={18} />
                  <span>Explore Inspiration</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Landing Page Scoped CSS */}
      <style>{`
        /* Landing Page Base & Spacing */
        .landing-page-wrapper {
          overflow-x: hidden;
          background: #f8fafc;
        }

        .landing-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--primary);
          background: #e0f2fe;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.75rem;
        }

        .eyebrow-purple { color: #8b5cf6; background: #f3e8ff; }
        .eyebrow-emerald { color: #10b981; background: #dcfce7; }
        .eyebrow-amber { color: #d97706; background: #fef3c7; }
        .eyebrow-blue { color: #0284c7; background: #e0f2fe; }
        .eyebrow-rose { color: #f43f5e; background: #ffe4e6; }
        .eyebrow-light { color: #38bdf8; background: rgba(255, 255, 255, 0.15); }

        .section-title {
          font-size: 2.35rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.6px;
          margin-bottom: 0.85rem;
        }

        .section-desc {
          font-size: 1.05rem;
          color: #64748b;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .text-center { text-align: center; }
        .mt-4 { margin-top: 2rem; }

        /* 1. Hero Section Styling */
        .hero-section {
          position: relative;
          padding: 1.75rem 1.5rem 2rem;
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
          overflow: hidden;
        }

        .hero-background-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
        }

        .orb-1 {
          width: 450px;
          height: 450px;
          background: #38bdf8;
          top: -100px;
          left: -100px;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: #c084fc;
          top: 100px;
          right: -150px;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.35;
        }

        .hero-container {
          max-width: 1320px;
          width: 100%;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.9rem;
          background: rgba(2, 132, 199, 0.1);
          border: 1px solid rgba(2, 132, 199, 0.25);
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary-hover);
          margin-bottom: 0.85rem;
        }

        .badge-icon-sparkle { color: #8b5cf6; }

        .hero-headline {
          font-size: 3.1rem;
          font-weight: 800;
          line-height: 1.15;
          color: #0f172a;
          letter-spacing: -1px;
          margin-bottom: 0.85rem;
        }

        .gradient-text {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          font-size: 1.05rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 560px;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .hero-cta-primary {
          background: var(--sunset-gradient);
          border: none;
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
        }

        .hero-cta-primary:hover {
          box-shadow: 0 12px 25px rgba(249, 115, 22, 0.45);
        }

        .hero-trust-metrics {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .trust-avatars {
          display: flex;
          align-items: center;
        }

        .trust-avatars img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          margin-left: -10px;
          object-fit: cover;
        }

        .trust-avatars img:first-child { margin-left: 0; }

        .trust-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.15rem;
        }

        .rating-score {
          font-weight: 800;
          font-size: 0.88rem;
          color: #0f172a;
          margin-left: 0.35rem;
        }

        .trust-label {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Hero Right Visual Canvas Box */
        .hero-visual-card {
          width: 100%;
        }

        .hero-canvas-box {
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .canvas-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .canvas-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
        }

        .canvas-score-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.84rem;
          font-weight: 700;
          color: #0f172a;
          background: #fef3c7;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .route-visual-map {
          position: relative;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: var(--radius-lg);
          padding: 2rem 1.5rem 2.5rem;
          margin-bottom: 1.25rem;
          overflow: hidden;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .route-svg-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .animated-dash-line {
          animation: dashMove 20s linear infinite;
        }

        @keyframes dashMove {
          to { stroke-dashoffset: -1000; }
        }

        .city-nodes-wrapper {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .city-node-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .node-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(2, 132, 199, 0.6);
        }

        .node-city-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
        }

        .node-day-tag {
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.15rem 0.55rem;
          border-radius: var(--radius-full);
        }

        /* Hero Demo Selector Tabs & Metrics */
        .hero-demo-tabs {
          margin-bottom: 1rem;
        }

        .demo-tabs-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
          display: block;
        }

        .demo-pills-list {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .demo-tab-chip {
          padding: 0.35rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          white-space: nowrap;
          transition: var(--transition);
        }

        .demo-tab-chip:hover {
          background: #f1f5f9;
        }

        .demo-tab-chip.active {
          background: var(--primary-gradient);
          color: #ffffff;
          border-color: transparent;
        }

        .hero-demo-preview-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          padding: 1.25rem;
        }

        .preview-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .preview-badge-ai {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #8b5cf6;
          background: #f3e8ff;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .preview-stats-pills {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
        }

        .preview-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .metric-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 0.65rem;
          display: flex;
          flex-direction: column;
        }

        .metric-lbl {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
        }

        .metric-val {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0.1rem 0;
        }

        .metric-sub {
          font-size: 0.68rem;
          color: #94a3b8;
        }

        .text-primary { color: var(--primary); }
        .text-success { color: #10b981; }
        .text-danger { color: #ef4444; }
        .text-purple { color: #8b5cf6; }

        .preview-highlights-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .highlight-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: #334155;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        /* 3. Value Strip Section */
        .value-strip-section {
          background: #ffffff;
          border-y: 1px solid #e2e8f0;
          padding: 2.25rem 0;
        }

        .value-strip-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .value-strip-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .value-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-purple { background: #f3e8ff; color: #8b5cf6; }
        .icon-emerald { background: #dcfce7; color: #10b981; }
        .icon-blue { background: #e0f2fe; color: #0284c7; }
        .icon-amber { background: #fef3c7; color: #d97706; }
        .icon-orange { background: #ffedd5; color: #f97316; }
        .icon-rose { background: #ffe4e6; color: #f43f5e; }

        .value-text h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .value-text p {
          font-size: 0.85rem;
          color: #64748b;
        }

        /* 4. Travel Planning Reimagined */
        .reimagined-section {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .transformation-comparison-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 2rem;
          align-items: center;
          margin-top: 3.5rem;
        }

        .comparison-card {
          border-radius: var(--radius-xl);
          padding: 2rem;
          border: 1px solid #e2e8f0;
        }

        .messy-card {
          background: #ffffff;
        }

        .card-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 0.4rem 0.95rem;
          border-radius: var(--radius-full);
          margin-bottom: 1.5rem;
        }

        .messy-badge { background: #fef2f2; color: #dc2626; }
        .smart-badge { background: #e0f2fe; color: #0284c7; }

        .messy-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .messy-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
        }

        .item-icon-red { color: #ef4444; }
        .item-icon-orange { color: #f97316; }
        .item-icon-amber { color: #f59e0b; }
        .item-icon-purple { color: #8b5cf6; }
        .item-icon-blue { color: #0284c7; }

        .comparison-footer-tag {
          font-size: 0.85rem;
          font-weight: 700;
          text-align: center;
          padding-top: 0.5rem;
        }

        .transformation-arrow-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .arrow-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .transformation-label {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
        }

        .smart-card {
          background: #ffffff;
          box-shadow: var(--shadow-lg);
          border-color: rgba(2, 132, 199, 0.3);
        }

        .smart-unified-preview {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .unified-feature-chip {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.15rem;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 700;
          color: #0369a1;
        }

        /* 5. AI Copilot Section */
        .copilot-section {
          padding: 6rem 0;
          background: #ffffff;
        }

        .copilot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }

        .copilot-quick-actions-box {
          margin: 1.75rem 0;
        }

        .quick-actions-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
          display: block;
        }

        .action-chips-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .copilot-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-full);
          transition: var(--transition);
        }

        .copilot-chip:hover {
          background: #e2e8f0;
        }

        .copilot-chip.active {
          background: #8b5cf6;
          color: #ffffff;
          border-color: transparent;
        }

        .copilot-chat-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        .chat-header {
          padding: 1rem 1.25rem;
          background: #0f172a;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .copilot-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .copilot-name {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .copilot-status {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .copilot-stat-badge {
          font-size: 0.78rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.2);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .chat-body {
          padding: 1.25rem;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          min-height: 280px;
          max-height: 360px;
          overflow-y: auto;
        }

        .chat-bubble {
          max-width: 85%;
          padding: 0.85rem 1.15rem;
          border-radius: var(--radius-lg);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .user-bubble {
          align-self: flex-end;
          background: var(--primary-gradient);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .ai-bubble {
          align-self: flex-start;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          border-bottom-left-radius: 4px;
          box-shadow: var(--shadow-sm);
        }

        .ai-response-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #8b5cf6;
          margin-bottom: 0.35rem;
        }

        .chat-footer {
          padding: 0.85rem 1.25rem;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-input {
          flex: 1;
          border: none;
          background: #f1f5f9;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          color: #64748b;
        }

        .chat-send-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 6. Smart Planning Features Grid */
        .features-section {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
          margin-top: 3.5rem;
        }

        .feature-card {
          position: relative;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
          border-color: var(--primary);
        }

        .card-accent-strip {
          height: 10px;
          border-radius: 999px;
          margin-bottom: 1.15rem;
        }

        .banner-emerald { background: #dcfce7; border: 1px solid #86efac; }
        .banner-blue { background: #e0f2fe; border: 1px solid #7dd3fc; }
        .banner-purple { background: #f3e8ff; border: 1px solid #d8b4fe; }
        .banner-orange { background: #ffedd5; border: 1px solid #fdba74; }
        .banner-amber { background: #fef3c7; border: 1px solid #fde047; }
        .banner-rose { background: #ffe4e6; border: 1px solid #fca5a5; }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0.85rem 0 0.5rem;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        .feature-card p {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.6;
        }

        /* 7. Workflow Steps */
        .workflow-section {
          padding: 6rem 0;
          background: #ffffff;
        }

        .journey-line-container {
          position: relative;
          margin-top: 4rem;
        }

        .journey-line {
          position: absolute;
          top: 32px;
          left: 10%;
          right: 10%;
          height: 3px;
          background: linear-gradient(90deg, #0284c7 0%, #8b5cf6 50%, #f97316 100%);
          z-index: 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
          position: relative;
          z-index: 1;
        }

        .step-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          padding: 1.5rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .step-card.active, .step-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-lg);
          transform: translateY(-3px);
        }

        .step-num-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #0f172a;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          border: 3px solid #ffffff;
          box-shadow: var(--shadow-md);
        }

        .step-card.active .step-num-badge {
          background: var(--primary-gradient);
          color: #ffffff;
        }

        .step-card h3 {
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 0.4rem;
        }

        .step-card p {
          font-size: 0.82rem;
          color: #64748b;
        }

        /* 8. Personality Section */
        .personality-section {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .personality-selector-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.65rem;
          margin: 2.5rem 0;
        }

        .personality-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.1rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #475569;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: var(--radius-full);
          transition: var(--transition);
        }

        .personality-pill.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: var(--shadow-md);
        }

        .personality-preview-card {
          max-width: 840px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 2rem;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-lg);
        }

        .personality-preview-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .personality-icon-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .personality-title {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .personality-desc {
          font-size: 0.95rem;
          color: #64748b;
        }

        .personality-body-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1.5rem;
        }

        .personality-box {
          background: #f8fafc;
          border-radius: var(--radius-md);
          padding: 1.15rem;
          border: 1px solid #e2e8f0;
        }

        .box-lbl {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: block;
        }

        .box-val {
          font-size: 0.92rem;
          color: #0f172a;
          font-weight: 600;
          line-height: 1.5;
        }

        .city-tags-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .dest-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-hover);
          background: #e0f2fe;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* 9. Optimization Visual */
        .optimization-visual-section {
          padding: 6rem 0;
          background: #ffffff;
        }

        .optimization-toggle-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          margin: 2.5rem 0;
        }

        .toggle-lbl {
          font-size: 0.95rem;
          font-weight: 700;
          color: #64748b;
        }

        .active-lbl { color: #0f172a; }

        .toggle-switch-btn {
          width: 60px;
          height: 32px;
          border-radius: 9999px;
          background: #cbd5e1;
          padding: 4px;
          transition: var(--transition);
        }

        .toggle-switch-btn.on {
          background: #10b981;
        }

        .switch-knob {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffffff;
          transition: var(--transition);
        }

        .toggle-switch-btn.on .switch-knob {
          transform: translateX(28px);
        }

        .opt-comparison-box {
          margin-top: 1.5rem;
        }

        .opt-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-xl);
          padding: 2rem;
          transition: var(--transition);
        }

        .highlighted-opt-success {
          border-color: #10b981;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15);
        }

        .opt-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .opt-card-header h3 {
          font-size: 1.25rem;
          font-weight: 800;
        }

        .opt-metrics-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .opt-metric-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.65rem;
          border-bottom: 1px dashed #e2e8f0;
          font-size: 0.95rem;
        }

        .score-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
        }

        .score-low { background: #fee2e2; color: #b91c1c; }
        .score-high { background: #dcfce7; color: #15803d; }

        .opt-highlights-strip {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
          flex-wrap: wrap;
        }

        .opt-highlight-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.88rem;
        }

        /* 10. Trip Simulator Section */
        .simulator-section {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .sim-box {
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 3rem 2.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-xl);
        }

        .sim-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .sim-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
        }

        .sim-desc {
          color: #64748b;
          max-width: 600px;
          margin-top: 0.4rem;
        }

        .sim-controls-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }

        .sim-toggle-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 1.25rem;
          background: #f8fafc;
          border: 2px solid #cbd5e1;
          border-radius: var(--radius-lg);
          font-weight: 800;
          color: #0f172a;
          transition: var(--transition);
        }

        .sim-toggle-btn.active {
          background: #f0f9ff;
          border-color: var(--primary);
          color: var(--primary-hover);
          box-shadow: var(--shadow-md);
        }

        .sim-toggle-btn small {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
        }

        .sim-result-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          background: #0f172a;
          color: #ffffff;
          padding: 1.5rem 2rem;
          border-radius: var(--radius-lg);
        }

        .sim-res-col {
          display: flex;
          flex-direction: column;
        }

        .sim-res-lbl {
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .sim-res-val {
          font-size: 1.4rem;
          font-weight: 800;
          margin-top: 0.2rem;
        }

        /* 11. Collaborative Section */
        .collab-section {
          padding: 6rem 0;
          background: #ffffff;
        }

        .collab-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .collab-bullet-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 1.5rem;
        }

        .collab-bullet-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
        }

        .collab-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-xl);
        }

        .collab-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .collab-avatars {
          display: flex;
          align-items: center;
        }

        .collab-avatars img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          margin-left: -8px;
        }

        .collab-avatars img:first-child { margin-left: 0; }

        .avatar-more {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -8px;
          border: 2px solid #ffffff;
        }

        .collab-activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .collab-activity-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
        }

        .activity-info h4 {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
        }

        .activity-meta {
          font-size: 0.78rem;
          color: #64748b;
        }

        .activity-votes {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .vote-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.65rem;
          font-size: 0.8rem;
          font-weight: 700;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-full);
        }

        .active-vote {
          background: #e0f2fe;
          color: var(--primary);
          border-color: var(--primary);
        }

        .status-tag {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
        }

        .tag-approved { background: #dcfce7; color: #15803d; }
        .tag-discussion { background: #fef3c7; color: #b45309; }

        .collab-chat-snippet {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.85rem 1rem;
          background: #f0f9ff;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: #0369a1;
        }

        /* 12. Discovery Section */
        .discovery-section {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .trip-filters-flex {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .filter-chip {
          padding: 0.4rem 1rem;
          font-size: 0.86rem;
          font-weight: 700;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-full);
          transition: var(--transition);
        }

        .filter-chip.active {
          background: var(--primary);
          color: #ffffff;
          border-color: transparent;
        }

        .public-trips-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .public-trip-card {
          display: flex;
          flex-direction: column;
        }

        .trip-card-img-wrapper {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .trip-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .public-trip-card:hover .trip-card-img {
          transform: scale(1.05);
        }

        .trip-score-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .trip-card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .trip-style-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .trip-card-title {
          font-size: 1.05rem;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 0.65rem;
        }

        .trip-card-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1.25rem;
        }

        .trip-card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }

        .flex-1 { flex: 1; }

        .copy-trip-btn {
          background: var(--primary-light);
          color: var(--primary-hover);
        }

        /* 13. Memory Section */
        .memory-section {
          padding: 6rem 0;
          background: #ffffff;
        }

        .memory-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }

        .memory-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 2rem;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-xl);
        }

        .memory-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .memory-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .memory-title-wrap h3 {
          font-size: 1.1rem;
          font-weight: 800;
        }

        .memory-photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .memory-photo-grid img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .memory-stats-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          background: #f8fafc;
          padding: 1rem;
          border-radius: var(--radius-lg);
        }

        .memory-stats-strip .lbl {
          font-size: 0.72rem;
          color: #64748b;
          display: block;
        }

        .memory-stats-strip strong {
          font-size: 0.95rem;
          font-weight: 800;
        }

        /* 14. Trip Score Section */
        .trip-score-section {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .score-showcase-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 3rem 2.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-xl);
        }

        .score-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 3.5rem;
          align-items: center;
        }

        .score-circle-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .score-circle-gauge {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: conic-gradient(#10b981 0% 91%, #e2e8f0 91% 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
          position: relative;
        }

        .score-circle-gauge::after {
          content: '';
          position: absolute;
          inset: 14px;
          border-radius: 50%;
          background: #ffffff;
        }

        .score-big-num {
          font-size: 3.5rem;
          font-weight: 900;
          color: #0f172a;
          position: relative;
          z-index: 2;
          line-height: 1;
        }

        .score-out-of {
          font-size: 0.9rem;
          font-weight: 800;
          color: #64748b;
          position: relative;
          z-index: 2;
        }

        .score-badge-label {
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 1.25rem;
        }

        .score-headline {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .score-bars-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .score-bar-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .bar-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          font-weight: 700;
          color: #334155;
        }

        .bar-track {
          width: 100%;
          height: 8px;
          background: #f1f5f9;
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 1s ease;
        }

        /* 15. Dashboard Preview */
        .dashboard-preview-section {
          padding: 6rem 0;
          background: #ffffff;
        }

        .browser-mockup-frame {
          max-width: 1080px;
          margin: 3.5rem auto 0;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          border: 1px solid #cbd5e1;
        }

        .browser-header-bar {
          background: #e2e8f0;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .browser-dots {
          display: flex;
          gap: 0.4rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }

        .browser-address-bar {
          background: #ffffff;
          padding: 0.3rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          color: #64748b;
          flex: 1;
          max-width: 450px;
        }

        .browser-content-body {
          background: #f8fafc;
          padding: 1.75rem;
        }

        .dashboard-mock-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mock-top-banner {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mock-top-banner h2 {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .mock-stat-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }

        .mock-stat-box .lbl {
          font-size: 0.72rem;
          color: #64748b;
        }

        .mock-stat-box strong {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0.1rem 0;
        }

        .mock-stat-box small {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .mock-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-lg);
          padding: 1.25rem;
        }

        .mock-card h4 {
          font-size: 0.95rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .mock-schedule-item, .mock-rec-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.65rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .mock-schedule-item span {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--primary);
        }

        .mock-schedule-item strong, .mock-rec-item strong {
          font-size: 0.88rem;
          display: block;
        }

        .mock-schedule-item p, .mock-rec-item small {
          font-size: 0.78rem;
          color: #64748b;
        }

        /* 16. Final CTA Section */
        .final-cta-section {
          padding: 6rem 0 7rem;
          background: #f8fafc;
        }

        .final-cta-box {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: var(--radius-xl);
          padding: 5rem 2rem;
          color: #ffffff;
          box-shadow: var(--shadow-xl);
          position: relative;
          overflow: hidden;
        }

        .final-cta-title {
          font-size: 3.2rem;
          font-weight: 900;
          letter-spacing: -1px;
          margin-bottom: 1rem;
        }

        .final-cta-subtext {
          font-size: 1.2rem;
          color: #cbd5e1;
          margin-bottom: 2.5rem;
        }

        .final-cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .final-btn-primary {
          background: var(--sunset-gradient);
          border: none;
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .final-btn-secondary {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .final-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* RESPONSIVE DESIGN (320px - 1024px) */
        @media (max-width: 1024px) {
          .hero-grid,
          .copilot-grid,
          .collab-grid,
          .memory-grid,
          .score-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .hero-headline { font-size: 2.75rem; }

          .features-grid { grid-template-columns: repeat(2, 1fr); }

          .journey-line { display: none; }

          .steps-grid { grid-template-columns: repeat(2, 1fr); }

          .sim-controls-grid, .sim-result-bar { grid-template-columns: repeat(2, 1fr); }

          .public-trips-grid { grid-template-columns: repeat(2, 1fr); }

          .transformation-comparison-grid {
            grid-template-columns: 1fr;
          }

          .transformation-arrow-box {
            transform: rotate(90deg);
            margin: 1rem 0;
          }

          .value-strip-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .personality-body-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .hero-headline { font-size: 2.2rem; }
          .section-title { font-size: 1.8rem; }
          .final-cta-title { font-size: 2rem; }

          .features-grid,
          .steps-grid,
          .sim-controls-grid,
          .sim-result-bar,
          .public-trips-grid,
          .value-strip-grid {
            grid-template-columns: 1fr;
          }

          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }

          .hero-cta-primary, .hero-cta-secondary {
            width: 100%;
          }

          .preview-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sim-header {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
