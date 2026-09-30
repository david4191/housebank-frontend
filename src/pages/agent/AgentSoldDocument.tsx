import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import SoldPropertyDocumentsPage from '../../components/dashboards/agent-dashboard/SoldDocument';



export default function AgentSoldDocument() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
       <SoldPropertyDocumentsPage />
      </div>
    </div>
  );
}