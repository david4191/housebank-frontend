import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyListingReview from '../../components/dashboards/company-dashboard/CompanyListingReview';

export default function CompanyListingReviewPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyListingReview />
      </div>
    </div>
  );
}
