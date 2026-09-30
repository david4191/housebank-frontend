import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerPropertyListingPage from '../../components/dashboards/customer-dashboard/MainPropertyDetails';


export default function MainCustomerDetailsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <CustomerPropertyListingPage />
      </div>
    </div>
  );
}