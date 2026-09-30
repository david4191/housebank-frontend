import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerInvestmentsPayment from '../../components/dashboards/customer-dashboard/InvestmentPayment';

export default function CustomerInvestmentPaymentPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="bg-white flex-1 overflow-auto">
        <CustomerInvestmentsPayment />
      </div>
    </div>
  );
}