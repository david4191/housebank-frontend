import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import PropertyEarningsPage from '../../components/dashboards/agent-dashboard/PropertyDetail';

export default function AgentAllPropertiesDetails() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
     <PropertyEarningsPage />
      </div>
    </div>
  );
}