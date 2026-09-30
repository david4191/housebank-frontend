import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CardSettingsPage from '../../components/dashboards/customer-dashboard/CardSettingsPage';


export default function CustomerCardSettings() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <CardSettingsPage />
      </div>
    </div>
  );
}