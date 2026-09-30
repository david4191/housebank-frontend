import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import InvestmentRequestDetailsPage from '../../components/dashboards/customer-dashboard/InvestmentRequest';

export default function CustomerInvestmentRequest() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="bg-white flex-1 overflow-auto">
      <InvestmentRequestDetailsPage />
      </div>
    </div>
  );
}