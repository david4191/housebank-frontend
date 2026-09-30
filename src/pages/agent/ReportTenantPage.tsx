import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import ReportTenantPage from '../../components/dashboards/agent-dashboard/ReportTenant';


export default function AgentReportTenant() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
        <ReportTenantPage />
      </div>
    </div>
  );
}