import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Search,
  Filter,
  DollarSign,
  Sparkles,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';

export const allPackagesData = [
  {
    id: 'pkg-1',
    title: 'Swiss Alpine Panorama & Glaciers',
    destination: 'Swiss Alps & Interlaken, Switzerland',
    duration: '8 Days / 7 Nights',
    durationDays: 8,
    price: '$2,850',
    budgetCategory: '$2,500 - $5,000',
    badge: 'Most Popular',
    badgeColor: 'bg-brand-600 text-white',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    description: 'Scenic first-class Glacier Express journey, Jungfraujoch top of Europe pass, and Zurich luxury stay.',
    features: [
      'First-Class Swiss Travel Pass included',
      '4 & 5-Star Alpine boutique hotels',
      'Daily breakfast & 3 gourmet dinners',
      'Private mountain guide in Zermatt',
    ],
  },
  {
    id: 'pkg-2',
    title: 'Balinese Tropical Sanctuary & Nusa Penida',
    destination: 'Bali & Ubud, Indonesia',
    duration: '10 Days / 9 Nights',
    durationDays: 10,
    price: '$1,650',
    budgetCategory: '$1,500 - $3,000',
    badge: 'Best Value',
    badgeColor: 'bg-emerald-600 text-white',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Ubud jungle infinity pool villas, private beachfront catamaran cruises, and traditional cooking masterclass.',
    features: [
      'Private villa with plunge pool in Ubud',
      'Speedboat transfer to Nusa Penida',
      'Daily Balinese massage treatment',
      'Private chauffeured AC vehicle',
    ],
  },
  {
    id: 'pkg-3',
    title: 'Ancient Japan: Tokyo, Kyoto & Osaka',
    destination: 'Kyoto & Tokyo, Japan',
    duration: '11 Days / 10 Nights',
    durationDays: 11,
    price: '$3,950',
    budgetCategory: '$2,500 - $5,000',
    badge: 'Editor Choice',
    badgeColor: 'bg-accent-600 text-white',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'Bullet train transfers, traditional Ryokan with private onsen, tea ceremony with a Geisha, and modern city tours.',
    features: [
      '7-Day Japan Rail Pass (Ordinary/Green)',
      'Authentic Onsen Ryokan experience',
      'Private English-speaking local guides',
      'Tokyo Robot & Culinary food tour',
    ],
  },
  {
    id: 'pkg-4',
    title: 'Aegean Romance & Sunset Yachting',
    destination: 'Santorini, Greece',
    duration: '7 Days / 6 Nights',
    durationDays: 7,
    price: '$2,400',
    budgetCategory: '$1,500 - $3,000',
    badge: 'Honeymoon Special',
    badgeColor: 'bg-rose-600 text-white',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    description: 'Caldera view cave suite, semi-private luxury catamaran sunset tour with BBQ, and private wine tasting.',
    features: [
      'Oia cliffside luxury suite with Jacuzzi',
      'Sunset catamaran cruise with open bar',
      'Santorini volcanic wine cellar tour',
      'Round-trip airport & port transfers',
    ],
  },
  {
    id: 'pkg-5',
    title: 'Arabian Glamour & Desert Safari',
    destination: 'Dubai & Arabian Desert, UAE',
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    price: '$1,850',
    budgetCategory: '$1,500 - $3,000',
    badge: 'Family Friendly',
    badgeColor: 'bg-amber-600 text-white',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    description: 'Burj Khalifa At The Top VIP access, desert dune bashing with starlit dinner, and Dubai Marina yacht cruise.',
    features: [
      '5-Star Downtown Dubai hotel stay',
      'Private 4x4 desert safari & BBQ',
      'Burj Khalifa 148th floor VIP lounge',
      'Luxury chauffeured airport transfers',
    ],
  },
  {
    id: 'pkg-6',
    title: 'Serengeti Migration & Spice Island Luxury',
    destination: 'Serengeti & Zanzibar, Tanzania',
    duration: '12 Days / 11 Nights',
    durationDays: 12,
    price: '$5,600',
    budgetCategory: 'Luxury ($5,000+)',
    badge: 'Luxury Safari',
    badgeColor: 'bg-purple-700 text-white',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    description: 'Unrivaled wildlife encounters in the Serengeti followed by turquoise waters and spice farms of Zanzibar.',
    features: [
      'Luxury tented safari camp in Serengeti',
      'Private 4x4 Land Cruiser with tracker',
      'Beachfront resort villa in Zanzibar',
      'All national park conservation fees',
    ],
  },
  {
    id: 'pkg-7',
    title: 'Italian Amalfi Vista & Capri Cruise',
    destination: 'Amalfi Coast & Capri, Italy',
    duration: '8 Days / 7 Nights',
    durationDays: 8,
    price: '$3,150',
    budgetCategory: '$2,500 - $5,000',
    badge: 'Coastal Classic',
    badgeColor: 'bg-blue-600 text-white',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    description: 'Cliffside boutique hotel in Positano, private Capri boat charter to the Faraglioni rocks, and limoncello tasting.',
    features: [
      'Sea-view terrace hotel in Positano',
      'Private boat excursion to Capri & Blue Grotto',
      'Neapolitan pizza & wine masterclass',
      'Chauffeured Mercedes coastal transfer',
    ],
  },
  {
    id: 'pkg-8',
    title: 'Inca Trail & Mystical Machu Picchu',
    destination: 'Machu Picchu & Cusco, Peru',
    duration: '9 Days / 8 Nights',
    durationDays: 9,
    price: '$2,450',
    budgetCategory: '$1,500 - $3,000',
    badge: 'Adventure Wonder',
    badgeColor: 'bg-teal-600 text-white',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    description: 'Scenic Vistadome train through the Sacred Valley, luxury Cusco boutique retreat, and guided sunrise at Machu Picchu.',
    features: [
      'Vistadome train tickets with panoramic windows',
      'Private archaeologist guide at Machu Picchu',
      'Colonial palace hotel in historic Cusco',
      'All regional entrance passes & transfers',
    ],
  },
  {
    id: 'pkg-9',
    title: 'Maldivian Overwater Coral Bliss',
    destination: 'Maldives Private Island Resort',
    duration: '7 Days / 6 Nights',
    durationDays: 7,
    price: '$5,200',
    budgetCategory: 'Luxury ($5,000+)',
    badge: 'Ultra Luxury',
    badgeColor: 'bg-indigo-700 text-white',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic overwater bungalow with infinity plunge pool, seaplane transfer, and sunset dolphin cruise with champagne.',
    features: [
      'Sunset overwater villa with ocean access',
      'Roundtrip seaplane transfer from Malé',
      'All-inclusive fine dining & premium wines',
      'Complimentary coral reef scuba diving',
    ],
  },
];

