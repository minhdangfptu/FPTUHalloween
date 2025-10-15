import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import TicketGhost from "./pages/Ticket/TicketGhost";
import TicketGame from "./pages/Ticket/TicketGame";
import FPTUBoardGameClub from "./pages/FPTUBoardGameClub";
import StaffHomePage from "./pages/Staff/StaffHomePage";
import StaffEventDetail from "./components/StaffEventDetail";

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

export default function App() {
  return (
    // <CssVarsProvider theme={theme}>
    //   <CssBaseline />
    <BrowserRouter>
      <Routes>
        {/* Authentication pages - không có Header, Navbar, Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/complete-register" element={<CompleteRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<ErrorPage404 />} />
        <Route path="/staff" element={<StaffHomePage />} />
        <Route path="/staff-event-detail/:id" element={<StaffEventDetail />} />

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
          path="/ticket-ghost"
          element={
            <Layout>
              <TicketGhost />
            </Layout>
          }
        />
        <Route
          path="/ticket-game"
          element={
            <Layout>
              <TicketGame />
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
    </BrowserRouter>
    // </CssVarsProvider>
  );
}
