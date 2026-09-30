import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import PropertyListingsPage from "../components/InvestmentPropertyListing";
import InspirationSection from "../components/InspirationSection";


import Seo from '../components/Seo.tsx';

export default function Investment() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Property Investment Opportunities" description="Invest in real estate with HouseBank. Browse open investment opportunities and grow your portfolio with verified property deals." path="/investment" />
      <Header />
      <PropertyListingsPage />
      <InspirationSection />
      <Footer />
    </div>
  );
}
