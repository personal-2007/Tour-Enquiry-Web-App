import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Destinations from '../components/Destinations';
import TourPackages from '../components/TourPackages';
import EnquiryForm from '../components/EnquiryForm';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage = () => {
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const scrollToEnquiry = () => {
    const enquiryElement = document.getElementById('enquiry');
    if (enquiryElement) {
      enquiryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPackages = () => {
    const packagesElement = document.getElementById('packages');
    if (packagesElement) {
      packagesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDestination = (destinationName) => {
    setSelectedDestination(destinationName);
    scrollToEnquiry();
  };

  const handleSelectPackage = (destinationName, budgetCategory) => {
    setSelectedDestination(destinationName);
    if (budgetCategory) {
      setSelectedBudget(budgetCategory);
    }
    scrollToEnquiry();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Hero
          onExploreClick={scrollToPackages}
          onEnquireClick={scrollToEnquiry}
        />
        <Destinations onSelectDestination={handleSelectDestination} />
        <TourPackages onSelectPackage={handleSelectPackage} />
        <EnquiryForm
          preselectedDestination={selectedDestination}
          preselectedBudget={selectedBudget}
        />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
