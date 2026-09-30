import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminManageCompanies from '../../components/dashboards/admin-dashboard/AdminManageCompanies';

export default function AdminManageCOmpaniesPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminManageCompanies/>
      </div>
    </div>
  );
}