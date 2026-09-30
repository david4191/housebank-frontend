// src/App.tsx

import { ErrorBoundary } from 'react-error-boundary';

import { Routes, Route } from 'react-router-dom';

import SignUpSeller from './pages/SignUp.tsx';

import SignIn from './pages/SignIn.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';

import OTPVerification from './pages/OTPVerification.tsx';

import SignUpBuyer from './pages/SignUpBuyer.tsx';
import RealtorOnboarding from './pages/RealtorOnboarding.tsx';

import SignUpUser from './pages/SignUpUser.tsx';

import { AuthProvider } from './context/AuthContext.tsx';

import { RequireAuth } from './components/RequireAuth.tsx';

import { AuthLayout, Layout } from './components/Layout.tsx';

import NotFound from './components/404.tsx';

import ScrollToTop from './components/ScrollToTop.tsx';

import HomePage from './pages/HomePage.tsx';

import ExplorePage from './pages/ExplorePage.tsx';

import ExplorePages from './pages/ExplorePages.tsx';

import PropertyDetail from './pages/PropertyDetails.tsx';
import AgentsPage from './pages/Agents.tsx';
import CompanyProfilePage from './pages/CompanyProfile.tsx';

import AboutUs from './pages/AboutUs.tsx';

import RealtorLanding from './pages/RealtorLanding.tsx';

import Investment from './pages/Investment.tsx';

import InvestmentDetails from './pages/InvestmentDetails.tsx';

import InvestmentPropertyListing from './pages/InvestmentPropertyLisiting.tsx';

import ListedPropertyCover from './pages/ListedPropertiesCover.tsx';

import UsersPropertyCover from './pages/UsersCover.tsx';

import HelpCenterPage from './pages/HelpCenterPage.tsx';

import BlogsMainPage from './pages/BlogsPage.tsx';

import BlogsDetailsPage from './pages/BlogDetails.tsx';

import AntiDiscriminationPage from './pages/AntiDiscriminationPage.tsx';

import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';

import ReportConcernPage from './pages/ReportConcernPage.tsx';

import ReportScamPage from './pages/ReportScam.tsx';

import ServicesPage from './pages/ServicesPage.tsx';

import PropertyManagementPage from './pages/PropertyManagementPage.tsx';



// Customer Pages

import CustomerDashboardPage from './pages/customer/CustomerDashboardPage.tsx';

import NotificationPage from './pages/customer/CustomerNotificationPage.tsx';

import MyPropertyPage from './pages/customer/CustomerMyProperty.tsx';

import CustomerPropertyDetailPage from './pages/customer/CustomerPropertyDetail.tsx';

import CustomerSettingsPage from './pages/customer/CustomerSettings.tsx';

import MainCustomerDetailsPage from './pages/customer/CustomerPropertyDetailsPageOne.tsx';

import CustomerPropertyListsPage from './pages/customer/CustomerPropertiesList.tsx';

import CustomerBuyPaymentPage from './pages/customer/CustomerBuyPayment.tsx';

import CustomerWishlistPage from './pages/customer/CustomerWishlist.tsx';

import CustomerSubscriptionPage from './pages/customer/CustomerSubscription.tsx';

import CustomerInvestmentWithdrawalPage from './pages/customer/CustomerInvestmentWithdrawal.tsx';

import CustomerProfileSettingsPage from './pages/customer/CustomerProfileSettingsPage.tsx';

import CustomerSecuritySettingsPage from './pages/customer/CustomerSecuritySetting.tsx';

import CustomerCardSettings from './pages/customer/CustomerCardSettingsPage.tsx';

import RealtorTransferSettings from './pages/customer/RealtorTransferPage.tsx';

import RealtorMyAgents from './pages/customer/CustomerMyAgents.tsx';

import MyAgentsDetailsPage from './pages/customer/CustomerRealtorDetailsPage.tsx';

import CustomerReportAgentPage from './pages/customer/CustomerReportRealtor.tsx';

import CustomerDeleteAgentPage from './pages/customer/CustomerDeleteRealtor.tsx';

import CustomerTransactionsPage from './pages/customer/CustomerTransactions.tsx';

import CustomerTransactionsDetailsPage from './pages/customer/CustomerTransactionsDetails.tsx';

import CustomerTransactionsPendingPage from './pages/customer/CustomerTransactionPending.tsx';

import CustomerBuyPropertyDetailsPage from './pages/customer/CustomerBuyPropertyDetails.tsx';

import CustomerTransPage from './pages/customer/CustomerTransaction.tsx';

