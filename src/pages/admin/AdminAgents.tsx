import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminTotalAgent from '../../components/dashboards/admin-dashboard/AdminTotalAgent';


export default function AdminAgencyPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminTotalAgent/>
      </div>
    </div>
  );
}