import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnquiryForm from '../components/EnquiryForm';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Award,
  Users,
  Compass,
  Star,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How quickly will I receive my customized itinerary & quotation?',
    a: 'Once your enquiry is submitted, our dedicated destination specialist will analyze your preferences and deliver a comprehensive day-by-day itinerary and itemized quote within 2 to 4 business hours.',
  },
  {
    q: 'Can I customize packages and add specific experiences?',
    a: 'Absolutely! Every tour package and itinerary is 100% flexible. You can request specific boutique hotels, dietary requirements, private chauffeured vehicles, or side-trips.',
  },
  {
    q: 'Are international and regional flights included?',
    a: 'We can either arrange international and domestic connecting flights as part of your complete package, or you can book your own airfare while we handle all ground arrangements, boutique stays, and excursions.',
  },
  {
    q: 'What is the deposit and cancellation policy?',
    a: 'We require a minimal 20% deposit once you approve the final itinerary. We also provide flexible rescheduling and free cancellation up to 30 days prior to departure on most itineraries.',
  },
];

const EnquiryPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedDestination = searchParams.get('destination') || '';
  const preselectedBudget = searchParams.get('budget') || '';
  const preselectedPackage = searchParams.get('package') || '';

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="relative bg-gradient-to-br from-brand-950 via-slate-900 to-accent-950 text-white pt-14 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-brand-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-300" />
            <span>Fast Customized Itinerary Service</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Plan Your Bespoke Tour Enquiry
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tell us about your dream getaway. Our veteran destination planners will engineer a personalized,
            itemized itinerary with transparent quotation within hours.
          </p>

          {/* If redirected with preselected package */}
          {preselectedPackage && (
            <div className="mt-6 inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/40 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-brand-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Package pre-selected: <strong className="text-white">{preselectedPackage}</strong>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main Form & Benefits Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: The Interactive Enquiry Form */}
          <div className="lg:col-span-8">
            <EnquiryForm
              preselectedDestination={preselectedDestination}
              preselectedBudget={preselectedBudget}
            />
          </div>

          {/* Right Column: Trust Sidebar & Direct Concierge */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Trust Highlights Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span>The WanderFlow Guarantee</span>
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">2-Hour Rapid Quote Response</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Direct consultation with a destination expert who has visited your chosen spot.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">100% Tailored Flexibility</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Adjust dates, hotels, transport style, and activities anytime before final payment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Best Price & Transparent Value</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      No surprise local taxes or hidden booking fees. Full breakdown provided up front.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Travel Specialist Hotline */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">
                      Prefer To Speak Directly?
                    </span>
                    <a
                      href="tel:+18005558687"
                      className="text-sm font-extrabold text-slate-900 hover:text-brand-600 transition-colors"
                    >
                      +1 (800) 555-TOUR
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Submitting the enquiry took less than 2 minutes. Within an hour, our travel specialist Elena called us with a bespoke Swiss Alps itinerary that exceeded our dreams!"
              </p>
              <div className="pt-2 text-xs font-bold text-white flex items-center gap-2">
                <span>— Marcus &amp; Chloe Chen</span>
                <span className="text-brand-400 font-normal">Trip to Switzerland</span>
              </div>
            </div>

          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions About Booking
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Everything you need to know about our quotation and reservation process.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:text-brand-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default EnquiryPage;
