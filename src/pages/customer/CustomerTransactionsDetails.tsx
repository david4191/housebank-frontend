import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import TransactionDetailsPage from '../../components/dashboards/customer-dashboard/TransactionDetails';


export default function CustomerTransactionsDetailsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <TransactionDetailsPage />
      </div>
    </div>
  );
}