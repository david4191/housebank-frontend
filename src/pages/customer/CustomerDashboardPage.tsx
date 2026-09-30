import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import DashboardOverview from '../../components/dashboards/customer-dashboard/DashboardPage';

export default function CustomerDashboardPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <DashboardOverview />
      </div>
    </div>
  );
}
