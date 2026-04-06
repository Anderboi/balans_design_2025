'use client';

import { useRef } from 'react';
import Header from './_components/Header';
import HeroSection from './_components/HeroSection';
import BentoFeatures from './_components/BentoFeatures';
import BeforeAfter from './_components/BeforeAfter';
import HowItWorks from './_components/HowItWorks';
import Pricing from './_components/Pricing';
import Testimonials from './_components/Testimonials';
import FinalCTA from './_components/FinalCTA';
import Footer from './_components/Footer';
import StickyCTA from './_components/StickyCTA';

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-[#fafafa] text-[#0a0a0a] overflow-x-hidden">
      <Header />

      <div ref={heroRef}>
        <HeroSection />
      </div>

      <BentoFeatures />
      <BeforeAfter />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />

      <StickyCTA heroRef={heroRef} />
    </div>
  );
}
