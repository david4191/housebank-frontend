import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyPropertyDetails from '../../components/dashboards/company-dashboard/CompanyPropertyDetails';


export default function CompanyPropertyDetailsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyPropertyDetails />
      </div>
    </div>
  );
}