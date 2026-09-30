import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminSettings from '../../components/dashboards/admin-dashboard/AdminSettings';

export default function AdminSettingsPage() {
  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminSettings />
      </div>
    </div>
  );
}
