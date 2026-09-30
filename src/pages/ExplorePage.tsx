import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import ExploreProperty from "../components/ExploreProperty";
import InvestProperty from "../components/InvestProperty";
import HotSales from "../components/HotSales";


import Seo from '../components/Seo.tsx';

export default function ExplorePage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Explore Properties" description="Browse verified properties for sale and rent on HouseBank. Filter by location, price, and property type to find your next home or investment." path="/explore" />
      <Header />
      <ExploreProperty />
      <InvestProperty />
      <HotSales />
      <Footer />
    </div>
  );
}