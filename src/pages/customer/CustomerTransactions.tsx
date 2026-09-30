import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import TransactionPage from '../../components/dashboards/customer-dashboard/CustomerTransactions';


export default function CustomerTransactionsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <TransactionPage />
      </div>
    </div>
  );
}