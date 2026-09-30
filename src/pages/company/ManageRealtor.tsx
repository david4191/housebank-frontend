import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyManageRealtors from '../../components/dashboards/company-dashboard/ManageRealtors';


export default function ManageRealtorMain() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyManageRealtors />
      </div>
    </div>
  );
}