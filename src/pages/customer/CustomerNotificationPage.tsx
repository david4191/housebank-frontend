import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerNotificationPage from '../../components/dashboards/customer-dashboard/NotificationPage';
export default function NotificationPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <CustomerNotificationPage />
      </div>
    </div>
  );
}