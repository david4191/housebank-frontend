import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import ReportConcernContent from "../components/ReportConcern";



import Seo from '../components/Seo.tsx';

export default function ReportConcernPage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Report a Concern" description="Report a concern about a listing, realtor, or company on HouseBank." path="/report-concern" />
      <Header />
      <ReportConcernContent />
      <Footer />
    </div>
  );
}