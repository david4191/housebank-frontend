import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import DocumentComplaince from '../../components/dashboards/agent-dashboard/DocumentCompliance';


export default function DocumentCOmpliancePage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
        <DocumentComplaince />
      </div>
    </div>
  );
}