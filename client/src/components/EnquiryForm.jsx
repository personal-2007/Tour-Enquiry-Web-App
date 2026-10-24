import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, User, Mail, Phone, MapPin, Calendar, Users, DollarSign, MessageSquare } from 'lucide-react';
import { enquiryApi } from '../api/client';

const BUDGET_OPTIONS = [
  'Economy (Under $1,500)',
  '$1,500 - $3,000',
  '$2,500 - $5,000',
  'Luxury ($5,000+)',
];

const POPULAR_DESTINATIONS = [
  'Santorini, Greece',
  'Kyoto & Tokyo, Japan',
  'Swiss Alps & Interlaken, Switzerland',
  'Bali & Ubud, Indonesia',
  'Dubai & Arabian Desert, UAE',
  'Serengeti & Zanzibar, Tanzania',
  'Amalfi Coast, Italy',
  'Paris & French Riviera, France',
  'Maldives Private Island Resort',
  'Machu Picchu & Cusco, Peru',
];

const EnquiryForm = ({ preselectedDestination = '', preselectedBudget = '' }) => {
  // Get tomorrow's date string for min date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    destination: '',
    travel_date: '',
    travellers: 2,
    budget: '$1,500 - $3,000',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [generalError, setGeneralError] = useState('');

  // Handle pre-selections from parent components
  useEffect(() => {
    if (preselectedDestination) {
      setFormData((prev) => ({ ...prev, destination: preselectedDestination }));
    }
    if (preselectedBudget) {
      setFormData((prev) => ({ ...prev, budget: preselectedBudget }));
    }
  }, [preselectedDestination, preselectedBudget]);

  const validateField = (name, value) => {
    let errorMsg = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,18}$/;

    switch (name) {
      case 'full_name':
        if (!value.trim()) errorMsg = 'Full name is required.';
        else if (value.trim().length < 2) errorMsg = 'Name must be at least 2 characters.';
        break;
      case 'email':
        if (!value.trim()) errorMsg = 'Email address is required.';
        else if (!emailRegex.test(value.trim())) errorMsg = 'Please enter a valid email address.';
        break;
      case 'phone':
        if (!value.trim()) errorMsg = 'Phone number is required.';
        else if (!phoneRegex.test(value.trim())) errorMsg = 'Please enter a valid phone number with area code.';
        break;
      case 'destination':
        if (!value.trim()) errorMsg = 'Please specify your target destination.';
        break;
      case 'travel_date':
        if (!value) errorMsg = 'Preferred travel date is required.';
        else {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) errorMsg = 'Travel date cannot be in the past.';
        }
        break;
      case 'travellers':
        const count = parseInt(value, 10);
        if (isNaN(count) || count < 1) errorMsg = 'At least 1 traveller is required.';
        else if (count > 100) errorMsg = 'For large groups over 100, please contact our corporate desk.';
        break;
      case 'budget':
        if (!value) errorMsg = 'Please choose a budget range.';
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation clearance
    if (errors[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'message') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // Prevent duplicate submission if already processing
    if (isSubmitting) return;

    if (!validateAll()) {
      setGeneralError('Please correct the highlighted fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await enquiryApi.submitEnquiry(formData);
      if (response.data && response.data.success) {
        setSubmitSuccess(response.data.data);
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          destination: '',
          travel_date: '',
          travellers: 2,
          budget: '$1,500 - $3,000',
          message: '',
        });
        setErrors({});
      } else {
        setGeneralError(response.data?.message || 'Could not submit your enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Enquiry submission error:', err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        setGeneralError('Please resolve the errors highlighted below.');
      } else {
        setGeneralError(err.response?.data?.message || 'Failed to connect to the server. Please check your network connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-20 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent-600" />
            <span>Fast, Free, No Obligation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Plan Your Customized Tour Enquiry
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Tell us about your dream trip. Our certified destination specialists will respond with a tailored itinerary and transparent quote within 24 hours.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12">
          
          {/* Success Banner */}
          {submitSuccess && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-sm shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">
                    Enquiry Submitted Successfully! (Reference #{submitSuccess.id})
                  </h3>
                  <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                    Thank you, <span className="font-semibold">{submitSuccess.full_name}</span>. We have received your enquiry for{' '}
                    <span className="font-semibold">{submitSuccess.destination}</span>. A confirmation notification has been logged, and our team will contact you at <span className="font-semibold">{submitSuccess.email}</span>.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                  >
                    Submit another enquiry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* General Error Banner */}
          {generalError && (
            <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.full_name
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                    }`}
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.full_name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.email
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.phone
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label htmlFor="destination" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Destination of Interest <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="destination"
                    name="destination"
                    type="text"
                    list="destinations-list"
                    required
                    placeholder="e.g. Swiss Alps, Kyoto, or Bali"
                    value={formData.destination}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.destination
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                    }`}
                  />
                  <datalist id="destinations-list">
                    {POPULAR_DESTINATIONS.map((dest, i) => (
                      <option key={i} value={dest} />
                    ))}
                  </datalist>
                </div>
                {errors.destination && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.destination}</p>
                )}
              </div>

              {/* Travel Date */}
              <div>
                <label htmlFor="travel_date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Travel Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="travel_date"
                    name="travel_date"
                    type="date"
                    min={minDateString}
                    required
                    value={formData.travel_date}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.travel_date
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                    }`}
                  />
                </div>
                {errors.travel_date && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.travel_date}</p>
                )}
              </div>

              {/* Number of Travellers & Budget Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Number of Travellers */}
                <div>
                  <label htmlFor="travellers" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Travellers <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <input
                      id="travellers"
                      name="travellers"
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={formData.travellers}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                        errors.travellers
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                          : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                      }`}
                    />
                  </div>
                  {errors.travellers && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.travellers}</p>
                  )}
                </div>

                {/* Budget Range */}
                <div>
                  <label htmlFor="budget" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Budget Range <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <select
                      id="budget"
                      name="budget"
                      required
                      value={formData.budget}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all appearance-none ${
                        errors.budget
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                          : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                      }`}
                    >
                      {BUDGET_OPTIONS.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.budget && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.budget}</p>
                  )}
                </div>

              </div>

            </div>

            {/* Message / Special Requirements */}
            <div>
              <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Special Requests or Travel Preferences (Optional)
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Share details such as room preferences, celebratory occasions (anniversary/honeymoon), dietary restrictions, airport transfers, or specific excursions..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                🔒 Your privacy is strictly protected. No spam, ever.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Tour Enquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};

export default EnquiryForm;
