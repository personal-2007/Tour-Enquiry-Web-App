import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  Globe,
  Headphones,
} from 'lucide-react';

const GLOBAL_OFFICES = [
  {
    city: 'New York',
    title: 'Global Headquarters',
    address: '450 Lexington Avenue, 14th Floor, New York, NY 10017',
    phone: '+1 (800) 555-8687',
    email: 'ny@wanderflow.com',
    hours: 'Mon – Fri: 8:00 AM – 8:00 PM EST',
  },
  {
    city: 'London',
    title: 'European Operations',
    address: '120 Fenchurch Street, 6th Floor, London EC3M 5BA, UK',
    phone: '+44 20 7946 0991',
    email: 'london@wanderflow.com',
    hours: 'Mon – Fri: 9:00 AM – 6:30 PM GMT',
  },
  {
    city: 'Tokyo',
    title: 'Asia-Pacific Hub',
    address: 'Marunouchi 2-Chome, Chiyoda-ku, Tokyo 100-0005, Japan',
    phone: '+81 3 5555 0192',
    email: 'tokyo@wanderflow.com',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM JST',
  },
  {
    city: 'Mumbai',
    title: 'South Asia Regional Desk',
    address: 'Bandra Kurla Complex (BKC), Mumbai, MH 400051, India',
    phone: '+91 22 5555 4321',
    email: 'mumbai@wanderflow.com',
    hours: 'Mon – Sat: 9:30 AM – 7:00 PM IST',
  },
];

const CONTACT_FAQS = [
  {
    q: 'How can I speak to a travel specialist directly?',
    a: 'You can call our toll-free concierge number at +1 (800) 555-TOUR anytime during operating hours, or send us a message through the form below for a swift callback.',
  },
  {
    q: 'Do you offer 24/7 on-trip emergency support?',
    a: 'Yes! Every traveler traveling with WanderFlow receives a dedicated 24/7 emergency concierge WhatsApp contact and private dispatch line.',
  },
  {
    q: 'Can I arrange in-person itinerary planning consultations?',
    a: 'Yes, private consultations are available by appointment at any of our global offices in New York, London, Tokyo, and Mumbai.',
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <section className="relative bg-gradient-to-br from-brand-950 via-slate-900 to-accent-950 text-white pt-14 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-brand-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-300" />
            <span>24/7 Traveler Care</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Connect With Our Expedition Concierge
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding destinations, visa guidance, or personalized itineraries? 
            Our regional travel advisors are available around the clock.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Toll-Free Phone Concierge
              </span>
              <a
                href="tel:+18005558687"
                className="text-base font-extrabold text-slate-900 hover:text-brand-600 transition-colors block mt-1"
              >
                +1 (800) 555-TOUR
              </a>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Monday to Saturday, 8am – 8pm EST
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Direct Email Assistance
              </span>
              <a
                href="mailto:enquiry@wanderflow.com"
                className="text-base font-extrabold text-slate-900 hover:text-accent-600 transition-colors block mt-1"
              >
                enquiry@wanderflow.com
              </a>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Typical reply turnaround under 2 hours
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                On-Trip Traveler Hotline
              </span>
              <span className="text-base font-extrabold text-emerald-700 block mt-1">
                24/7 Global Dispatch
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Dedicated WhatsApp line for active travelers
              </span>
            </div>
          </div>
        </div>

        {/* Global Offices Grid */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Regional Offices Worldwide
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Visit our travel advisory lounges in the world's most vibrant capitals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GLOBAL_OFFICES.map((office, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-extrabold text-sm">
                    {office.city[0]}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                    {office.title}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{office.city}</h3>
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-brand-600" />
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 to-accent-950 p-8 sm:p-10 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-200">
                Direct Message
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Send Us a Detailed Message
              </h3>
              <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
                Whether you are seeking group rates, corporate incentive expeditions, or general travel planning advice, our team is ready to respond.
              </p>
            </div>

            <div className="pt-8 border-t border-white/10 space-y-3 text-xs text-brand-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero obligations or high-pressure sales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct consultation with veteran travel managers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confidential data protection</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 sm:p-10">
            {submitted ? (
              <div className="p-8 text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900">Message Delivered</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your message has been routed to our expedition specialist. We will respond to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', topic: 'General Inquiry', phone: '', message: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Sophia Montgomery"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sophia@example.com"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 234-8971"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Custom Itinerary Advice">Custom Itinerary Advice</option>
                      <option value="Corporate / Group Bookings">Corporate / Group Bookings</option>
                      <option value="Partnership / Travel Agent">Partnership / Travel Agent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need assistance with..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-3">
          <h3 className="text-xl font-extrabold text-slate-900 text-center mb-6">
            Frequently Asked Questions
          </h3>
          {CONTACT_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
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

      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
