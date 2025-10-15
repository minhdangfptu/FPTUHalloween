import React from "react"
import {
  Box,
  Grid,
  Stack,
  Typography,
  Chip,
  Button,
  Divider,
  Link,
} from "@mui/material"
import { Launch as LaunchIcon } from "@mui/icons-material"

export default function StaffNewDetail({
  news = {},
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
    halloween_id,
    news_title,
    news_image_url,
    news_type = [],
    news_date,
    news_url,
  } = news || {}

  const formatDate = (iso) => {
    if (!iso) return "—"
    try {
      const d = new Date(iso)
      return d.toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })
    } catch {
      return String(iso)
    }
  }

  const typeLabels = {
    announcement: "Thông báo",
    concept: "Concept",
    news: "Tin tức"
  }

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ width: "100%", borderRadius: 2, overflow: "hidden", bgcolor: "grey.100" }}>
            {news_image_url ? (
              <img 
                src={news_image_url} 
                alt={news_title || "news"} 
                style={{ width: "100%", display: "block" }} 
              />
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
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {news_title || "Untitled News"}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  ID: {halloween_id || "—"}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {Array.isArray(news_type) && news_type.map((type) => (
                  <Chip 
                    key={type} 
                    label={typeLabels[type] || type} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Stack>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Ngày đăng
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {formatDate(news_date)}
              </Typography>
            </Box>

            {news_url && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Link bài viết
                </Typography>
                <Link 
                  href={news_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <Typography variant="body1">{news_url}</Typography>
                  <LaunchIcon fontSize="small" />
                </Link>
              </Box>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
              <Button variant="outlined" color="inherit" onClick={() => onEdit(news)}>
                Sửa
              </Button>
              <Button variant="contained" color="error" onClick={() => onDelete(news)}>
                Xóa
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}