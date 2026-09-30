import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyRevenue from '../../components/dashboards/company-dashboard/CompanyRevenue';


export default function CompanyRevenuePage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyRevenue />
      </div>
    </div>
  );
}