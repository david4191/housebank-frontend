import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyOverview from '../../components/dashboards/company-dashboard/Dashboard';

export default function CompanyDashboardPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyOverview />
      </div>
    </div>
  );
}