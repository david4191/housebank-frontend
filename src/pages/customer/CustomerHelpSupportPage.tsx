import DashboardSidebar from "../../components/dashboards/DashboardSidebar";
import CustomerHelpSupport from '../../components/dashboards/customer-dashboard/HelpSupport';


export default function CustomerHelpSupportPage() {

  return (
    <div className="flex h-[100vh] bg-[color:var(--color-bg)] font-poppins">
      <DashboardSidebar />
      <div className="bg-white flex-1 overflow-auto">
        <CustomerHelpSupport />
      </div>
    </div>
  );
}