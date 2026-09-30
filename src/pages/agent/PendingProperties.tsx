import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import PendingProperties from '../../components/dashboards/agent-dashboard/PendingProperties';

export default function PendingPropertiesPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <PendingProperties />
      </div>
    </div>
  );
}