import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import RealtorTransferPage from '../../components/dashboards/customer-dashboard/RealtorTransferPage';


export default function RealtorTransferSettings() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <RealtorTransferPage />
      </div>
    </div>
  );
}