const BUDGET_FILTERS = [
  'All Budgets',
  'Economy (Under $1,500)',
  '$1,500 - $3,000',
  '$2,500 - $5,000',
  'Luxury ($5,000+)',
];

const DURATION_FILTERS = [
  'All Durations',
  'Under 7 Days',
  '7 - 10 Days',
  '11+ Days',
];

const PackagesPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('All Budgets');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');

  // Read URL params if redirected from Destinations page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destParam = params.get('destination');
    if (destParam) {
      setSearchQuery(destParam);
    }
  }, [location.search]);

  const filteredPackages = useMemo(() => {
    return allPackagesData.filter((pkg) => {
      // Search
      const matchesSearch =
        searchQuery.trim() === '' ||
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Budget
      const matchesBudget =
        selectedBudget === 'All Budgets' || pkg.budgetCategory === selectedBudget;

      // Duration
      let matchesDuration = true;
      if (selectedDuration === 'Under 7 Days') {
        matchesDuration = pkg.durationDays < 7;
      } else if (selectedDuration === '7 - 10 Days') {
        matchesDuration = pkg.durationDays >= 7 && pkg.durationDays <= 10;
      } else if (selectedDuration === '11+ Days') {
        matchesDuration = pkg.durationDays >= 11;
      }

      return matchesSearch && matchesBudget && matchesDuration;
    });
  }, [searchQuery, selectedBudget, selectedDuration]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 text-white pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-brand-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-300" />
            <span>Curated Packages & Expeditions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Handcrafted Tour Itineraries
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            All-inclusive, fully customizable itineraries designed by veteran destination specialists.
            Every tour package can be adapted to your dates and party size.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages by title or destination (e.g. Japan, Alps, Santorini)..."
                className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Filters Header */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm mb-10 flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Duration Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Duration:
            </span>
            {DURATION_FILTERS.map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedDuration === dur
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dur}
              </button>
            ))}
          </div>

          {/* Budget Dropdown / Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Budget:
            </span>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            >
              {BUDGET_FILTERS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <span className="text-xs font-semibold text-slate-500 pl-3">
              {filteredPackages.length} packages found
            </span>
          </div>
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto my-8">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No tour packages match your filters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Try clearing your duration or budget filters to explore other options.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBudget('All Budgets');
                setSelectedDuration('All Durations');
              }}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold tracking-wide uppercase ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-300" />
                    <span>{pkg.duration}</span>
                  </div>

                  {/* Destination */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1 text-xs text-brand-200 font-semibold mb-0.5">
                      <MapPin className="w-3 h-3 text-brand-400" />
                      <span>{pkg.destination}</span>
                    </div>
                    <h3 className="text-lg font-extrabold line-clamp-1">{pkg.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Features Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Package Inclusions
                    </span>
                    <ul className="space-y-2">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Button */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Starting Rate
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-slate-900">{pkg.price}</span>
                      <span className="text-[11px] text-slate-500">/ person</span>
                    </div>
                  </div>

                  <Link
                    to={`/enquiry?destination=${encodeURIComponent(pkg.destination)}&budget=${encodeURIComponent(pkg.budgetCategory)}&package=${encodeURIComponent(pkg.title)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Custom Tailor Callout */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-slate-900">
                100% Tailored To Your Preferences
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Need extra nights, private villa upgrades, or specific dietary catering? Any package can be customized.
              </p>
            </div>
          </div>
          <Link
            to="/enquiry"
            className="shrink-0 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
          >
            Submit Custom Specification
          </Link>
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default PackagesPage;
