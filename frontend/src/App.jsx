import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, CssVarsProvider, ThemeProvider } from "@mui/material";
import theme from "./theme";
import HomePage from "./pages/Normal/HomePage";
import ErrorPage404 from "./pages/Errors/ErrorPage404";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import AboutUs from "./pages/Normal/AboutUs";
import ContactUs from "./pages/Normal/ContactUsPage";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
      </Routes>
    </BrowserRouter>
    // </CssVarsProvider>
  );
}
