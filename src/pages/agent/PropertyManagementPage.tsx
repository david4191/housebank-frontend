import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentPropertyManagement from '../../components/dashboards/agent-dashboard/PropertyManagement';


export default function AgentPropertyManagementPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
       <AgentPropertyManagement />
      </div>
    </div>
  );
}