import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentSettings from '../../components/dashboards/agent-dashboard/AgentSettings';

export default function AgentSettingsPage() {
  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar userRole="agent" />
      <div className="flex-1 overflow-auto">
        <AgentSettings />
      </div>
    </div>
  );
}
