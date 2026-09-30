import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import MySettingsPage from '../../components/dashboards/customer-dashboard/Mysettings';

export default function CustomerSettingsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <MySettingsPage />
      </div>
    </div>
  );
}