import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminBlog from '../../components/dashboards/admin-dashboard/AdminBlog';

export default function AdminBlogPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminBlog/>
      </div>
    </div>
  );
}
