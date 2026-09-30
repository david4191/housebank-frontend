import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import BecomeRealtor from "../components/RealtorSlide";
import WhyJoinUs from "../components/RealtorWhyJoin";
import FeaturesSection from "../components/RealtorFeaturesSection";
import BenefitsSection from "../components/RealtorBenefitsSection";
import WhyChooseUsPage from "../components/RealtorWhyChooseUs";
import BlogSection from "../components/BlogSection";


import Seo from '../components/Seo.tsx';

export default function RealtorLanding() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Become a Realtor" description="Join HouseBank as a realtor. Buy, sell, and invest in real estate with the tools and connections to close deals faster." path="/realtor-landing" />
      <Header />
      <BecomeRealtor />
      <WhyJoinUs />
      <FeaturesSection />
      <BenefitsSection />
      <WhyChooseUsPage />
      <BlogSection />
      <Footer />
    </div>
  );
}