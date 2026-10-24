import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
            Always Here For You
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect With Our Travel Concierge
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Have questions before submitting your itinerary? Our team of destination experts is ready to assist.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Phone */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Phone Support</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">Mon-Sat from 8:00 AM to 8:00 PM</p>
            <a
              href="tel:+18005558687"
              className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors"
            >
              +1 (800) 555-TOUR
            </a>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Email Inquiries</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">Typical reply time under 2 hours</p>
            <a
              href="mailto:enquiry@wanderflow.com"
              className="text-sm font-bold text-accent-600 hover:text-accent-800 transition-colors"
            >
              enquiry@wanderflow.com
            </a>
          </div>

          {/* Office Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Headquarters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">Global Operations Centre</p>
            <span className="text-xs font-semibold text-slate-700 leading-snug">
              450 Lexington Ave, Suite 2400<br />New York, NY 10017
            </span>
          </div>

          {/* Working Hours */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Emergency Desk</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">For booked travellers in transit</p>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              24/7 Active Duty
            </span>
          </div>

        </div>

        {/* Quick FAQ Strip */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Need immediate customization or large group rates?</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Our bespoke travel architects can accommodate custom flight charters, corporate incentive tours, and private bookings.
              </p>
            </div>
          </div>

          <a
            href="mailto:concierge@wanderflow.com?subject=Special%20Tour%20Request"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            Contact Concierge
          </a>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
