import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanySupport from '../../components/dashboards/company-dashboard/CompanySupport';


export default function CompanySupportPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanySupport/>
      </div>
    </div>
  );
}