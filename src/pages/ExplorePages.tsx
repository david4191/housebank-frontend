import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import ExploreProperty from "../components/ExploreProperty";
import InspirationSection from "../components/InspirationSection";

export default function ExplorePages() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Header />
      <ExploreProperty />
      <InspirationSection />
      <Footer />
    </div>
  );
}