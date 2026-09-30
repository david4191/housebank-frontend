import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentListedProper from '../../components/dashboards/agent-dashboard/ListedProperties';

export default function AgentListedPropertiesPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <AgentListedProper />
      </div>
    </div>
  );
}