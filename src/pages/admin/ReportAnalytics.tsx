import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import ReportsAnalytics from '../../components/dashboards/admin-dashboard/ReportsAnalytics';


export default function AdminReportAnalysisPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <ReportsAnalytics />
      </div>
    </div>
  );
}