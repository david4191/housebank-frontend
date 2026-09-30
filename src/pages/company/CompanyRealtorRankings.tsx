import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyRealtorRanking from '../../components/dashboards/company-dashboard/CompanyRealtorRanking';


export default function ManageRealtorRankings() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyRealtorRanking />
      </div>
    </div>
  );
}