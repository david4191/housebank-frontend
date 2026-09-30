import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerSubscriptionPlansPage from '../../components/dashboards/customer-dashboard/subscriptions';

export default function CustomerSubscriptionPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <CustomerSubscriptionPlansPage />
      </div>
    </div>
  );
}