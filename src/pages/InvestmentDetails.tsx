import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import InvestmentPropertyDetailPage from "../components/InvestmentDetails";
import InspirationSection from "../components/InspirationSection";
import SimilarPropertiesSection from "../components/InvestmentSimilarProperty";


import Seo from '../components/Seo.tsx';

export default function InvestmentDetails() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Investment Opportunity" description="View the full details of this property investment opportunity on HouseBank, including expected returns and investor terms." />
      <Header />
      <InvestmentPropertyDetailPage />
      <SimilarPropertiesSection />
      <InspirationSection />
      <Footer />
    </div>
  );
}