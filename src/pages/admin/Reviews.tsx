import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import AdminReviews from '../../components/dashboards/admin-dashboard/Reviews';


export default function AdminReviewsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="admin" />
      <div className="flex-1 overflow-auto">
        <AdminReviews />
      </div>
    </div>
  );
}