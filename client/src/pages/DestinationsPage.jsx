import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Compass,
  Search,
  MapPin,
  Star,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Plane,
  Tag,
  DollarSign,
  HelpCircle,
  Filter,
} from 'lucide-react';

export const allDestinationsData = [
  {
    id: 1,
    name: 'Santorini, Greece',
    country: 'Greece',
    region: 'Europe',
    subRegion: 'Mediterranean Europe',
    rating: 4.9,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    tag: 'Romantic Getaway',
    startingPrice: '$1,950',
    idealDays: '6 - 8 Days',
    bestSeason: 'May to October',
    highlights: ['Oia Caldera Sunset Sailing', 'Volcanic Black & Red Sand Beaches', 'Boutique Cliffside Cave Suites'],
    desc: 'Iconic whitewashed caldera cliffside villas, azure Aegean waters, ancient Akrotiri ruins, and world-class sunset catamarans.',
  },
  {
    id: 2,
    name: 'Kyoto & Tokyo, Japan',
    country: 'Japan',
    region: 'Asia',
    subRegion: 'East Asia',
    rating: 4.95,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    tag: 'Cultural Heritage',
    startingPrice: '$2,850',
    idealDays: '10 - 12 Days',
    bestSeason: 'March - May & Oct - Nov',
    highlights: ['Arashiyama Bamboo Grove & Torii Gates', 'High-Speed Shinkansen Bullet Train', 'Authentic Tea Ceremony with Geisha'],
    desc: 'Centuries-old bamboo groves, serene Shinto shrines, Michelin-star dining, bustling neon arcades, and tranquil Ryokan onsen retreats.',
  },
  {
    id: 3,
    name: 'Swiss Alps & Interlaken, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    subRegion: 'Central Europe',
    rating: 4.92,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    tag: 'Alpine Luxury',
    startingPrice: '$2,850',
    idealDays: '7 - 9 Days',
    bestSeason: 'December - March & June - Sept',
    highlights: ['Jungfraujoch Top of Europe Cogwheel', 'Scenic Glacier Express Panoramic Rail', 'Crystalline Lake Brienz Boat Cruise'],
    desc: 'Dramatic snow-capped mountain peaks, world-famous cogwheel railway journeys to Jungfraujoch, fondue chalets, and glacial lakes.',
  },
  {
    id: 4,
    name: 'Bali & Ubud, Indonesia',
    country: 'Indonesia',
    region: 'Asia',
    subRegion: 'Southeast Asia',
    rating: 4.88,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    tag: 'Tropical Escape',
    startingPrice: '$1,450',
    idealDays: '8 - 11 Days',
    bestSeason: 'April to October',
    highlights: ['Tegallalang Terraced Rice Paddies', 'Nusa Penida Kelingking Coastal Tour', 'Luxury Ubud Forest Pool Villa & Spa'],
    desc: 'Lush terraced rice paddies, wellness sanctuaries, world-class reef diving, sacred monkey forests, and traditional temple ceremonies.',
  },
  {
    id: 5,
    name: 'Dubai & Arabian Desert, UAE',
    country: 'United Arab Emirates',
    region: 'Middle East',
    subRegion: 'Middle East',
    rating: 4.85,
    reviews: 276,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tag: 'Modern Luxury',
    startingPrice: '$2,100',
    idealDays: '5 - 7 Days',
    bestSeason: 'November to April',
    highlights: ['Burj Khalifa Observation Deck', 'VIP Desert Safari with Arabian Glamping', 'Private Dubai Marina Yacht Cruise'],
    desc: 'Futuristic architectural marvels, golden desert dune bashing, five-star luxury resorts, high-fashion avenues, and starlit Bedouin banquets.',
  },
  {
    id: 6,
    name: 'Serengeti & Zanzibar, Tanzania',
    country: 'Tanzania',
    region: 'Africa',
    subRegion: 'East Africa',
    rating: 4.96,
    reviews: 154,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    tag: 'Wildlife Safari',
    startingPrice: '$3,600',
    idealDays: '9 - 12 Days',
    bestSeason: 'July - October & Jan - Feb',
    highlights: ['Big Five Game Drives in Serengeti', 'Hot Air Balloon Safari at Sunrise', 'Zanzibar Spice Tour & White Sand Beaches'],
    desc: 'The iconic Great Migration, luxury safari tented camps under endless starry skies, followed by crystalline Indian Ocean beaches in Zanzibar.',
  },
  {
    id: 7,
    name: 'Amalfi Coast & Capri, Italy',
    country: 'Italy',
    region: 'Europe',
    subRegion: 'Mediterranean Europe',
    rating: 4.91,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    tag: 'Coastal Luxury',
    startingPrice: '$2,650',
    idealDays: '7 - 9 Days',
    bestSeason: 'May to October',
    highlights: ['Positano Cliffside Exploration', 'Private Speedboat to Blue Grotto Capri', 'Ravello Villa Rufolo Panoramic Gardens'],
    desc: 'Sheer vertical cliffs descending into turquoise Mediterranean waters, lemon groves, Michelin cliff-edge bistros, and vintage convertible drives.',
  },
  {
    id: 8,
    name: 'Machu Picchu & Cusco, Peru',
    country: 'Peru',
    region: 'Americas',
    subRegion: 'South America',
    rating: 4.94,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    tag: 'Ancient Mystery',
    startingPrice: '$2,300',
    idealDays: '8 - 10 Days',
    bestSeason: 'May to September',
    highlights: ['Inca Trail or Vistadome Rail Access', 'Sacred Valley of the Incas', 'Historic Cusco Colonial & Stone Architecture'],
    desc: 'The mystical lost citadel of the Incas nestled high in the cloud forest, vibrant Andean textile markets, and ancient stone fortresses.',
  },
  {
    id: 9,
    name: 'Maldives Private Island Resort',
    country: 'Maldives',
    region: 'Asia',
    subRegion: 'South Asia',
    rating: 4.98,
    reviews: 310,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    tag: 'Island Paradise',
    startingPrice: '$3,200',
    idealDays: '6 - 8 Days',
    bestSeason: 'November to April',
    highlights: ['Overwater Bungalow with Glass Floor', 'Bioluminescent Beach Night Stroll', 'Manta Ray & Whale Shark Snorkelling'],
    desc: 'Secluded turquoise lagoons, overwater villas with private plunge pools, vibrant coral gardens, and bespoke dining on private sandbanks.',
  },
];

