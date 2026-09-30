import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import PropertyDocumentationDetailsPage from '../../components/dashboards/customer-dashboard/BuyPropertyDetailsDocumentation';

export default function CustomerBuyPropertyDocumentationPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="bg-white flex-1 overflow-auto">
        <PropertyDocumentationDetailsPage />
      </div>
    </div>
  );
}