import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentManagementPage from '../../components/dashboards/customer-dashboard/RealtorMyAgent';


export default function RealtorMyAgents() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <AgentManagementPage />
      </div>
    </div>
  );
}