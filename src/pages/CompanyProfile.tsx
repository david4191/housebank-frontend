import Header from "../components/Header";
import Footer from "../components/Footer";
import CompanyProfile from "../components/CompanyProfile";

import Seo from '../components/Seo.tsx';

export default function CompanyProfilePage() {
  return (
    <div className="w-full mx-auto bg-[color:var(--color-bg)] font-poppins">
      <Seo title="Company Profile" description="View this real estate company's profile, listings, and team on HouseBank." />
      <Header />
      <CompanyProfile />
      <Footer />
    </div>
  );
}
