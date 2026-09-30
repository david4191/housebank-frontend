import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import SecuritySettingsPage from '../../components/dashboards/customer-dashboard/SecuritySettings';

export default function CustomerSecuritySettingsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <SecuritySettingsPage />
      </div>
    </div>
  );
}