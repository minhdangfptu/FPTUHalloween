import React from "react";
import { AtSign, Building2, BriefcaseBusiness, CheckCircle2, Mail, Phone, ShieldCheck, UserRound, X } from "lucide-react";

const AdminUserDetail = ({ user, onClose, onToggleStatus, formatDate }) => {
  if (!user) return null;

  const roleName = user.roleId?.roleName || "Chưa xác định";

  return (
    <div className="admin-user-detail__overlay" role="presentation" onMouseDown={onClose}>
      <section className="admin-user-detail" role="dialog" aria-modal="true" aria-labelledby="admin-user-detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="admin-user-detail__header">
          <div><p><ShieldCheck size={16} /> Hồ sơ người dùng</p><h2 id="admin-user-detail-title">{user.fullName || "Chưa cập nhật"}</h2></div>
          <button type="button" onClick={onClose} aria-label="Đóng"><X size={20} /></button>
        </header>
        <div className="admin-user-detail__status"><span className={`admin-user-status ${user.isDisabled ? "is-disabled" : "is-active"}`}>{user.isDisabled ? "Đã vô hiệu hóa" : "Đang hoạt động"}</span><span className="admin-user-role">{roleName}</span></div>
        <div className="admin-user-detail__grid">
          <div><UserRound size={17} /><span><small>Họ và tên</small><strong>{user.fullName || "Chưa cập nhật"}</strong></span></div>
          <div><AtSign size={17} /><span><small>Tên người dùng</small><strong>{user.userName || "Chưa cập nhật"}</strong></span></div>
          <div><Mail size={17} /><span><small>Email</small><strong>{user.email || "Chưa cập nhật"}</strong></span></div>
          <div><Phone size={17} /><span><small>Số điện thoại</small><strong>{user.phone || "Chưa cập nhật"}</strong></span></div>
          <div><ShieldCheck size={17} /><span><small>Phương thức đăng nhập</small><strong>{user.authProvider || "Chưa cập nhật"}</strong></span></div>
          <div><Building2 size={17} /><span><small>Phòng ban</small><strong>{user.department || "Chưa cập nhật"}</strong></span></div>
          <div><BriefcaseBusiness size={17} /><span><small>Vị trí</small><strong>{user.department_position || "Chưa cập nhật"}</strong></span></div>
          <div><CheckCircle2 size={17} /><span><small>Email</small><strong>{user.isVerified ? "Đã xác thực" : "Chưa xác thực"}</strong></span></div>
          <div><span><small>Ngày tạo</small><strong>{formatDate(user.createdAt)}</strong></span></div>
        </div>
        <footer className="admin-user-detail__footer"><span>Cập nhật: {formatDate(user.updatedAt)}</span><button className={`admin-user-detail__disable ${user.isDisabled ? "is-enable" : ""}`} type="button" onClick={() => onToggleStatus(user)}>{user.isDisabled ? "Gỡ vô hiệu hóa" : "Vô hiệu hóa tài khoản"}</button></footer>
      </section>
    </div>
  );
};

export default AdminUserDetail;
