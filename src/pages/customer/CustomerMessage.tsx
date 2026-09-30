import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import MessagesPage from '../../components/dashboards/customer-dashboard/Messages';


export default function CustomerMessagePage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="bg-white flex-1 overflow-auto">
        <MessagesPage />
      </div>
    </div>
  );
}