const REGION_TABS = ['All', 'Europe', 'Asia', 'Middle East', 'Africa', 'Americas'];

const DestinationsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredDestinations = useMemo(() => {
    return allDestinationsData.filter((dest) => {
      const matchesRegion =
        selectedRegion === 'All' || dest.region.toLowerCase() === selectedRegion.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [selectedRegion, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-brand-950 via-slate-900 to-accent-950 text-white pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-brand-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-300" />
            <span>Discover Unforgettable Destinations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Curated Global Destinations
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From the romantic cliffside of the Mediterranean to the untamed wilderness of the Serengeti.
            Choose a destination and let our travel curators tailor your dream expedition.
          </p>

          {/* Interactive Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, country, or travel vibe (e.g. Switzerland, Safari, Romantic)..."
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

      {/* Region Filter Bar & Results */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            {REGION_TABS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredDestinations.length}</span> destinations
          </div>
        </div>

        {/* Empty Search State */}
        {filteredDestinations.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto my-8">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No destinations match your search</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Try adjusting your search keywords or select a different region filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All');
              }}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Image Banner */}
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Tag Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-slate-900 shadow">
                    {dest.tag}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{dest.rating}</span>
                </div>

                {/* Destination info over image */}
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-brand-200 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    <span>{dest.subRegion}</span>
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight">{dest.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {dest.desc}
                </p>

                {/* Key Highlights */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Signature Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {dest.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Details Meta */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dest.idealDays}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{dest.bestSeason}</span>
                  </div>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Packages from
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {dest.startingPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/packages?destination=${encodeURIComponent(dest.name)}`}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Packages
                    </Link>
                    <Link
                      to={`/enquiry?destination=${encodeURIComponent(dest.name)}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-sm transition-all"
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Custom Concierge Banner */}
        <div className="mt-16 bg-gradient-to-r from-brand-900 to-accent-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Have a specific country or hidden gem in mind?</h3>
            <p className="text-sm text-brand-200 max-w-xl">
              We arrange bespoke private expeditions to over 85 countries. Tell our travel coordinators where you wish to explore.
            </p>
          </div>
          <Link
            to="/enquiry"
            className="shrink-0 px-8 py-4 rounded-xl bg-white hover:bg-brand-50 text-slate-900 font-extrabold text-sm shadow-lg transition-transform hover:scale-105"
          >
            Request Custom Quotation
          </Link>
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default DestinationsPage;
