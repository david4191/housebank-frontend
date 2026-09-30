import Header from "../components/Header";
import Footer from "../components/Footer";
import AgentsDirectory from "../components/AgentsDirectory";

import Seo from '../components/Seo.tsx';

export default function AgentsPage() {
  return (
    <div className="w-full mx-auto bg-[color:var(--color-bg)] font-poppins">
      <Seo title="Find a Realtor" description="Browse verified realtors and agencies on HouseBank to help you buy, sell, or manage property." path="/agents" />
      <Header />
      <AgentsDirectory />
      <Footer />
    </div>
  );
}
