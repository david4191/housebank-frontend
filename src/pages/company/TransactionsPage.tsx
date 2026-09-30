import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyTransactions from '../../components/dashboards/company-dashboard/CompanyTransactions';


export default function CompanyTransactionsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyTransactions/>
      </div>
    </div>
  );
}