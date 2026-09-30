import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AgentReviewPage from '../../components/dashboards/agent-dashboard/AgentReviews';




export default function AgentReviews() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="agent" />
      <div className="flex-1 overflow-auto">
       <AgentReviewPage />
      </div>
    </div>
  );
}