import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminNotifications from '../../components/dashboards/admin-dashboard/AdminNotifications';

export default function AdminNotificationsPage() {
  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminNotifications />
      </div>
    </div>
  );
}
