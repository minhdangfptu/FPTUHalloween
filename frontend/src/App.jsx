import * as React from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/Normal/HomePage";
import ErrorPage404 from "./pages/Errors/ErrorPage404";
import ErrorPage403 from "./pages/Errors/ErrorPage403";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import ConfirmEmail from "./pages/Authentication/ConfirmEmail";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import AboutUs from "./pages/Normal/AboutUs";
import BTCFUHLW from "./pages/Normal/BTCFUHLW";
import ContactUs from "./pages/Normal/ContactUsPage";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CompleteRegister from "./pages/Authentication/CompleteRegister";
import OldEvent from "./pages/Introduce/OldEvent";
import IntroduceEvent from "./pages/Introduce/IntroduceEvent";
import Fanpage from "./pages/Introduce/Fanpage";
import DataPolicy from "./pages/Normal/DataPolicy";
import TermOfUse from "./pages/Normal/TermOfUse";
import TicketPolicy from "./pages/Normal/TicketPolicy";
import FAQ from "./pages/Normal/FAQ";
import Overall from "./pages/Halloween2025/Overall";
import Agenda from "./pages/Halloween2025/Agenda";
import News from "./pages/Halloween2025/News";
import FPTUBoardGameClub from "./pages/Halloween2026/FPTUBoardGameClub";
import ChangePassword from "./pages/Authentication/ChangePassword";
import MessengerButton from "./components/MessengerButton";
import UserProfile from "./pages/Account/UserProfile";
import MyTicket from "./pages/Account/MyTicket";
import FBGCLogin from "./pages/Authentication/FBGCLogin";
import ListTicketTypePage from "./pages/Ticket/ListTicketTypePage";
import HauntedGhost from "./pages/Halloween2026/HauntedGhost";
import IntroduceHLW26 from "./pages/Halloween2026/IntroduceHLW26";
import TicketDetail from "./pages/Ticket/TicketDetail";
import Cart from "./pages/Ticket/Cart";
import Checkout from "./pages/Ticket/Checkout";
import QRPayment from "./pages/Ticket/QRPayment";
import CompletePayment from "./pages/Ticket/CompletePayment";
import StaffTicketTypeList from "./pages/Staff/StaffTicketTypeList";
import StaffTicketTypeDetail from "./pages/Staff/StaffTicketTypeDetail";
import ManageHeader from "./components/ManageHeader";
import AdminContactList from "./pages/Admin/AdminContactList";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminListUser from "./pages/Admin/AdminListUser";
import AdminOrderList from "./pages/Admin/AdminOrderList";
import HotNews from "./pages/Admin/HotNews";
import StaffCheckinTicket from "./pages/Staff/StaffCheckinTicket";
import StaffHomePage from "./pages/Staff/StaffDashboardPage";
import StaffUserTicket from "./pages/Staff/StaffUserTicket";
import PDP from "./pages/Halloween2026/PDP";
import ChatPage from "./pages/Chat/ChatPage";

