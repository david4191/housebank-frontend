import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerPropertyDetailsPage from '../../components/dashboards/customer-dashboard/PropertyDetail';

export default function CustomerPropertyDetailPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <CustomerPropertyDetailsPage />
      </div>
    </div>
  );
}