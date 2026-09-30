import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import PropertyDetail from "../components/PropertyDetails";

import Seo from '../components/Seo.tsx';

export default function PropertyDetailsPage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Property Details" description="View full details, photos, and pricing for this property listing on HouseBank." />
      <Header />
      <PropertyDetail />
      <Footer />
    </div>
  );
}
