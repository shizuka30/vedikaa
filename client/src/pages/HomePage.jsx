// client/src/pages/HomePage.jsx

import React from 'react';
import HeroSection from '../components/HeroSection';
import OccasionSection from '../components/OccasionSection';
import HowItWorksSection from '../components/HowItWorksSection';

// This page is now the complete landing page for logged-out users.
// The HomeRoute component ensures that logged-in users are redirected away from this page.

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <OccasionSection />
      <HowItWorksSection />
      {/* The FeaturedManagers section is intentionally left out, as it's for logged-in users */}
    </>
  );
};

export default HomePage;