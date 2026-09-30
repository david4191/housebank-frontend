import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import ManageDispute from '../../components/dashboards/customer-dashboard/ManageDispute';


export default function CustomerManageDisputePage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="bg-white flex-1 overflow-auto">
        <ManageDispute />
      </div>
    </div>
  );
}