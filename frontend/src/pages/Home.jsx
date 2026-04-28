import React from 'react';
import HeroSection from '../components/home/HeroSection';
import Features from '../components/home/Features';
import AboutSection from '../components/home/AboutSection';
import HelpButton from '../components/common/HelpButton';

const Home = () => {
  return (
    <div className="home-page">
      <main>
        <HeroSection />
        <Features />
        <AboutSection />
      </main>
      <HelpButton />
    </div>
  );
};

export default Home;