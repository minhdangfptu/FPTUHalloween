import React, { useState } from "react"
import {
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import viLocale from "date-fns/locale/vi"

export default function StaffAddNew({ onSubmit = () => {}, onCancel = () => {} }) {
  const [formData, setFormData] = useState({
    news_title: "",
    news_image_url: "",
    news_type: ["announcement", "concept"], // Default types
    news_date: null,
    news_url: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleTypeChange = (event) => {
    const { value } = event.target
    setFormData((prev) => ({
      ...prev,
      news_type: typeof value === 'string' ? value.split(',') : value,
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.news_title?.trim()) {
      newErrors.news_title = "Vui lòng nhập tiêu đề"
    }
    if (!formData.news_date) {
      newErrors.news_date = "Vui lòng chọn ngày"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const newsTypes = [
    { value: "announcement", label: "Thông báo" },
    { value: "concept", label: "Concept" },
    { value: "news", label: "Tin tức" },
  ]

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <Box component={Paper} sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Thêm bài viết mới
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Tiêu đề"
              name="news_title"
              value={formData.news_title}
              onChange={handleChange}
              error={!!errors.news_title}
              helperText={errors.news_title}
              required
              fullWidth
            />

            <TextField
              label="URL Hình ảnh"
              name="news_image_url"
              value={formData.news_image_url}
              onChange={handleChange}
              fullWidth
              placeholder="https://example.com/image.jpg"
            />

            <FormControl fullWidth>
              <InputLabel>Loại bài viết</InputLabel>
              <Select
                multiple
                value={formData.news_type}
                onChange={handleTypeChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={newsTypes.find(t => t.value === value)?.label || value}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {newsTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DateTimePicker
              label="Ngày đăng"
              value={formData.news_date}
              onChange={(newValue) => {
                setFormData(prev => ({ ...prev, news_date: newValue }))
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.news_date,
                  helperText: errors.news_date,
                }
              }}
            />

            <TextField
              label="URL bài viết"
              name="news_url"
              value={formData.news_url}
              onChange={handleChange}
              fullWidth
              placeholder="https://www.facebook.com/fptu.halloween/posts/123456"
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" color="inherit" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Thêm bài viết
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </LocalizationProvider>
  )
}