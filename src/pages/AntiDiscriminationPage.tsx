import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import PopularBlogSection from "../components/PopularBlogSection";
import RelatedArticlesSection from "../components/RelatedArticlesSection";
import AntiDiscriminationPageContent from "../components/AntiDiscrimniation";
import SearchPage from "../components/SearchPage";



import Seo from '../components/Seo.tsx';

export default function AntiDiscriminationPage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Anti-Discrimination Policy" description="HouseBank's commitment to fair housing and equal treatment for every customer, realtor, and company on the platform." path="/anti-discrimination" />
      <Header />
      <SearchPage />
      <AntiDiscriminationPageContent />
      <RelatedArticlesSection />
      <PopularBlogSection />
      <Footer />
    </div>
  );
}