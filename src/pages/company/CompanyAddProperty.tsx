import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyAddPropertyCreate from '../../components/dashboards/company-dashboard/CompanyAddproperty';


export default function CompanyAddProperty() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyAddPropertyCreate />
      </div>
    </div>
  );
}