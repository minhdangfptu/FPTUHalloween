import React from "react";
import ManagePlaceholder from "../../components/ManagePlaceholder";

const AdminDashboard = () => (
  <ManagePlaceholder
    role="admin"
    activeItem="dashboard"
    title="Tổng quan quản trị"
    description="Khu vực tổng hợp số liệu và hoạt động của hệ thống quản lý sự kiện."
  />
);

export default AdminDashboard;
