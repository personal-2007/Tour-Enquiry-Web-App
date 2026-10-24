import React from 'react';
import { ArrowRight, Sparkles, MapPin, Calendar, Users, ShieldCheck } from 'lucide-react';

const Hero = ({ onExploreClick, onEnquireClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-200/40 via-accent-200/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200/70 text-brand-800 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent-600" />
              <span>Premium Guided Tours & Custom Expeditions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Experience The World's <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-accent-600 bg-clip-text text-transparent">
                Most Majestic Wonders
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              From serene alpine peaks and secluded tropical lagoons to culturally vibrant historic capitals. 
              Submit a tour enquiry today, and let our dedicated travel curators craft your seamless bespoke itinerary.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onEnquireClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Submit Tour Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
              >
                <span>Browse Packages</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">40+</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Global Destinations</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-600">99.4%</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Satisfaction Rating</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-accent-600">24/7</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Concierge Support</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-card border border-slate-100 transition-all hover:shadow-card-hover">
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
                    alt="Tropical Paradise Tour"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-900 shadow">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>Featured Expedition</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-brand-200 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Bali & Nusa Penida, Indonesia</span>
                    </div>
                    <div className="text-xl font-bold">7-Day Tropical Island Retreat</div>
                  </div>
                </div>

                {/* Card Information Strip */}
                <div className="p-5 bg-white">
                  <div className="grid grid-cols-3 gap-3 text-center border-b border-slate-100 pb-4 mb-4">
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <Calendar className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                      <span className="block text-xs font-bold text-slate-800">7 Days</span>
                      <span className="text-[11px] text-slate-400">Duration</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <Users className="w-4 h-4 text-accent-600 mx-auto mb-1" />
                      <span className="block text-xs font-bold text-slate-800">2 - 8</span>
                      <span className="text-[11px] text-slate-400">Small Group</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                      <span className="block text-xs font-bold text-slate-800">All-Incl.</span>
                      <span className="text-[11px] text-slate-400">Insurance</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Estimated Pricing</span>
                      <span className="text-lg font-extrabold text-brand-700">From $1,450 <span className="text-xs text-slate-500 font-normal">/ person</span></span>
                    </div>

                    <button
                      onClick={onEnquireClick}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Enquire Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Customized For You</div>
                  <div className="text-[11px] text-slate-500">100% Free Consultation</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
