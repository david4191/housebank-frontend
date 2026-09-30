import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminPropertyManagement from '../../components/dashboards/admin-dashboard/AdminPropertyManagement';


export default function AdminPropertiesPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminPropertyManagement />
      </div>
    </div>
  );
}