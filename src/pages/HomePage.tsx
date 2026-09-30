import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import MainContent from "../components/HomePage";
import PropertyGuide from "../components/PropertyGuide";
import TopOffers from "../components/TopOffers";
import FAQ from "../components/FAQ";
import ContactSection from "../components/ContactSection";
import BlogSection from "../components/BlogSection";

import Seo from '../components/Seo.tsx';

export default function HomePage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo description="Find verified properties to buy or rent, and real estate investment opportunities — all in one place with HouseBank." path="/" />
      <Header />
      <MainContent />
      <TopOffers />
      <PropertyGuide />
      <FAQ />
      <ContactSection  />
      <BlogSection />	
      <Footer />
    </div>
  );
}