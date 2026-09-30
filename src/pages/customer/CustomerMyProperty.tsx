import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerMyPropertyPage from '../../components/dashboards/customer-dashboard/MyProperty';

export default function MyPropertyPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <CustomerMyPropertyPage />
      </div>
    </div>
  );
}