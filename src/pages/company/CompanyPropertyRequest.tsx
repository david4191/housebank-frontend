import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyPropertyRequests from '../../components/dashboards/company-dashboard/CompanyPropertyRequest';


export default function CompanyPropertyRequest() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyPropertyRequests />
      </div>
    </div>
  );
}