import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentHelpSupport from '../../components/dashboards/agent-dashboard/HelpSupport';

export default function AgentCustomerSupportPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
      <AgentHelpSupport />
      </div>
    </div>
  );
}