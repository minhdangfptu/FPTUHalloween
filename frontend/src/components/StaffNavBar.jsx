"use client"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  CardGiftcard as BenefitedIcon,
  TrendingUp as PerformanceIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Description as DocumentIcon,
  Settings as SettingsIcon,
  Help as SupportIcon,
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material"
// import { Link, useLocation } from "react-router-dom"

const drawerWidth = 280

const menuItems = [
  { text: "Người dùng", icon: <PeopleIcon />, path: "/staff" },
  { text: "Halloween", icon: <DashboardIcon />, path: "/staff/event" },
  { text: "Tin tức", icon: <ReceiptIcon />, path: "/staff/news" },
  
]


export default function StaffNavBar({ mobileOpen, handleDrawerToggle, activePath = "/admin", onSelect = () => {}, onLogout = () => {} }) {
   const pathname = activePath
   const theme = useTheme()
   const isMobile = useMediaQuery(theme.breakpoints.down("md"))
 
   const drawer = (
     <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: "linear-gradient(135deg, #ff0000ff 0%, #6a0000ff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          MĐ
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          STAFF MANAGE
        </Typography>
      </Box>

      {/* Main Menu */}
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  onSelect(item.path)
                  if (isMobile && typeof handleDrawerToggle === "function") handleDrawerToggle()
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  pl: 2,
                  borderLeft: isActive ? "3px solid #667eea" : "3px solid transparent",
                  bgcolor: isActive ? "rgba(102, 126, 234, 0.08)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(102, 126, 234, 0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? "#667eea" : "text.secondary" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#667eea" : "text.primary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Bottom Menu */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                try {
                  if (typeof onLogout === "function") onLogout()
                } finally {
                  if (isMobile && typeof handleDrawerToggle === "function") handleDrawerToggle()
                }
              }}
              sx={{
                borderRadius: 2,
                py: 1.25,
                pl: 2,
                "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Đăng xuất"
                primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}
