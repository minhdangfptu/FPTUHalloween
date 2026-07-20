/**
 * translateResponse.js
 * Dịch response message từ Backend (tiếng Anh) → tiếng Việt
 *
 * Backend trả về message hoàn toàn bằng tiếng Anh.
 * File này dùng để dịch sang tiếng Việt TRƯỚC KHI hiển thị cho user.
 *
 * @module utils/translateResponse
 */

import axios from 'axios';

// ============================================================
// BẢNG DỊCH ERROR MESSAGE — Tiếng Anh → Tiếng Việt
// Thêm key mới khi backend trả thêm message mới
// ============================================================
const ERROR_TRANSLATIONS = {
  // --- Authentication ---
  'No token provided. Authorization denied.': 'Vui lòng đăng nhập để tiếp tục.',
  'Invalid token. Please login again.': 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
  'Token expired. Please login again.': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  'You do not have permission to perform this action.': 'Bạn không có quyền thực hiện hành động này.',

  // --- Validation ---
  'Validation failed': 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  'Invalid email address': 'Email không hợp lệ.',
  'Email already exists': 'Email đã được sử dụng. Vui lòng sử dụng email khác.',
  'Password must be at least 8 characters': 'Mật khẩu phải có ít nhất 8 ký tự.',
  'Password must contain at least 1 uppercase letter': 'Mật khẩu phải chứa ít nhất 1 chữ hoa.',
  'Password must contain at least 1 number': 'Mật khẩu phải chứa ít nhất 1 số.',
  'Full name must be between 2 and 100 characters': 'Họ tên phải từ 2 đến 100 ký tự.',
  'Password must be at least 8 characters': 'Mật khẩu phải có ít nhất 8 ký tự.',

  // --- Resource ---
  'User not found': 'Không tìm thấy người dùng.',
  'Event not found': 'Không tìm thấy sự kiện.',
  'Resource not found': 'Không tìm thấy tài nguyên.',
  'Invalid user ID format': 'ID người dùng không hợp lệ.',
  'Invalid event ID format': 'ID sự kiện không hợp lệ.',
  'Invalid ID format': 'ID không hợp lệ.',

  // --- Auth Actions ---
  'Invalid email or password': 'Email hoặc mật khẩu không đúng.',
  'Account has been deactivated': 'Tài khoản đã bị vô hiệu hóa.',
  'Too many login attempts. Please try again after 15 minutes.': 'Đăng nhập thất bại quá nhiều lần. Vui lòng thử lại sau 15 phút.',
  'Too many requests. Please slow down.': 'Yêu cầu quá nhiều. Vui lòng chờ một lát.',

  'Invalid credentials': 'Email hoặc mật khẩu không đúng.',
  'Current password is incorrect': 'Mật khẩu hiện tại không đúng.',
  'Google accounts cannot change password here': 'Tài khoản Google không thể đổi mật khẩu tại đây.',
  'No token provided': 'Vui lòng đăng nhập để tiếp tục.',
  'Invalid or expired OTP': 'Mã OTP không hợp lệ hoặc đã hết hạn.',
  'A valid email is required': 'Vui lòng nhập email hợp lệ.',
  'Email or phone already exists': 'Email hoặc số điện thoại đã tồn tại.',
  'Network error. Please check your connection.': 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.',

  // --- CRUD ---
  'Created successfully': 'Tạo thành công.',
  'Updated successfully': 'Cập nhật thành công.',
  'Deleted successfully': 'Xóa thành công.',
  'Operation successful': 'Thao tác thành công.',

  // --- Event-specific ---
  'Event is fully booked': 'Sự kiện đã đầy chỗ.',
  'Event registration is closed': 'Đăng ký sự kiện đã đóng.',
  'You have already registered for this event': 'Bạn đã đăng ký sự kiện này rồi.',
  'Registration successful': 'Đăng ký thành công.',
  'Registration cancelled': 'Hủy đăng ký thành công.',

  // --- Server ---
  'Internal Server Error': 'Lỗi hệ thống. Vui lòng thử lại sau.',
  'Service Unavailable': 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
};

/**
 * Lấy message từ axios error object
 * @param {Error|axios.AxiosError} error
 * @returns {string} error message (tiếng Anh)
 */
const getErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    // Backend trả về error response
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // Backend trả về error array
    if (error.response?.data?.errors?.length > 0) {
      return error.response.data.errors[0].message;
    }
    // Network error (không có response)
    if (!error.response) {
      return 'Network error. Please check your connection.';
    }
    // HTTP error không có message
    if (error.response?.status === 500) {
      return 'Internal Server Error';
    }
  }
  // Fallback
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
};

/**
 * Dịch error message từ tiếng Anh → tiếng Việt
 * @param {Error|axios.AxiosError} error
 * @returns {string} message đã dịch sang tiếng Việt
 *
 * @example
 * try {
 *   await authApi.login(email, password);
 * } catch (error) {
 *   const message = translateError(error);
 *   alert(message); // Hiển thị tiếng Việt cho user
 * }
 */
const translateError = (error) => {
  const rawMessage = getErrorMessage(error);
  return ERROR_TRANSLATIONS[rawMessage] || rawMessage;
};

/**
 * Dịch success message từ tiếng Anh → tiếng Việt
 * @param {string} message
 * @returns {string} message đã dịch sang tiếng Việt
 *
 * @example
 * const message = translateSuccess('Created successfully');
 * toast.success(message); // "Tạo thành công."
 */
const translateSuccess = (message) => {
  return SUCCESS_TRANSLATIONS[message] || message;
};

const SUCCESS_TRANSLATIONS = {
  'Register successfully. Please confirm OTP.': 'Đăng ký thành công. Vui lòng xác thực OTP.',
  'Reset password OTP sent successfully': 'Mã OTP đặt lại mật khẩu đã được gửi.',
  'Password reset successfully': 'Đặt lại mật khẩu thành công.',
  'Contact sent successfully': 'Gửi thông tin thành công.',
  'Created successfully': 'Tạo thành công.',
  'Updated successfully': 'Cập nhật thành công.',
  'Deleted successfully': 'Xóa thành công.',
  'Operation successful': 'Thao tác thành công.',
  'Registration successful': 'Đăng ký thành công.',
  'Registration cancelled': 'Hủy đăng ký thành công.',
  'Login successful': 'Đăng nhập thành công.',
  'Logout successful': 'Đăng xuất thành công.',
  'Password changed successfully': 'Đổi mật khẩu thành công.',
  'Email sent successfully': 'Đã gửi email thành công.',
};

/**
 * Lấy danh sách tất cả các trường validation lỗi
 * @param {Error|axios.AxiosError} error
 * @returns {Array<{field: string, message: string}>} Mảng lỗi đã dịch
 *
 * @example
 * const errors = translateValidationErrors(error);
 * // [{ field: 'email', message: 'Email không hợp lệ.' }]
 */
const translateValidationErrors = (error) => {
  if (!axios.isAxiosError(error) || !error.response?.data?.errors) {
    return [];
  }

  return error.response.data.errors.map((err) => ({
    field: err.field,
    message: ERROR_TRANSLATIONS[err.message] || err.message,
  }));
};

export {
  translateError,
  translateSuccess,
  translateValidationErrors,
  getErrorMessage,
  ERROR_TRANSLATIONS,
  SUCCESS_TRANSLATIONS,
};
