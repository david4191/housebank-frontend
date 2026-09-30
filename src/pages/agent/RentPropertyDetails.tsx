import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentRentDetailsPage from '../../components/dashboards/agent-dashboard/RentPropertyDetails';

export default function AgentRentPropertiesDetails() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <AgentRentDetailsPage />
      </div>
    </div>
  );
}