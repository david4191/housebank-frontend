import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import ProfileSettingsPage from '../../components/dashboards/customer-dashboard/ProfileSettings';

export default function CustomerProfileSettingsPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
       <ProfileSettingsPage />
      </div>
    </div>
  );
}