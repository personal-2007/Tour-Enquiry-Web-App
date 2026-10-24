import React from 'react';
import { Clock, CheckCircle2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

const packagesData = [
  {
    id: 'pkg-1',
    title: 'Swiss Alpine Panorama & Glaciers',
    destination: 'Swiss Alps & Interlaken, Switzerland',
    duration: '8 Days / 7 Nights',
    price: '$2,850',
    budgetCategory: '$2,500 - $5,000',
    badge: 'Most Popular',
    badgeColor: 'bg-brand-600 text-white',
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
    price: '$1,650',
    budgetCategory: '$1,500 - $3,000',
    badge: 'Best Value',
    badgeColor: 'bg-emerald-600 text-white',
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
    price: '$3,950',
    budgetCategory: '$2,500 - $5,000',
    badge: 'Editor Choice',
    badgeColor: 'bg-accent-600 text-white',
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
    price: '$2,400',
    budgetCategory: '$1,500 - $3,000',
    badge: 'Honeymoon Special',
    badgeColor: 'bg-rose-600 text-white',
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
    price: '$1,850',
    budgetCategory: '$1,500 - $3,000',
    badge: 'Family Friendly',
    badgeColor: 'bg-amber-600 text-white',
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
    price: '$5,600',
    budgetCategory: '$5,000+',
    badge: 'Luxury Safari',
    badgeColor: 'bg-purple-700 text-white',
    description: 'Unrivaled wildlife encounters in the Serengeti followed by turquoise waters and spice farms of Zanzibar.',
    features: [
      'Luxury tented safari camp in Serengeti',
      'Private 4x4 Land Cruiser with tracker',
      'Beachfront resort villa in Zanzibar',
      'All national park conservation fees',
    ],
  },
];

const TourPackages = ({ onSelectPackage }) => {
  return (
    <section id="packages" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 text-accent-700 text-xs font-bold uppercase tracking-wider mb-3">
            Handcrafted Itineraries
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Curated Tour Packages
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Transparent pricing, all-inclusive options, and completely customizable schedules tailored to your travel style.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packagesData.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Top Card Info */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${pkg.badgeColor}`}>
                    {pkg.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-xs font-semibold text-brand-600 mt-1 mb-3">
                  {pkg.destination}
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-5">
                  {pkg.description}
                </p>

                {/* Inclusions List */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Package Highlights
                  </div>
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">Estimated Price</span>
                  <span className="text-xl font-black text-slate-900">
                    {pkg.price}
                    <span className="text-xs font-normal text-slate-500"> / person</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg.destination, pkg.budgetCategory)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TourPackages;
