import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, Shield, PhoneCall } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setIsOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-800 to-accent-700 bg-clip-text text-transparent">
                WanderFlow
              </span>
              <span className="block text-xs text-slate-500 font-medium tracking-wide">
                Expeditions & Tours
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('destinations')}
              className="hover:text-brand-600 transition-colors cursor-pointer"
            >
              Destinations
            </button>
            <button
              onClick={() => scrollToSection('packages')}
              className="hover:text-brand-600 transition-colors cursor-pointer"
            >
              Tour Packages
            </button>
            <button
              onClick={() => scrollToSection('enquiry')}
              className="hover:text-brand-600 transition-colors cursor-pointer"
            >
              Enquire Now
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-brand-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+18005558687"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
              <span>+1 (800) 555-TOUR</span>
            </a>

            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-brand-700 to-accent-700 hover:from-brand-800 hover:to-accent-800 px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 border border-brand-200 hover:border-brand-300 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-lg transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-brand-600" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => scrollToSection('destinations')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Destinations
          </button>
          <button
            onClick={() => scrollToSection('packages')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Tour Packages
          </button>
          <button
            onClick={() => scrollToSection('enquiry')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Enquire Now
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Contact
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold text-white bg-brand-600 rounded-lg shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
