import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import TransactionDetailsPendingPage from '../../components/dashboards/customer-dashboard/TransactionPending';

export default function CustomerTransactionsPendingPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <TransactionDetailsPendingPage />
      </div>
    </div>
  );
}