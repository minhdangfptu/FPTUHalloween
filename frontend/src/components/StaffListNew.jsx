"use client"

import { useState, useMemo } from "react"
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Chip,
} from "@mui/material"
import { Add as AddIcon, MoreVert as MoreVertIcon } from "@mui/icons-material"
import SearchIcon from "@mui/icons-material/Search"
import SortIcon from "@mui/icons-material/Sort"

const news = [
  { id: 1, title: "Công bố chương trình Main Stage", date: "10 Oct, 2025", author: "Ban Tổ Chức", status: "Đã đăng", statusColor: "#10b981", img: "/placeholder-news-1.svg" },
  { id: 2, title: "Hướng dẫn mua vé", date: "05 Oct, 2025", author: "Support", status: "Nháp", statusColor: "#f59e0b", img: "/placeholder-news-2.svg" },
  { id: 3, title: "Thông báo sự kiện cosplay", date: "20 Sep, 2025", author: "PR Team", status: "Đã đăng", statusColor: "#10b981", img: "/placeholder-news-3.svg" },
  { id: 4, title: "Lịch trình Big Game", date: "01 Nov, 2025", author: "Ban Tổ Chức", status: "Đã đăng", statusColor: "#10b981", img: "/placeholder-news-4.svg" },
]

export default function StaffListNew() {
  const [query, setQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("desc") // 'desc' = newest first

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = news.filter((n) => n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q))
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
            News tools
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Quản lý tin tức
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm theo tiêu đề hoặc tác giả..."
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
            <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} startAdornment={<SortIcon fontSize="small" sx={{ mr: 1 }} />}>
              <MenuItem value="desc">Mới nhất</MenuItem>
              <MenuItem value="asc">Cũ nhất</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm bài viết
          </Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.default", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tiêu đề
            </Typography>
          </Box>

          <Box sx={{ width: 180, flexShrink: 0, textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Ngày
            </Typography>
          </Box>

          <Box sx={{ width: 180, flexShrink: 0, textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Tác giả
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

        {filtered.map((n, idx) => (
          <Box
            key={n.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2.5,
              borderBottom: idx < filtered.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
              "&:hover": { bgcolor: "grey.50" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <Avatar src={n.img} sx={{ mr: 2, width: 48, height: 48 }} variant="rounded" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {n.title}
              </Typography>
            </Box>

            <Box sx={{ width: 180, flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {n.date}
              </Typography>
            </Box>

            <Box sx={{ width: 180, flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {n.author}
              </Typography>
            </Box>

            <Box sx={{ width: 140, flexShrink: 0 }}>
              <Chip label={n.status} size="small" sx={{ bgcolor: `${n.statusColor}15`, color: n.statusColor, fontWeight: 600 }} />
            </Box>

            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        ))}

        {filtered.length === 0 && (
          <Box sx={{ p: 4 }}>
            <Typography color="text.secondary">Không tìm thấy bài viết.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}