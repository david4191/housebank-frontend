import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminSiteContent from '../../components/dashboards/admin-dashboard/AdminSiteContent';

export default function AdminSiteContentPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminSiteContent/>
      </div>
    </div>
  );
}
