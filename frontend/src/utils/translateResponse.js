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
import i18n from '../i18n';

// ============================================================
// BẢNG DỊCH ERROR MESSAGE — Tiếng Anh → Tiếng Việt
// Thêm key mới khi backend trả thêm message mới
// ============================================================
const ERROR_TRANSLATIONS = {
  // --- Authentication ---
  'No token provided. Authorization denied.': 'Vui lòng đăng nhập để tiếp tục.',
  'Missing Authorization header': 'Vui lòng đăng nhập để tiếp tục.',
  'Invalid token. Please login again.': 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
  'Token expired. Please login again.': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  'Invalid or expired token': 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
  'You do not have permission to perform this action.': 'Bạn không có quyền thực hiện hành động này.',
  Forbidden: 'Bạn không có quyền thực hiện hành động này.',

  // --- Validation ---
  'Validation failed': 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  'Invalid email address': 'Email không hợp lệ.',
  'Email already exists': 'Email đã được sử dụng. Vui lòng sử dụng email khác.',
  'Username, email or phone already exists': 'Tên đăng nhập, email hoặc số điện thoại đã tồn tại.',
  'Password must be at least 8 characters': 'Mật khẩu phải có ít nhất 8 ký tự.',
  'Password must contain at least 1 uppercase letter': 'Mật khẩu phải chứa ít nhất 1 chữ hoa.',
  'Password must contain at least 1 number': 'Mật khẩu phải chứa ít nhất 1 số.',
  'Full name must be between 2 and 100 characters': 'Họ tên phải từ 2 đến 100 ký tự.',

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
  'Identifier and password are required': 'Vui lòng nhập tên đăng nhập và mật khẩu.',
  'Google Login is not ready. Please try again in a few seconds.': 'Google chưa sẵn sàng. Vui lòng thử lại sau ít giây.',
  'Unable to login with Google.': 'Không thể đăng nhập với Google.',
  'An email account already exists with this email': 'Email này đã được đăng ký bằng tài khoản email. Vui lòng đăng nhập bằng email và mật khẩu. Nếu bạn là FBGCer, hãy đăng nhập với FBGC',
  'Current password is incorrect': 'Mật khẩu hiện tại không đúng.',
  'Google accounts cannot change password here': 'Tài khoản Google không thể đổi mật khẩu tại đây.',
  'Google credential is required': 'Vui lòng xác thực tài khoản Google.',
  'Invalid Google credential': 'Thông tin xác thực Google không hợp lệ.',
  'Google email is not verified': 'Email Google chưa được xác minh.',
  'Invalid Google profile': 'Thông tin hồ sơ Google không hợp lệ.',
  'Google login is not configured': 'Đăng nhập Google chưa được cấu hình.',
  'Missing vote session token': 'Phiên bình chọn không tồn tại. Vui lòng xác thực lại Google.',
  'Invalid vote session token': 'Phiên bình chọn không hợp lệ.',
  'Invalid or expired vote session': 'Phiên bình chọn đã hết hạn. Vui lòng xác thực lại Google.',
  'No token provided': 'Vui lòng đăng nhập để tiếp tục.',
  'Invalid or expired OTP': 'Mã OTP không hợp lệ hoặc đã hết hạn.',
  'A valid email is required': 'Vui lòng nhập email hợp lệ.',
  'Email or phone already exists': 'Email hoặc số điện thoại đã tồn tại.',
  'Contact not found': 'Không tìm thấy liên hệ.',
  'Invalid contact ID': 'Mã liên hệ không hợp lệ.',
  'isContactted must be a boolean': 'Trạng thái liên hệ không hợp lệ.',
  'Hot news not found': 'Không tìm thấy thông báo.',
  'Invalid hot news ID': 'Mã thông báo không hợp lệ.',
  'Hot news content is required': 'Nội dung thông báo không được để trống.',
  'Hot news content must be at most 500 characters': 'Nội dung thông báo tối đa 500 ký tự.',
  'Hot news link is invalid': 'Liên kết thông báo không hợp lệ.',
  'Hot news link must use http or https': 'Liên kết chỉ được sử dụng http hoặc https.',
  'Hot news link must be at most 2048 characters': 'Liên kết thông báo tối đa 2048 ký tự.',
  'At least one hot news field is required': 'Vui lòng nhập ít nhất một trường thông báo.',
  'isActive must be a boolean': 'Trạng thái thông báo không hợp lệ.',
  'Network error. Please check your connection.': 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.',
  'Cart not found': 'Không tìm thấy giỏ hàng.',
  'Cart item not found': 'Không tìm thấy vé trong giỏ hàng.',
  'Ticket type not found': 'Không tìm thấy loại vé.',
  'Invalid ticket type ID': 'Mã loại vé không hợp lệ.',
  'Ticket price must be a non-negative number': 'Giá vé phải là số không âm.',
  'Total quantity must be a non-negative integer': 'Tổng số lượng phải là số nguyên không âm.',
  'Ticket date must be between 1 and 31': 'Ngày vé phải nằm trong khoảng từ 1 đến 31.',
  'Ticket time must use HH:mm format': 'Khung giờ phải có định dạng HH:mm.',
  'Ticket status must be active or inactive': 'Trạng thái vé không hợp lệ.',
  'Ticket type is not available': 'Loại vé hiện không mở bán.',
  'Quantity must be a positive integer': 'Số lượng phải là số nguyên dương.',
  'Requested quantity exceeds available tickets': 'Số lượng yêu cầu vượt quá số vé còn lại.',
  'Ticket availability is not configured': 'Số lượng vé hiện chưa được cấu hình.',
  'Cart is empty': 'Giỏ hàng đang trống.',
  'Some tickets are no longer available': 'Một số vé không còn đủ số lượng.',
  'Order not found': 'Không tìm thấy đơn hàng.',
  'Invalid ticket ID': 'Mã vé không hợp lệ.',
  'Invalid ticket date': 'Ngày vé không hợp lệ.',
  'Invalid ticket QR code': 'Mã QR vé không hợp lệ.',
  'Ticket not found': 'Không tìm thấy vé.',
  'Ticket is not available for the current staff date': 'Vé không thuộc ngày check-in hiện tại.',
  'Ticket has already been checked in': 'Vé này đã được check-in trước đó.',
  'Ticket can only be checked in on its ticket date': 'Vé chỉ được check-in đúng ngày ghi trên vé.',

  // --- CRUD ---
  'Created successfully': 'Tạo thành công.',
  'Updated successfully': 'Cập nhật thành công.',
  'User disabled successfully': 'Vô hiệu hóa tài khoản thành công.',
  'User enabled successfully': 'Gỡ vô hiệu hóa tài khoản thành công.',
  'Deleted successfully': 'Xóa thành công.',
  'Operation successful': 'Thao tác thành công.',
  'D-Day vote configuration not found': 'Chưa có cấu hình bình chọn D-Day.',
  'Vote campaign can only be edited while it is in draft': 'Chỉ có thể chỉnh sửa campaign khi đang ở bản nháp.',
  'At least one vote category is required': 'Cần có ít nhất một hạng mục bình chọn.',
  'Vote campaign title is required': 'Tiêu đề campaign bình chọn không được để trống.',
  'Vote category 1 must have at least two options': 'Mỗi hạng mục cần ít nhất hai lựa chọn.',
  'Close time must be later than the current time': 'Thời gian đóng phải sau thời điểm hiện tại.',
  'Close time is required before opening the vote': 'Cần cấu hình thời gian đóng trước khi mở bình chọn.',
  'A closed vote campaign cannot be reopened': 'Campaign đã đóng không thể mở lại.',
  'Vote campaign is already open': 'Bình chọn hiện đang mở.',
  'Vote campaign status has changed; please refresh and try again': 'Trạng thái bình chọn vừa thay đổi. Vui lòng tải lại trang và thử lại.',
  'Close time is required': 'Vui lòng chọn thời điểm đóng bình chọn.',
  'Close time can only be changed while the vote is open': 'Chỉ có thể đổi thời điểm đóng khi bình chọn đang mở.',
  'Vote campaign must be open before it can be closed': 'Campaign phải được mở trước khi đóng.',
  'Vote campaign is no longer in draft': 'Campaign không còn ở trạng thái bản nháp.',
  'D-Day vote is not open': 'Bình chọn D-Day hiện chưa mở.',
  'D-Day vote is not open yet': 'Bình chọn D-Day chưa đến thời gian mở.',
  'Exactly one option is required for each vote category': 'Vui lòng chọn đúng một lựa chọn cho mỗi hạng mục.',
  'Vote choices contain a missing or duplicate category': 'Lựa chọn bình chọn bị thiếu hoặc trùng hạng mục.',
  'Submission ID must be a valid UUID': 'Mã gửi bình chọn không hợp lệ.',
  'You have already submitted a different ballot': 'Bạn đã gửi một lá phiếu khác trước đó.',
  'Submission ID has already been used': 'Mã gửi bình chọn đã được sử dụng.',
  'The vote could not be recorded because it conflicts with another submission': 'Không thể ghi nhận vì lá phiếu bị trùng với một lượt gửi khác.',
  'Vote results are not available until the vote is closed': 'Kết quả chỉ được công bố sau khi bình chọn đóng.',
  'Published feedback form not found': 'Không tìm thấy biểu mẫu phản hồi đang mở.',
  'This feedback form is not available for your role': 'Biểu mẫu phản hồi này không dành cho vai trò của bạn.',
  'You have already submitted this feedback form': 'Bạn đã gửi biểu mẫu phản hồi này rồi.',
  'Feedback form not found': 'Không tìm thấy biểu mẫu phản hồi.',
  'Invalid feedback form ID': 'Mã biểu mẫu phản hồi không hợp lệ.',
  'At least one question is required': 'Biểu mẫu cần có ít nhất một câu hỏi.',
  'Close time must be later than open time': 'Thời gian đóng phải sau thời gian mở.',

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

const ERROR_TRANSLATIONS_EN = Object.fromEntries(
  Object.keys(ERROR_TRANSLATIONS).map((message) => [message, message]),
);

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

const translateVoteError = (message) => {
  if (/^Vote category \d+ must have at least two options$/.test(message)) {
    return 'Mỗi hạng mục cần ít nhất hai lựa chọn.';
  }
  if (/^Vote category \d+ is invalid$/.test(message) || /^Vote option \d+ is invalid$/.test(message)) {
    return 'Thông tin hạng mục hoặc lựa chọn chưa hợp lệ.';
  }
  if (message.startsWith('Duplicate vote category:') || message.startsWith('Duplicate vote option:')) {
    return 'Không được trùng mã hạng mục hoặc mã lựa chọn.';
  }
  if (message.startsWith('Missing vote choice for category:')) {
    return 'Vui lòng chọn một lựa chọn cho từng hạng mục.';
  }
  if (message.startsWith('Invalid option for category:')) {
    return 'Lựa chọn không thuộc hạng mục tương ứng.';
  }
  return null;
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
  const translations = i18n.language?.startsWith('en')
    ? ERROR_TRANSLATIONS_EN
    : ERROR_TRANSLATIONS;
  return translations[rawMessage] || translateVoteError(rawMessage) || rawMessage;
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
  const translations = i18n.language?.startsWith('en')
    ? SUCCESS_TRANSLATIONS_EN
    : SUCCESS_TRANSLATIONS;
  return translations[message] || message;
};

const SUCCESS_TRANSLATIONS = {
  'Register successfully. Please confirm OTP.': 'Đăng ký thành công. Vui lòng xác thực OTP.',
  'Reset password OTP sent successfully': 'Mã OTP đặt lại mật khẩu đã được gửi.',
  'Password reset successfully': 'Đặt lại mật khẩu thành công.',
  'Contact sent successfully': 'Gửi thông tin thành công.',
  'Contact status updated successfully': 'Cập nhật trạng thái liên hệ thành công.',
  'Hot news created successfully': 'Thêm thông báo thành công.',
  'Hot news updated successfully': 'Cập nhật thông báo thành công.',
  'Hot news status updated successfully': 'Cập nhật trạng thái thông báo thành công.',
  'Hot news deleted successfully': 'Xóa thông báo thành công.',
  'Ticket type created successfully': 'Tạo loại vé thành công.',
  'Ticket type updated successfully': 'Cập nhật loại vé thành công.',
  'Ticket type status updated successfully': 'Cập nhật trạng thái loại vé thành công.',
  'User disabled successfully': 'Vô hiệu hóa tài khoản thành công.',
  'User enabled successfully': 'Gỡ vô hiệu hóa tài khoản thành công.',
  'Created successfully': 'Tạo thành công.',
  'Updated successfully': 'Cập nhật thành công.',
  'Deleted successfully': 'Xóa thành công.',
  'Operation successful': 'Thao tác thành công.',
  'Feedback submitted successfully': 'Gửi phản hồi thành công.',
  'Feedback form created successfully': 'Tạo biểu mẫu phản hồi thành công.',
  'Feedback form updated successfully': 'Cập nhật biểu mẫu phản hồi thành công.',
  'Feedback form deleted successfully': 'Xóa biểu mẫu phản hồi thành công.',
  'Vote session created successfully': 'Xác thực Google thành công.',
  'Vote recorded successfully': 'Ghi nhận bình chọn thành công.',
  'Vote receipt returned successfully': 'Đã trả lại xác nhận bình chọn trước đó.',
  'Vote campaign updated successfully': 'Cập nhật campaign bình chọn thành công.',
  'Vote campaign opened successfully': 'Mở campaign bình chọn thành công.',
  'Vote close time updated successfully': 'Cập nhật thời điểm đóng thành công.',
  'Vote campaign closed successfully': 'Đóng campaign bình chọn thành công.',
  'Registration successful': 'Đăng ký thành công.',
  'Registration cancelled': 'Hủy đăng ký thành công.',
  'Login successful': 'Đăng nhập thành công.',
  'Logout successful': 'Đăng xuất thành công.',
  'Password changed successfully': 'Đổi mật khẩu thành công.',
  'Email sent successfully': 'Đã gửi email thành công.',
  'Item added to cart successfully': 'Thêm vé vào giỏ hàng thành công.',
  'Cart item updated successfully': 'Cập nhật số lượng vé thành công.',
  'Item removed from cart successfully': 'Xóa vé khỏi giỏ hàng thành công.',
};

const SUCCESS_TRANSLATIONS_EN = Object.fromEntries(
  Object.keys(SUCCESS_TRANSLATIONS).map((message) => [message, message]),
);

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
    message: (i18n.language?.startsWith('en')
      ? ERROR_TRANSLATIONS_EN[err.message]
      : ERROR_TRANSLATIONS[err.message]) || err.message,
  }));
};

export {
  translateError,
  translateSuccess,
  translateValidationErrors,
  getErrorMessage,
  ERROR_TRANSLATIONS,
  ERROR_TRANSLATIONS_EN,
  SUCCESS_TRANSLATIONS,
  SUCCESS_TRANSLATIONS_EN,
};
