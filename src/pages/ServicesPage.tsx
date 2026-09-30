import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import ServicesSlide from "../components/ServiceSlide";
import ServicesDetailPage from "../components/ServiceSection";
import ServicesWhyChooseUsPage from "../components/ServicesWhyChooseUs";
import ClientReviewsPage from "../components/ServiceClientReview";
import ContactSection from "../components/ContactSection";



import Seo from '../components/Seo.tsx';

export default function ServicesPage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Our Services" description="Explore the full range of real estate services HouseBank offers to buyers, sellers, investors, and realtors." path="/services" />
      <Header />
      <ServicesSlide />
      <ServicesDetailPage />
      <ServicesWhyChooseUsPage />
      <ClientReviewsPage />
      <ContactSection />
      <Footer />
    </div>
  );
}