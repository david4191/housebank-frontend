import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import EarningsCommissionPage from '../../components/dashboards/agent-dashboard/Transactions';


export default function AgentTransactions() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <EarningsCommissionPage />
      </div>
    </div>
  );
}