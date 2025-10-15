"use client"

import { useState, useMemo } from "react"
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Avatar,
  Chip,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Tooltip,
} from "@mui/material"
import { Add as AddIcon, MoreVert as MoreVertIcon } from "@mui/icons-material"
import SearchIcon from "@mui/icons-material/Search"
import SortIcon from "@mui/icons-material/Sort"

const policies = [
  {
    id: 1,
    name: "Wellness Leave Requested",
    date: "21 Sep, 2024",
    status: "Sick Leave",
    statusColor: "#ef4444",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Vacation Wage Benefits",
    date: "17 Oct, 2024",
    status: "Holiday Pay",
    statusColor: "#10b981",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Vacation Pay Entitlements",
    date: "22 Oct, 2024",
    status: "Paid Time Off",
    statusColor: "#3b82f6",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Absent For Illness",
    date: "24 May, 2024",
    status: "Sick Leave",
    statusColor: "#ef4444",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Holiday Remuneration Rights",
    date: "24 May, 2024",
    status: "Holiday Pay",
    statusColor: "#10b981",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Time Off Benefits",
    date: "1 Feb, 2024",
    status: "Holiday Pay",
    statusColor: "#10b981",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Health Issues Leave",
    date: "8 Sep, 2024",
    status: "Sick Leave",
    statusColor: "#ef4444",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Paid Time Benefits",
    date: "1 Feb, 2024",
    status: "Holiday Pay",
    statusColor: "#10b981",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "Holiday Pay Basics",
    date: "1 Feb, 2024",
    status: "Paid Time Off",
    statusColor: "#3b82f6",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "Vacation Pay Basics",
    date: "17 Oct, 2024",
    status: "Holiday Pay",
    statusColor: "#10b981",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function StaffListUser() {
  const [activeTab, setActiveTab] = useState(1)
  const [query, setQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("desc") // 'desc' = newest first

  // memoize filtered + sorted list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = policies.filter((p) => p.name.toLowerCase().includes(q))
    list.sort((a, b) => {
      const ta = new Date(a.date).getTime() || 0
      const tb = new Date(b.date).getTime() || 0
      return sortOrder === "asc" ? ta - tb : tb - ta
    })
    return list
  }, [query, sortOrder])

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            Time tools
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Quản lý người dùng
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm theo tên người dùng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small">
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              startAdornment={<SortIcon fontSize="small" sx={{ mr: 1 }} />}
            >
              <MenuItem value="desc">Mới nhất</MenuItem>
              <MenuItem value="asc">Cũ nhất</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm người dùng
          </Button>
        </Stack>
      </Box>

      {/* Tabs (placeholder) */}

      {/* Policy / User List */}
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <Typography variant="h6" color="red" sx={{ fontWeight: 600 }}>
              Tên người dùng
            </Typography>
          </Box>

          <Box sx={{ width: 150, flexShrink: 0, textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Email
            </Typography>
          </Box>

          <Box sx={{ width: 150, flexShrink: 0, textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Số điện thoại
            </Typography>
          </Box>

          <Box sx={{ width: 200, flexShrink: 0, textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Ngày tạo
            </Typography>
          </Box>

          <Box sx={{ width: 48, flexShrink: 0, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Actions
            </Typography>
          </Box>
        </Box>

        {filtered.map((policy, index) => (
          <Box
            key={policy.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2.5,
              borderBottom: index < filtered.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
              "&:hover": {
                bgcolor: "grey.50",
              },
            }}
          >
            {/* Avatar and Name */}
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <Avatar src={policy.avatar} sx={{ mr: 2, width: 40, height: 40 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {policy.name}
              </Typography>
            </Box>

            {/* Email (placeholder) */}
            <Box sx={{ width: 150, flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {policy.email || "user@example.com"}
              </Typography>
            </Box>

            {/* Phone (placeholder) */}
            <Box sx={{ width: 150, flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {policy.phone || "0123 456 789"}
              </Typography>
            </Box>

            {/* Created Date */}
            <Box sx={{ width: 200, flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {policy.date}
              </Typography>
            </Box>

            {/* Menu */}
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        ))}

        {filtered.length === 0 && (
          <Box sx={{ p: 4 }}>
            <Typography color="text.secondary">Không tìm thấy người dùng.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
