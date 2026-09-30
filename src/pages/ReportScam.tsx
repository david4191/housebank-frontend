import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import ReportScamContent from "../components/ReportScam";



import Seo from '../components/Seo.tsx';

export default function ReportScamPage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Report a Scam" description="Report suspected fraudulent activity on HouseBank to help keep the platform safe." path="/report-scam" />
      <Header />
      <ReportScamContent />
      <Footer />
    </div>
  );
}