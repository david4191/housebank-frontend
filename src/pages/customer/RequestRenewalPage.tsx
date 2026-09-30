import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import RequestRenewal from '../../components/dashboards/customer-dashboard/RequestRenewal';

export default function CustomerRenewalRequestPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="bg-white flex-1 overflow-auto">
        <RequestRenewal />
      </div>
    </div>
  );
}