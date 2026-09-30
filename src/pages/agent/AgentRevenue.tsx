import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentRevenueDashboard from '../../components/dashboards/agent-dashboard/AgentRevenue';


export default function AgentRevenueDashboardPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <AgentRevenueDashboard />
      </div>
    </div>
  );
}