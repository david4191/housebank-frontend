import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminOverview from '../../components/dashboards/admin-dashboard/Overview';


export default function AdminOverviewPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminOverview/>
      </div>
    </div>
  );
}