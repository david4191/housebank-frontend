import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutSlide from "../components/AboutSlide";
import AboutCompany from "../components/AboutDetail";
import TeamSection from "../components/AboutTeams";
import BlogPage from "../components/AboutBlog";



import Seo from '../components/Seo.tsx';

export default function AboutUs() {
    const [mode] = useState<string>("light");
  
    return (
      <div
        className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
      >
        <Seo title="About Us" description="Learn about HouseBank — our mission, our approach to real estate, and why buyers, sellers, and investors trust us." path="/about-us" />
        <Header />
        <AboutSlide />
        <AboutCompany />
        <TeamSection />
        <BlogPage />
        <Footer />
      </div>
    );
  }