import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import ReportRealtorPage from '../../components/dashboards/customer-dashboard/ReportAgent';


export default function CustomerReportAgentPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <ReportRealtorPage />
      </div>
    </div>
  );
}