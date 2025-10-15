"use client"
import React from "react"
import {
  Box,
  Grid,
  Stack,
  Typography,
  Chip,
  Button,
  Divider,
} from "@mui/material"

export default function StaffEventDetail({
  event = {},
  loading = false,
  error = null,
  onEdit = () => {},
  onDelete = () => {},
}) {
  if (loading)
    return (
      <Box p={4}>
        <Typography>Đang tải...</Typography>
      </Box>
    )

  if (error)
    return (
      <Box p={4}>
        <Typography color="error">Lỗi: {String(error)}</Typography>
      </Box>
    )

  const {
    user_email,
    event_name,
    event_year,
    event_description,
    event_concept,
    event_start_time,
    event_end_time,
    event_location,
    event_status,
    event_image_url,
  } = event || {}

  const formatDate = (iso) => {
    if (!iso) return "—"
    try {
      const d = new Date(iso)
      return d.toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })
    } catch {
      return String(iso)
    }
  }

  const statusMap = {
    0: { label: "Nháp", color: "default" },
    1: { label: "Đang mở", color: "success" },
    2: { label: "Đã đóng", color: "warning" },
    3: { label: "Đã kết thúc", color: "default" },
  }
  const statusInfo = statusMap[event_status] || { label: String(event_status ?? "Không rõ"), color: "default" }

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ width: "100%", borderRadius: 2, overflow: "hidden", bgcolor: "grey.100" }}>
            {event_image_url ? (
              // simple img fallback; replace with MUI Image component if preferred
              <img src={event_image_url} alt={event_name || "event"} style={{ width: "100%", display: "block" }} />
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="subtitle1" color="text.secondary">
                  No image
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {event_name || "Untitled Event"}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Năm: {event_year ?? "—"} — Người tạo: {user_email ?? "—"}
                </Typography>
              </Box>

              <Chip label={statusInfo.label} color={statusInfo.color} />
            </Stack>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Khái niệm
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {event_concept ?? "—"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Mô tả
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {event_description ?? "—"}
              </Typography>
            </Box>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Thời gian bắt đầu
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(event_start_time)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Thời gian kết thúc
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(event_end_time)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Địa điểm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event_location ?? "—"}
                </Typography>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
              <Button variant="outlined" color="inherit" onClick={() => onEdit(event)}>
                Sửa
              </Button>
              <Button variant="contained" color="error" onClick={() => onDelete(event)}>
                Xóa
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}