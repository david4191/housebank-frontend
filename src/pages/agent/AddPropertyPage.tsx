import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentAddListPropertyPage from '../../components/dashboards/agent-dashboard/AddProperty';

export default function AgentAddPropertyPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
        <AgentAddListPropertyPage />
      </div>
    </div>
  );
}