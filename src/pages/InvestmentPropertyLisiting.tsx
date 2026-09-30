import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import ListPropertyPage from "../components/PropertyListing";


import Seo from '../components/Seo.tsx';

export default function InvestmentPropertyListing() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Investment Property Listings" description="Browse property investment listings on HouseBank and find your next opportunity." path="/Investment-listing" />
      <Header />
      <ListPropertyPage />
      <Footer />
    </div>
  );
}