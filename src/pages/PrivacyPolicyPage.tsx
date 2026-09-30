import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import PrivacyPolicyContent from "../components/PrivacyPolicy";
import SearchPage from "../components/SearchPage";
import RelatedArticlesSection from "../components/RelatedArticlesSection";
import PopularBlogSection from "../components/PopularBlogSection";



import Seo from '../components/Seo.tsx';

export default function PrivacyPolicyPage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Privacy Policy" description="How HouseBank collects, uses, and protects your personal information." path="/privacy-policy" />
      <Header />
      <SearchPage />
      <PrivacyPolicyContent />
      <RelatedArticlesSection />
      <PopularBlogSection />
      <Footer />
    </div>
  );
}