import CustomerBuyPropertyDocumentationPage from './pages/customer/CustomerBuyPropertyDocumentation.tsx';

import CustomerRenewalRequestPage from './pages/customer/RequestRenewalPage.tsx';

import CustomerInvestmentPaymentPage from './pages/customer/CustomerInvestmentPayment.tsx';

import CustomerInvestmentRequest from './pages/customer/CustomerInvestmentRequest.tsx';

import CustomerManageDisputePage from './pages/customer/CustomerManageDispute.tsx';

import CustomerMessagePage from './pages/customer/CustomerMessage.tsx';

import CustomerHelpSupportPage from './pages/customer/CustomerHelpSupportPage.tsx';

import AgentDashboardPage from './pages/agent/AgentDashboard.tsx';

import AgentListedPropertiesPage from './pages/agent/ListedProperties.tsx';

import ApprovedPropertiesPage from './pages/agent/ApprovedProperties.tsx';

import PendingPropertiesPage from './pages/agent/PendingProperties.tsx';

import DocumentCOmpliancePage from './pages/agent/DocumentCompliance.tsx';

import AgentPropertyManagementPage from './pages/agent/PropertyManagementPage.tsx';



import AgentAddPropertyPage from './pages/agent/AddPropertyPage.tsx';

import AgentPropertyDetailPage from './pages/agent/AgentPropertyDetail.tsx';
import AgentSettingsPage from './pages/agent/AgentSettings.tsx';
import AgentNotificationsPage from './pages/agent/AgentNotifications.tsx';


import AgentRevenueDashboardPage from './pages/agent/AgentRevenue.tsx';

import AgentTransactions from './pages/agent/AgentTransactions.tsx';


import AgentActiveCustomers from './pages/agent/ActiveCustomers.tsx';

import AgentRentDetailsChart from './pages/agent/RentProperty.tsx';

import AgentReportTenant from './pages/agent/ReportTenantPage.tsx';

import AgentDocumentCompliance from './pages/agent/DocumentsCompliance.tsx';

import AgentSoldDocument from './pages/agent/AgentSoldDocument.tsx';

import AgentMessages from './pages/agent/Messages.tsx';

import AgentReviews from './pages/agent/AgentReviews.tsx';

import AgentCustomerSupportPage from './pages/agent/CustomerSupport.tsx';

import CompanyDashboardPage from './pages/company/Dashboard.tsx';

import CompanyPropertyPage from './pages/company/CompanyProperty.tsx';

import CompanyRealtorPage from './pages/company/CompanyRealtor.tsx';

import CompanyCustomersPage from './pages/company/CompanyCustomer.tsx';

import CompanyPropertyDetailsPage from './pages/company/CompanyPropertyDetails.tsx';

import CompanyPropertyRequest from './pages/company/CompanyPropertyRequest.tsx';

import CompanyListingReviewPage from './pages/company/CompanyListingReview.tsx';

import CompanyAddProperty from './pages/company/CompanyAddProperty.tsx';

import ManageRealtorMain from './pages/company/ManageRealtor.tsx';

import ManageRealtorRankings from './pages/company/CompanyRealtorRankings.tsx';

import TransferAgent from './pages/company/CompanyTransferAgent.tsx';

import CompanyNotification from './pages/company/Notification.tsx';

import CompanyMessage from './pages/company/Messages.tsx';

import CompanyRevenuePage from './pages/company/CompanyRevenue.tsx';

import CompanyTransactionsPage from './pages/company/TransactionsPage.tsx';

import CompanySupportPage from './pages/company/Support.tsx';

import CompanySettingsPage from './pages/company/Settings.tsx';

import AdminOverviewPage from './pages/admin/Dashboard.tsx';

import AdminManageCOmpaniesPage from './pages/admin/Companies.tsx';

import AdminAgencyPage from './pages/admin/AdminAgents.tsx';

import AdminCustomersPage from './pages/admin/Customers.tsx';

import AdminPropertiesPage from './pages/admin/Properties.tsx';

import AdminReportAnalysisPage from './pages/admin/ReportAnalytics.tsx';

import AdminMessagingPage from './pages/admin/Messages.tsx';

import AdminReviewsPage from './pages/admin/Reviews.tsx';

import AdminNotificationsPage from './pages/admin/Notification.tsx';

import AdminSettingsPage from './pages/admin/Settings.tsx';

import AdminBlogPage from './pages/admin/Blog.tsx';
import AdminSiteContentPage from './pages/admin/SiteContent.tsx';



// Agent Pages

