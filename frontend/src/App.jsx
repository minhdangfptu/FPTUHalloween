import * as React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { CssBaseline, CssVarsProvider, ThemeProvider } from "@mui/material";
import theme from "./theme";
import HomePage from "./pages/Normal/HomePage";
import ErrorPage404 from "./pages/Errors/ErrorPage404";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import ConfirmEmail from "./pages/Authentication/ConfirmEmail";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import AboutUs from "./pages/Normal/AboutUs";
import ContactUs from "./pages/Normal/ContactUsPage";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CompleteRegister from "./pages/Authentication/CompleteRegister";
import OldEvent from "./pages/Introduce/OldEvent";
import IntroduceEvent from "./pages/Introduce/IntroduceEvent";
import Fanpage from "./pages/Introduce/Fanpage";
import Overall from "./pages/Halloween2025/Overall";
import Agenda from "./pages/Halloween2025/Agenda";
import News from "./pages/Halloween2025/News";
import FPTUBoardGameClub from "./pages/FPTUBoardGameClub";
import ChangePassword from "./pages/Authentication/ChangePassword";
import MessengerButton from "./components/MessengerButton";
import UserProfile from "./pages/Account/UserProfile";
import FBGCLogin from "./pages/Authentication/FBGCLogin";
import ListTicketTypePage from "./pages/Ticket/ListTicketTypePage";
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
import StaffCheckinTicket from "./pages/Staff/StaffCheckinTicket";
import StaffHomePage from "./pages/Staff/StaffHomePage";
import StaffUserTicket from "./pages/Staff/StaffUserTicket";

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

function ManageLayout({ children, role = "staff" }) {
  return (
    <>
      <ManageHeader role={role} />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    // <CssVarsProvider theme={theme}>
    //   <CssBaseline />
    <BrowserRouter>
      <Routes>
        {/* Authentication pages - không có Header, Navbar, Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/fbgc-login" element={<FBGCLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/complete-register" element={<CompleteRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="*" element={<ErrorPage404 />} />

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
        <Route path="/staff" element={<ManageLayout role="staff"><StaffHomePage /></ManageLayout>} />
        <Route path="/staff/dashboard" element={<ManageLayout role="staff"><StaffHomePage /></ManageLayout>} />
        <Route
          path="/admin/contacts"
          element={
            <ManageLayout role="admin">
              <AdminContactList />
            </ManageLayout>
          }
        />
        <Route path="/admin" element={<ManageLayout role="admin"><AdminDashboard /></ManageLayout>} />
        <Route path="/admin/dashboard" element={<ManageLayout role="admin"><AdminDashboard /></ManageLayout>} />
        <Route path="/admin/users" element={<ManageLayout role="admin"><AdminListUser /></ManageLayout>} />
        <Route path="/admin/orders" element={<ManageLayout role="admin"><AdminOrderList /></ManageLayout>} />
        <Route path="/admin/check-in" element={<ManageLayout role="admin"><StaffCheckinTicket /></ManageLayout>} />
        <Route path="/admin/tickets" element={<ManageLayout role="admin"><StaffTicketTypeList /></ManageLayout>} />
        <Route path="/admin/ticket-types" element={<ManageLayout role="admin"><StaffTicketTypeList /></ManageLayout>} />
        <Route path="/admin/ticket-types/:ticketTypeId" element={<ManageLayout role="admin"><StaffTicketTypeDetail /></ManageLayout>} />
        <Route path="/staff/check-in" element={<ManageLayout role="staff"><StaffCheckinTicket /></ManageLayout>} />
        <Route path="/staff/purchased-tickets" element={<ManageLayout role="staff"><StaffUserTicket /></ManageLayout>} />
        <Route path="/admin/purchased-tickets" element={<ManageLayout role="admin"><StaffUserTicket /></ManageLayout>} />
        <Route
          path="/about-us"
          element={
            <Layout>
              <AboutUs />
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
      </Routes>
      <MessengerButton />
    </BrowserRouter>
    // </CssVarsProvider>
  );
}
