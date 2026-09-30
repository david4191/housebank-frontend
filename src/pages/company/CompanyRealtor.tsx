import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyManageRealtor from '../../components/dashboards/company-dashboard/CompanyRealtor';

export default function CompanyRealtorPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyManageRealtor />
      </div>
    </div>
  );
}