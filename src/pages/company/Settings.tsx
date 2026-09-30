import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CompanySettings from '../../components/dashboards/company-dashboard/CompanySettings';

export default function CompanySettingsPage() {
  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar userRole="company" />
      <div className="flex-1 overflow-auto">
        <CompanySettings />
      </div>
    </div>
  );
}
