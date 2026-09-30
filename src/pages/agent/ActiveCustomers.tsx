import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import ActiveCustomersPage from '../../components/dashboards/agent-dashboard/Customers';

export default function AgentActiveCustomers() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
     <ActiveCustomersPage />
      </div>
    </div>
  );
}