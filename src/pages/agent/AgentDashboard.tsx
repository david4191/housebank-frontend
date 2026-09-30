import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentDashboard from '../../components/dashboards/agent-dashboard/Dashboard';

export default function AgentDashboardPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <AgentDashboard   />
      </div>
    </div>
  );
}