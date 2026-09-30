import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import MyRealtorDetailsPage from '../../components/dashboards/customer-dashboard/RealtorDetailsPage';


export default function MyAgentsDetailsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <MyRealtorDetailsPage />
      </div>
    </div>
  );
}