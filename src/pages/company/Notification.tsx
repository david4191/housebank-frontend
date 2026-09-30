import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyNotifications from '../../components/dashboards/company-dashboard/CompanyNotification';


export default function CompanyNotification() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyNotifications />
      </div>
    </div>
  );
}