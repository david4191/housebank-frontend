import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerBuyPropDetails from "../../components/dashboards/customer-dashboard/BuyPropertyDetails";

export default function CustomerBuyPropertyDetailsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <CustomerBuyPropDetails/>
      </div>
    </div>
  );
}