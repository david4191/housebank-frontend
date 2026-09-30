import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentAvailablePropertyDetails from '../../components/dashboards/agent-dashboard/PropertyDetails';

export default function AgentPropertiesDetailsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <AgentAvailablePropertyDetails />
      </div>
    </div>
  );
}