const App = () => {

  return (

    <AuthProvider>

      <ScrollToTop />

      <ErrorBoundary fallback={<div>Error! Check console</div>}>

        <Routes>

          <Route path="/" element={<HomePage />} />

          <Route path="*" element={<NotFound />} />

          <Route element={<AuthLayout />}>

            <Route path="/signup-seller" element={<SignUpSeller />} />

            <Route path="/signup-buyer" element={<SignUpBuyer />} />

            <Route path="/realtor-onboarding/:token" element={<RealtorOnboarding />} />

            <Route path="/signup" element={<SignUpUser />} />

            <Route path="/signin" element={<SignIn />} />

            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

          </Route>

          {/*Secure routes here*/}

          <Route element={<Layout />}>

            <Route path="/landing" element={<HomePage />} />

          </Route>

          <Route path="/" element={<HomePage />} />

          <Route path="/explore" element={<ExplorePage />} />

          <Route path="/explores" element={<ExplorePages />} />

          <Route path="/property-details/:id" element={<PropertyDetail />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/companies/:id" element={<CompanyProfilePage />} />

          <Route path="/about-us" element={<AboutUs />} />

          <Route path="/realtor-landing" element={<RealtorLanding />} />

           <Route path="/investment" element={<Investment />} />

           <Route path="/investment-details/:id" element={<InvestmentDetails />} />

           <Route path="/Investment-listing" element={<InvestmentPropertyListing />} />

           <Route path="/listed-properties-cover" element={<ListedPropertyCover />} />

           <Route path="/housebank-Users-cover" element={<UsersPropertyCover   />} />

         <Route path="/help-center" element={<HelpCenterPage />} />

        <Route path="/blogs" element={<BlogsMainPage />} /> 

        <Route path="/blog-details/:slug" element={<BlogsDetailsPage />} />

        <Route path="/privacy-policy" element={<PrivacyPolicyPage  />} />

        <Route path="/anti-discrimination" element={<AntiDiscriminationPage   />} />

        <Route path="/report-concern" element={<ReportConcernPage />} />

        <Route path="/report-scam" element={<ReportScamPage  />} />

        <Route path="/services" element={<ServicesPage  />} />

        <Route path="/property-management" element={<PropertyManagementPage />} />



        <Route element={<RequireAuth roles={['customer']} />}>

        {/* Customer Pages  */}

        <Route path='/customer/dashboard' element={<CustomerDashboardPage />} />

        <Route path="/customer/notifications" element={<NotificationPage />} />

        <Route path='/customer/properties' element={<MyPropertyPage />} />

        <Route path='/customer/property-detail' element={<CustomerPropertyDetailPage />} />

        <Route path="/customer/settings" element={<CustomerSettingsPage />} />

        <Route path='/customer/property-details/:id' element={<MainCustomerDetailsPage />} />

        <Route path='/customer/property-listing' element={<CustomerPropertyListsPage />} />

        <Route path='/customer/buy-payment' element={<CustomerBuyPaymentPage />} />

        <Route path="/customer/wishlist" element={<CustomerWishlistPage  />} />

        <Route  path='/customer/subscription' element={<CustomerSubscriptionPage />} />

        <Route path='/customer/investment-withdrawal' element={<CustomerInvestmentWithdrawalPage />} />

        <Route path='/customer/profile-settings' element={<CustomerProfileSettingsPage  />} />

        <Route path="/customer/security-settings" element={<CustomerSecuritySettingsPage  />} />

        <Route path='/customer/card-settings' element={<CustomerCardSettings  />} />

        <Route path="/customer/realtor-transfer" element={<RealtorTransferSettings />} />

        <Route path="/customer/my-realtor" element={<RealtorMyAgents />} />

        <Route path='/customer/my-realtor-details' element={<MyAgentsDetailsPage />} />

        <Route path='/customer/report-realtor' element={<CustomerReportAgentPage />} />

        <Route path='/customer/delete-realtor' element={<CustomerDeleteAgentPage  />} />

        <Route path="/customer/transactions" element={<CustomerTransactionsPage />} />

        <Route path="/customer/transactions-completed" element={<CustomerTransactionsDetailsPage />} />

        <Route path="/customer/transactions-pending" element={<CustomerTransactionsPendingPage />} />

        <Route path='/customer/buy-property-details' element={<CustomerBuyPropertyDetailsPage />} />

        <Route path='/customer/transaction' element={<CustomerTransPage />} />

        <Route path='/customer/property-documentation' element={<CustomerBuyPropertyDocumentationPage />} />

        <Route path='/customer/renewal-request' element={<CustomerRenewalRequestPage />} />

         <Route path='/customer/investment-payment' element={<CustomerInvestmentPaymentPage />} />

         <Route path='/customer/investment-request' element={<CustomerInvestmentRequest />} />

         <Route path='/customer/manage-dispute' element={<CustomerManageDisputePage />} />

         <Route path='/customer/messages' element={<CustomerMessagePage />} />

         <Route path='/customer/help' element={<CustomerHelpSupportPage />} />



        </Route>



        <Route element={<RequireAuth roles={['agent']} />}>

         {/* Agent Pages */}



        <Route path='/agent/dashboard' element={<AgentDashboardPage />} />

        <Route path='/agent/properties' element={<AgentListedPropertiesPage />} />

        <Route path='/agent/approved-properties' element={<ApprovedPropertiesPage />} />

        <Route path='/agent/pending-properties' element={<PendingPropertiesPage />} />

         <Route path='/agent/list-property' element={<DocumentCOmpliancePage />} />

         <Route path='/agent/property-management' element={<AgentPropertyManagementPage />} />

         <Route path='/agent/property-details/:id' element={<AgentPropertyDetailPage />} />
         <Route path='/agent/settings' element={<AgentSettingsPage />} />

         <Route path='/agent/notifications' element={<AgentNotificationsPage />} />

         <Route path='/agent/add-property' element={<AgentAddPropertyPage />} />

         <Route path='/agent/revenue' element={<AgentRevenueDashboardPage />} />

         <Route path='/agent/transactions' element={<AgentTransactions />} />

         <Route path='/agent/customers' element={<AgentActiveCustomers /> } />

         <Route path='agent/rent-details' element={<AgentRentDetailsChart /> } />

          <Route path='agent/report-tenant' element={<AgentReportTenant /> } />

          <Route path='agent/documents' element={<AgentDocumentCompliance /> } />

          <Route path='agent/sold-document' element={<AgentSoldDocument /> } />

          <Route path='agent/messages' element={<AgentMessages /> } />

           <Route path='agent/reviews' element={<AgentReviews /> } />

           <Route path='agent/support' element={<AgentCustomerSupportPage /> } />



        </Route>



        <Route element={<RequireAuth roles={['company']} />}>

             {/* COmpany Pages */}

             <Route path='company/overview' element={<CompanyDashboardPage /> } />

             <Route path='company/property' element={<CompanyPropertyPage /> } />

             <Route path='company/listing-review' element={<CompanyListingReviewPage /> } />

             <Route path='company/realtors' element={<CompanyRealtorPage /> } />

             <Route path='company/customers' element={<CompanyCustomersPage /> } />

             <Route path='company/property-details/:id' element={<CompanyPropertyDetailsPage /> } />

             <Route path='company/property-request' element={<CompanyPropertyRequest /> } />

             <Route path='company/add-property' element={<CompanyAddProperty /> } />

             <Route path='company/manage-realtor' element={<ManageRealtorMain /> } />

             <Route path='company/realtor-rankings' element={<ManageRealtorRankings /> } />

             <Route path='company/transfer-agent' element={<TransferAgent /> } />

             <Route path='company/notifications' element={<CompanyNotification />} />

             <Route path='company/messages' element={<CompanyMessage />} />

             <Route path='company/revenue' element={<CompanyRevenuePage />} />

             <Route path='company/transactions' element={<CompanyTransactionsPage />} />

             <Route path='company/support' element={<CompanySupportPage />} />

             <Route path='company/settings' element={<CompanySettingsPage />} />



        </Route>



        <Route element={<RequireAuth roles={['admin']} />}>

              {/* Admin Pages */}



              <Route path='admin/overview' element={<AdminOverviewPage /> } />

              <Route path='admin/companies' element={<AdminManageCOmpaniesPage />} />

              <Route path='admin/realtors' element={<AdminAgencyPage />} />

              <Route path='admin/customers' element={<AdminCustomersPage />} />

              <Route path='admin/properties' element={<AdminPropertiesPage />} />

              <Route path='admin/reports' element={<AdminReportAnalysisPage />} />

              <Route path='admin/messages' element={<AdminMessagingPage />} />

              <Route path='admin/reviews' element={<AdminReviewsPage />} />

              <Route path='admin/notifications' element={<AdminNotificationsPage />} />

              <Route path='admin/settings' element={<AdminSettingsPage />} />

              <Route path='admin/blog' element={<AdminBlogPage />} />

              <Route path='admin/site-content' element={<AdminSiteContentPage />} />



        </Route>

        </Routes>

      </ErrorBoundary>

    </AuthProvider>

  );

};





export default App;

