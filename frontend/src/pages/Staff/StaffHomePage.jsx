"use client"

import { useState } from "react"
import { Box } from "@mui/material"
import StaffNavBar from "~/components/StaffNavBar"
import StaffListUser from "~/components/StaffListUser"
import StaffListEvent from "~/components/StaffListEvent"
import StaffListNew from "~/components/StaffListNew"

export default function AdminTimeToolsPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activePath, setActivePath] = useState("/admin") // default to Người dùng

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const renderContent = () => {
    switch (activePath) {
      case "/staff":
        return <StaffListUser />
      case "/staff/event":
        return <StaffListEvent />
      case "/staff/news":
        return <StaffListNew />
      default:
        return <StaffListUser />
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      <StaffNavBar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        activePath={activePath}
        onSelect={(path) => setActivePath(path)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: "calc(100% - 280px)" },
          bgcolor: "white",
          minHeight: "100vh",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  )
}
