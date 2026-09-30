import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentPropertyDetail from '../../components/dashboards/agent-dashboard/AgentPropertyDetail';

export default function AgentPropertyDetailPage() {
  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar userRole="agent" />
      <div className="flex-1 overflow-auto">
        <AgentPropertyDetail />
      </div>
    </div>
  );
}
