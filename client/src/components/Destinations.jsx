import React from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';

const destinationsData = [
  {
    id: 1,
    name: 'Santorini, Greece',
    region: 'Mediterranean Europe',
    rating: 4.9,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    tag: 'Romantic Getaway',
    desc: 'Iconic whitewashed caldera cliffside villas, azure Aegean waters, and world-class sunset sailings.',
  },
  {
    id: 2,
    name: 'Kyoto & Tokyo, Japan',
    region: 'East Asia',
    rating: 4.95,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    tag: 'Cultural Heritage',
    desc: 'Centuries-old bamboo groves, serene Shinto shrines, Michelin dining, and high-speed Shinkansen travel.',
  },
  {
    id: 3,
    name: 'Swiss Alps & Interlaken, Switzerland',
    region: 'Central Europe',
    rating: 4.92,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    tag: 'Alpine Luxury',
    desc: 'Dramatic mountain peaks, cogwheel railway journeys to Jungfraujoch, and crystalline glacial lakes.',
  },
  {
    id: 4,
    name: 'Bali & Ubud, Indonesia',
    region: 'Southeast Asia',
    rating: 4.88,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    tag: 'Tropical Escape',
    desc: 'Lush terraced rice paddies, wellness sanctuaries, pristine reef diving, and Balinese temple ceremonies.',
  },
  {
    id: 5,
    name: 'Dubai & Arabian Desert, UAE',
    region: 'Middle East',
    rating: 4.85,
    reviews: 276,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tag: 'Modern Luxury',
    desc: 'Futuristic skylines, golden desert safari glamping, private yacht cruises, and high-fashion shopping.',
  },
  {
    id: 6,
    name: 'Serengeti & Zanzibar, Tanzania',
    region: 'East Africa',
    rating: 4.96,
    reviews: 154,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    tag: 'Wildlife Safari',
    desc: 'Great Migration game drives, luxury tented bush lodges, followed by spice island white-sand beaches.',
  },
];

const Destinations = ({ onSelectDestination }) => {
  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
            Top Global Locations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Popular Destinations For Your Next Journey
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Handpicked escapes curated by experienced travel consultants. Select any destination to start your personalized inquiry.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinationsData.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                {/* Tag Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-slate-800 shadow-sm">
                    {dest.tag}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{dest.rating}</span>
                </div>

                {/* Destination name on photo */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1 text-xs text-brand-200 font-medium">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.region}</span>
                  </div>
                  <h3 className="text-lg font-bold">{dest.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                  {dest.desc}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {dest.reviews} Traveller Reviews
                  </span>
                  <button
                    onClick={() => onSelectDestination(dest.name)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Enquire Destination</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Destinations;
