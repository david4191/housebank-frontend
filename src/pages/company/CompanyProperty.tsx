import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyPropertyPager from '../../components/dashboards/company-dashboard/CompanyProperty';

export default function CompanyPropertyPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyPropertyPager />
      </div>
    </div>
  );
}