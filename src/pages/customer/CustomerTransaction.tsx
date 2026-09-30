import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerOtherTransactionPage from '../../components/dashboards/customer-dashboard/TransactionPage';

export default function CustomerTransPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="bg-white flex-1 overflow-auto">
       <CustomerOtherTransactionPage />
      </div>
    </div>
  );
}