"use client"

import { useState, useMemo } from "react"
import {
  Box,
  Typography,
  Button,
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
} from "@mui/material"
import { Add as AddIcon, MoreVert as MoreVertIcon } from "@mui/icons-material"
import SearchIcon from "@mui/icons-material/Search"
import SortIcon from "@mui/icons-material/Sort"

const events = [
  { id: 1, title: "Nhà Ma – Wishbound", date: "31 Oct, 2025", location: "Hội trường A", status: "Đang mở", statusColor: "#10b981", img: "/placeholder-event-1.svg" },
  { id: 2, title: "Main Stage", date: "30 Oct, 2025", location: "Sân khấu chính", status: "Sắp diễn ra", statusColor: "#f59e0b", img: "/placeholder-event-2.svg" },
  { id: 3, title: "Cosplay & Parade", date: "31 Oct, 2025", location: "Khu diễu hành", status: "Đã kết thúc", statusColor: "#6b7280", img: "/placeholder-event-3.svg" },
  { id: 4, title: "Big Game", date: "01 Nov, 2025", location: "Phòng chơi B", status: "Đang mở", statusColor: "#10b981", img: "/placeholder-event-4.svg" },
]

export default function StaffListEvent() {
  const [query, setQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("desc") // newest first

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = events.filter((e) => e.title.toLowerCase().includes(q))
    list.sort((a, b) => {
      const ta = new Date(a.date).getTime() || 0
      const tb = new Date(b.date).getTime() || 0
      return sortOrder === "asc" ? ta - tb : tb - ta
    })
    return list
  }, [query, sortOrder])

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            Event tools
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Quản lý sự kiện
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm theo tên sự kiện..."
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
            Thêm sự kiện
          </Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.default", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sự kiện
            </Typography>
          </Box>

          <Box sx={{ width: 180, flexShrink: 0, textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Ngày tổ chức
            </Typography>
          </Box>

          <Box sx={{ width: 180, flexShrink: 0, textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Địa điểm
            </Typography>
          </Box>

          <Box sx={{ width: 140, flexShrink: 0, textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Trạng thái
            </Typography>
          </Box>

          <Box sx={{ width: 48, flexShrink: 0, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Actions
            </Typography>
          </Box>
        </Box>

        {filtered.map((ev, idx) => (
          <Box key={ev.id} sx={{ display: "flex", alignItems: "center", p: 2.5, borderBottom: idx < filtered.length - 1 ? "1px solid" : "none", borderColor: "divider", "&:hover": { bgcolor: "grey.50" } }}>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <Avatar src={ev.img} sx={{ mr: 2, width: 48, height: 48 }} variant="rounded" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {ev.title}
              </Typography>
            </Box>

            <Box sx={{ width: 180, flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {ev.date}
              </Typography>
            </Box>

            <Box sx={{ width: 180, flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {ev.location}
              </Typography>
            </Box>

            <Box sx={{ width: 140, flexShrink: 0 }}>
              <Chip label={ev.status} size="small" sx={{ bgcolor: `${ev.statusColor}15`, color: ev.statusColor, fontWeight: 600 }} />
            </Box>

            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        ))}

        {filtered.length === 0 && (
          <Box sx={{ p: 4 }}>
            <Typography color="text.secondary">Không tìm thấy sự kiện.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}