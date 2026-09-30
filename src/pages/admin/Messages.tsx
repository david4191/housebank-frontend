import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminMessages from '../../components/dashboards/admin-dashboard/Messages';


export default function AdminMessagingPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminMessages />
      </div>
    </div>
  );
}