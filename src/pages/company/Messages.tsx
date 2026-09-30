import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyMessages from '../../components/dashboards/company-dashboard/CompanyMessages';


export default function CompanyMessage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyMessages />
      </div>
    </div>
  );
}