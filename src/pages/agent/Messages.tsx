import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentMessagesChatPage from '../../components/dashboards/agent-dashboard/Messages';




export default function AgentMessages() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
       <AgentMessagesChatPage />
      </div>
    </div>
  );
}