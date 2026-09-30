import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanyManageCustomers from '../../components/dashboards/company-dashboard/CompanyCustomer';

export default function CompanyCustomersPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar  userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanyManageCustomers />
      </div>
    </div>
  );
}