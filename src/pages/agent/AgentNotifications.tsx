import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentNotifications from '../../components/dashboards/agent-dashboard/AgentNotifications';

export default function AgentNotificationsPage() {
  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar userRole="agent" />
      <div className="flex-1 overflow-auto">
        <AgentNotifications />
      </div>
    </div>
  );
}