// Layout component cho các trang có Header, Navbar và Footer
function Layout({ children }) {
  return (
    <>
      <Header />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function ManageLayout({ children, role = "staff", showFooter = true }) {
  return (
    <>
      <ManageHeader role={role} />
      {children}
      {showFooter && <Footer />}
    </>
  );
}

function ConditionalMessengerButton() {
  const { pathname } = useLocation();
  const isManagementPage = pathname.startsWith("/admin") || pathname.startsWith("/staff");

  return isManagementPage ? null : <MessengerButton />;
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

const ACCESS_RULES = [
  { pattern: /^\/admin(?:\/|$)/, roles: ["admin"] },
  { pattern: /^\/staff(?:\/|$)/, roles: ["staff"] },
  {
    pattern:
      /^\/(?:user-profile|change-password|cart|checkout|qr-payment|complete-payment|my-ticket)(?:\/|$)/,
    roles: null,
  },
  {
    pattern: /^\/tickets(?:\/|$)/,
    roles: null,
  },
];

const getRoleName = (user) =>
  user?.role?.roleName ||
  user?.roleName ||
  user?.role ||
  user?.roleId?.roleName ||
  user?.roleId;

const normalizeRole = (role) => String(role || "").trim().toLowerCase();

const readAuthSnapshot = () => {
  try {
    return {
      token: localStorage.getItem("accessToken"),
      user: JSON.parse(localStorage.getItem("user") || "null"),
    };
  } catch {
    return { token: null, user: null };
  }
};

const isRoleAllowed = (user, allowedRoles) => {
  const role = normalizeRole(getRoleName(user));
  if (role === "admin") return true;
  return allowedRoles.includes(role);
};

function FrontendAccessGuard({ children }) {
  const location = useLocation();
  const [authSnapshot, setAuthSnapshot] = React.useState(readAuthSnapshot);
  const accessRule = ACCESS_RULES.find(({ pattern }) =>
    pattern.test(location.pathname),
  );

  React.useEffect(() => {
    const syncAuthSnapshot = () => setAuthSnapshot(readAuthSnapshot());
    window.addEventListener("storage", syncAuthSnapshot);
    window.addEventListener("auth:login", syncAuthSnapshot);
    window.addEventListener("auth:logout", syncAuthSnapshot);
    return () => {
      window.removeEventListener("storage", syncAuthSnapshot);
      window.removeEventListener("auth:login", syncAuthSnapshot);
      window.removeEventListener("auth:logout", syncAuthSnapshot);
    };
  }, []);

  if (!accessRule) return children;

  const isAuthenticated = Boolean(authSnapshot.token && authSnapshot.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    accessRule.roles &&
    !isRoleAllowed(authSnapshot.user, accessRule.roles)
  ) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <FrontendAccessGuard>
        <Routes>
          {/* Authentication pages - không có Header, Navbar, Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/fbgc-login" element={<FBGCLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/complete-register" element={<CompleteRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/403" element={<ErrorPage403 />} />

        {/* Normal pages - có Header, Navbar, Footer */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfile />
            </Layout>
          }
        />
        {/* Vé */}
        <Route
          path="/tickets"
          element={
            <Layout>
              <ListTicketTypePage />
            </Layout>
          }
        />
        <Route
          path="/tickets/detail/:ticketTypeId"
          element={
            <Layout>
              <TicketDetail />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout>
              <Checkout />
            </Layout>
          }
        />
        <Route
          path="/qr-payment"
          element={
            <Layout>
              <QRPayment />
            </Layout>
          }
        />
        <Route
          path="/complete-payment"
          element={
            <Layout>
              <CompletePayment />
            </Layout>
          }
        />
        <Route
          path="/staff/ticket-types"
          element={
            <ManageLayout role="staff">
              <StaffTicketTypeList />
            </ManageLayout>
          }
        />
        <Route
          path="/staff/tickets"
          element={<Navigate to="/staff/ticket-types" replace />}
        />
        <Route
          path="/staff/ticket-types/:ticketTypeId"
          element={
            <ManageLayout role="staff">
              <StaffTicketTypeDetail />
            </ManageLayout>
          }
        />
        <Route
          path="/data-policy"
          element={
            <Layout>
              <DataPolicy />
            </Layout>
          }
        />
        <Route
          path="/terms-of-use"
          element={
            <Layout>
              <TermOfUse />
            </Layout>
          }
        />
        <Route
          path="/ticket-policy"
          element={
            <Layout>
              <TicketPolicy />
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout>
              <FAQ />
            </Layout>
          }
        />
        <Route
          path="/my-ticket"
          element={
            <Layout>
              <MyTicket />
            </Layout>
          }
        />
        <Route
          path="/staff"
          element={
            <ManageLayout role="staff">
              <StaffHomePage />
            </ManageLayout>
          }
        />
        <Route
          path="/staff/dashboard"
          element={
            <ManageLayout role="staff">
              <StaffHomePage />
            </ManageLayout>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ManageLayout role="admin">
              <AdminContactList />
            </ManageLayout>
          }
        />
        <Route
          path="/haunted-ghost"
          element={
            <Layout>
              <HauntedGhost />
            </Layout>
          }
        />
        <Route
          path="/introduce-hlw26"
          element={
            <Layout>
              <IntroduceHLW26 />
            </Layout>
          }
        />
        <Route
          path="/pdp"
          element={
            <Layout>
              <PDP />
            </Layout>
          }
        />
        <Route
          path="/admin/hot-news"
          element={
            <ManageLayout role="admin">
              <HotNews />
            </ManageLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <ManageLayout role="admin">
              <AdminDashboard />
            </ManageLayout>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ManageLayout role="admin">
              <AdminDashboard />
            </ManageLayout>
          }
        />
        <Route path="/admin/chat" element={<ManageLayout role="admin" showFooter={false}><ChatPage role="admin" /></ManageLayout>} />
        <Route path="/staff/chat" element={<ManageLayout role="staff" showFooter={false}><ChatPage role="staff" /></ManageLayout>} />
        <Route
          path="/admin/users"
          element={
            <ManageLayout role="admin">
              <AdminListUser />
            </ManageLayout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ManageLayout role="admin">
              <AdminOrderList />
            </ManageLayout>
          }
        />
        <Route
          path="/admin/check-in"
          element={
            <ManageLayout role="admin">
              <StaffCheckinTicket />
            </ManageLayout>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <ManageLayout role="admin">
              <StaffTicketTypeList />
            </ManageLayout>
          }
        />
        <Route
          path="/admin/ticket-types"
          element={
            <ManageLayout role="admin">
              <StaffTicketTypeList />
            </ManageLayout>
          }
        />
        <Route
          path="/admin/ticket-types/:ticketTypeId"
          element={
            <ManageLayout role="admin">
              <StaffTicketTypeDetail />
            </ManageLayout>
          }
        />
        <Route
          path="/staff/check-in"
          element={
            <ManageLayout role="staff">
              <StaffCheckinTicket />
            </ManageLayout>
          }
        />
        <Route
          path="/staff/purchased-tickets"
          element={
            <ManageLayout role="staff">
              <StaffUserTicket />
            </ManageLayout>
          }
        />
        <Route
          path="/admin/purchased-tickets"
          element={
            <ManageLayout role="admin">
              <StaffUserTicket />
            </ManageLayout>
          }
        />
        <Route
          path="/about-us"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/btc-fuhlw"
          element={
            <Layout>
              <BTCFUHLW />
            </Layout>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Layout>
              <ContactUs />
            </Layout>
          }
        />
        <Route
          path="/old-event"
          element={
            <Layout>
              <OldEvent />
            </Layout>
          }
        />
        <Route
          path="/event-page"
          element={
            <Layout>
              <IntroduceEvent />
            </Layout>
          }
        />
        <Route
          path="/fanpage"
          element={
            <Layout>
              <Fanpage />
            </Layout>
          }
        />
        <Route
          path="/overall"
          element={
            <Layout>
              <Overall />
            </Layout>
          }
        />
        <Route
          path="/agenda"
          element={
            <Layout>
              <Agenda />
            </Layout>
          }
        />
        <Route
          path="/news"
          element={
            <Layout>
              <News />
            </Layout>
          }
        />
        <Route
          path="/fbgc"
          element={
            <Layout>
              <FPTUBoardGameClub />
            </Layout>
          }
        />
          <Route path="*" element={<ErrorPage404 />} />
        </Routes>
      </FrontendAccessGuard>
      <ConditionalMessengerButton />
    </BrowserRouter>
  );
}
