import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import ApprovedProperties from '../../components/dashboards/agent-dashboard/ApprovedProperties';

export default function ApprovedPropertiesPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <ApprovedProperties />
      </div>
    </div>
  );
}