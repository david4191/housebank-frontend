import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import DocumentCompliancePage from '../../components/dashboards/agent-dashboard/Documents';


export default function AgentDocumentCompliance() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
        <DocumentCompliancePage />
      </div>
    </div>
  );
}