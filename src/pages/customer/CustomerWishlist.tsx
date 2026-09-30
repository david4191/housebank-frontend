import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerWishlist from '../../components/dashboards/customer-dashboard/Wishlist';

export default function CustomerWishlistPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <CustomerWishlist />
      </div>
    </div>
  );
}