import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import RentChartDetailsPage from '../../components/dashboards/agent-dashboard/RentDetails';

export default function AgentRentDetailsChart() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <RentChartDetailsPage />
      </div>
    </div>
  );
}