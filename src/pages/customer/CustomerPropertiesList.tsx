import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerPropertiesListingPage from '../../components/dashboards/customer-dashboard/PropertyListing';

export default function CustomerPropertyListsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <CustomerPropertiesListingPage />
      </div>
    </div>
  );
}