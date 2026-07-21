/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V4 */
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Check,
  Edit3,
  Info,
  Package,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import authAPI from "../../apis/authAPI";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import avatar from "../../assets/avatar.jpg";
import "./UserProfile.scss";

const EMPTY_PROFILE = {
  email: "",
  phone: "",
  fullName: "",
  department: "",
  department_position: "",
  authProvider: "local",
  roleId: "",
  isVerified: false,
  isDisabled: false,
  createdAt: "",
  updatedAt: "",
};
const getProfileData = (response) => {
  const data = response?.data || response?.user || response || EMPTY_PROFILE;
  const role = data.roleId ?? data.role_id ?? "";
  return {
    ...data,
    fullName: data.fullName ?? data.full_name ?? "",
    phone: data.phone ?? data.phone_number ?? "",
    roleId: typeof role === "object" ? (role.roleName ?? role._id ?? "") : role,
    createdAt: data.createdAt ?? data.created_at ?? "",
    updatedAt: data.updatedAt ?? data.update_at ?? "",
  };
};
const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "Chưa cập nhật";

export default function UserProfile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = getProfileData(await authAPI.getMe());
        setProfile({ ...EMPTY_PROFILE, ...data });
        setDraft({ ...EMPTY_PROFILE, ...data });
      } catch (error) {
        toast.error(translateError(error), { id: loadingToast });
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = ({ target }) =>
    setDraft((current) => ({ ...current, [target.name]: target.value }));
  const handleSave = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading("Đang cập nhật thông tin...");
    try {
      const data = getProfileData(
        await authAPI.updateMe({
          full_name: draft.fullName,
          phone_number: draft.phone,
        }),
      );
      const updated = { ...profile, ...draft, ...data };
      setProfile(updated);
      setDraft(updated);
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success(translateSuccess("Updated successfully"), {
        id: loadingToast,
      });
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    }
  };
  const cancelEdit = () => {
    setDraft(profile);
    setIsEditing(false);
  };
  const displayName = profile.fullName || "Người dùng FPTU";
  const value = (field) => profile[field] || "Chưa cập nhật";
  const authProviderLabel = profile.authProvider === "google" ? "Tài khoản Google" : profile.authProvider === "local" ? "Tài khoản Email" : "Chưa cập nhật";
  const details = [
    ["fullName", "Họ và tên"],
    ["email", "Email"],
    ["phone", "Số điện thoại"],
    ["createdAt", "Ngày tham gia"],
    ["department", "Ban Sự kiện"],
    ["department_position", "Chức vụ"],
    ["authProvider", "Phương thức đăng nhập"],
  ];

  return (
    <main className="user-profile-page">
      <Toaster position="top-center" />
      <div className="profile-toolbar">
        <div className="profile-tab">
          <UserRound size={18} /> Chi tiết Người dùng
        </div>
        <div className="profile-toolbar-actions">
          <button
            type="button"
            className="profile-button profile-button--edit"
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? <X size={17} /> : <Edit3 size={17} />}
            {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
          </button>
          <button
            type="button"
            className="profile-button profile-button--delete"
            onClick={() => toast.error("Xóa tài khoản chưa được hỗ trợ.")}
          >
            <Trash2 size={17} /> Xóa tài khoản
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="profile-loading">
          <span />
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <section className="profile-overview">
            <aside className="profile-card profile-summary">
              <div className="profile-avatar">
                <img src={avatar} alt={displayName} />
              </div>
              <h1>{displayName}</h1>
              <p className="profile-email">{value("email")}</p>
              <div className="profile-badges">
                <span className="profile-badge profile-badge--active">
                  <i />{" "}
                  {profile.isDisabled ? "Đã vô hiệu hóa" : "Đang hoạt động"}
                </span>
                <span className="profile-badge profile-badge--role">
                  <Info size={15} /> {value("roleId")}
                </span>
              </div>
              <div className="profile-summary-meta">
                <div>
                  <span>Số điện thoại</span>
                  <strong>{value("phone")}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong className="muted">{value("email")}</strong>
                </div>
              </div>
            </aside>
            <section className="profile-card profile-details">
              <div className="section-title">
                <Info size={23} />
                <h2>Thông tin chi tiết</h2>
              </div>
              <form id="profile-form" onSubmit={handleSave}>
                <div className="details-grid">
                  {details.map(([field, label]) => (
                    <div className="detail-item" key={field}>
                      <span>{label}</span>
                      {isEditing && ["fullName", "phone"].includes(field) ? (
                        <input
                          name={field}
                          value={draft[field] || ""}
                          onChange={handleChange}
                        />
                      ) : (
                        <strong>
                          {field === "createdAt"
                            ? formatDate(profile[field])
                            : field === "authProvider"
                              ? authProviderLabel
                              : value(field)}
                        </strong>
                      )}
                    </div>
                  ))}
                  <div className="detail-item">
                    <span>Trạng thái xác minh</span>
                    <strong className="verified">
                      {profile.isVerified ? (
                        <>
                          <Check size={16} /> Đã xác minh
                        </>
                      ) : (
                        "Chưa xác minh"
                      )}
                    </strong>
                  </div>
                </div>
                {isEditing && (
                  <button
                    className="profile-button profile-button--save"
                    type="submit"
                  >
                    <Save size={17} /> Lưu thay đổi
                  </button>
                )}
              </form>
            </section>
          </section>
          <section className="profile-card orders-card">
            <header className="orders-heading">
              <div className="orders-icon">
                <Package size={22} />
              </div>
              <div>
                <h2>Đơn hàng của bạn</h2>
                <p>Theo dõi và xem lại các đơn hàng đã đặt.</p>
              </div>
            </header>
            <div className="orders-table">
              <div className="orders-row orders-row--header">
                <span>Mã đơn</span>
                <span>Ngày đặt</span>
                <span>Sản phẩm</span>
                <span>Tổng tiền</span>
                <span>Trạng thái</span>
                <span>Thao tác</span>
              </div>
              <div className="orders-empty">Bạn chưa có đơn hàng nào.</div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
