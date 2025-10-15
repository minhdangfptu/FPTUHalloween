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
  Grid,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import viLocale from "date-fns/locale/vi"

export default function StaffAddEvent({ onSubmit = () => {}, onCancel = () => {} }) {
  const [formData, setFormData] = useState({
    event_name: "",
    event_year: new Date().getFullYear(),
    event_description: "",
    event_concept: "",
    event_start_time: null,
    event_end_time: null,
    event_location: "",
    event_status: 0,
    event_image_url: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleDateChange = (field) => (newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.event_name?.trim()) {
      newErrors.event_name = "Vui lòng nhập tên sự kiện"
    }
    if (!formData.event_year) {
      newErrors.event_year = "Vui lòng nhập năm"
    }
    if (!formData.event_location?.trim()) {
      newErrors.event_location = "Vui lòng nhập địa điểm"
    }
    if (!formData.event_start_time) {
      newErrors.event_start_time = "Vui lòng chọn thời gian bắt đầu"
    }
    if (!formData.event_end_time) {
      newErrors.event_end_time = "Vui lòng chọn thời gian kết thúc"
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <Box component={Paper} sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Thêm sự kiện mới
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Tên sự kiện"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              error={!!errors.event_name}
              helperText={errors.event_name}
              required
              fullWidth
            />

            <TextField
              label="Năm"
              name="event_year"
              type="number"
              value={formData.event_year}
              onChange={handleChange}
              error={!!errors.event_year}
              helperText={errors.event_year}
              required
              fullWidth
            />

            <TextField
              label="Khái niệm"
              name="event_concept"
              value={formData.event_concept}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />

            <TextField
              label="Mô tả"
              name="event_description"
              value={formData.event_description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Thời gian bắt đầu"
                  value={formData.event_start_time}
                  onChange={handleDateChange("event_start_time")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.event_start_time,
                      helperText: errors.event_start_time,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Thời gian kết thúc"
                  value={formData.event_end_time}
                  onChange={handleDateChange("event_end_time")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.event_end_time,
                      helperText: errors.event_end_time,
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Địa điểm"
              name="event_location"
              value={formData.event_location}
              onChange={handleChange}
              error={!!errors.event_location}
              helperText={errors.event_location}
              required
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="event_status"
                value={formData.event_status}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value={0}>Nháp</MenuItem>
                <MenuItem value={1}>Đang mở</MenuItem>
                <MenuItem value={2}>Đã đóng</MenuItem>
                <MenuItem value={3}>Đã kết thúc</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="URL Hình ảnh"
              name="event_image_url"
              value={formData.event_image_url}
              onChange={handleChange}
              fullWidth
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" color="inherit" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Thêm sự kiện
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </LocalizationProvider>
  )
}