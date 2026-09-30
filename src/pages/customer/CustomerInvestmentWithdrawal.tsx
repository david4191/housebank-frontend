import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerInvestmentWithdrawalDetails from '../../components/dashboards/customer-dashboard/InvestmentWithdrawal';

export default function CustomerInvestmentWithdrawalPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <CustomerInvestmentWithdrawalDetails />
      </div>
    </div>
  );
}