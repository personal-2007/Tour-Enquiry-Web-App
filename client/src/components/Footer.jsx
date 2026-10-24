import React from 'react';
import { Compass, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">WanderFlow</span>
            </Link>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              WanderFlow provides discerning travellers with curated itineraries, trusted local guides, 
              and authentic cultural adventures worldwide.
            </p>
            <div className="pt-2 text-slate-500 text-[11px]">
              Built with precision for the <span className="text-slate-300 font-semibold">Growfinix Technology</span> Full Stack Developer Internship Project.
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#destinations" className="hover:text-white transition-colors">Popular Destinations</a></li>
              <li><a href="#packages" className="hover:text-white transition-colors">Curated Tour Packages</a></li>
              <li><a href="#enquiry" className="hover:text-white transition-colors">Tour Enquiry Form</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact & Support</a></li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Company & Trust</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-white cursor-pointer transition-colors">Booking Guarantee</li>
              <li className="hover:text-white cursor-pointer transition-colors">Travel Insurance Guide</li>
            </ul>
          </div>

          {/* Admin Management */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Staff & Management</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 block">
                  Authorised personnel only. Access requires secure JWT session credentials.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} WanderFlow Tours & Expeditions. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Engineered for Growfinix Technology with React, Express & PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
