import AnimatedBackground from "@/components/AnimatedBackground";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedCompanies from "@/components/TrustedCompanies";
import BentoFeatures from "@/components/BentoFeatures";
import HowItWorks from "@/components/HowItWorks";

import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--pp-bg)] text-[var(--pp-text)]">

      <AnimatedBackground />
      <CursorGlow />

      <Navbar />

      <Hero />

      <TrustedCompanies />

      <BentoFeatures />

      <HowItWorks />

      

      <WhyChooseUs />

      <FAQ />

      <Stats />

      <CTA />

      <Footer />

    </main>
  );
}