import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentRejectedPropertyDetailsPage from '../../components/dashboards/agent-dashboard/RejectedProperty';

export default function AgentRejectedPropertyPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
        <AgentRejectedPropertyDetailsPage />
      </div>
    </div>
  );
}