import React, { useCallback, useEffect, useState } from "react";
import {
  Check,
  Clock3,
  Mail,
  MessageSquareText,
  Phone,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "../../apis/axiosClient";
import ManageSidebar from "../../components/ManageSidebar";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import "./AdminContactList.scss";

const AdminContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [updatingContactId, setUpdatingContactId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [nameSearch, setNameSearch] = useState("");

  const loadContacts = useCallback(async (requestedPage = 1) => {
    const loadingToast = toast.loading("Đang tải danh sách liên hệ...");
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/contacts", {
        params: {
          page: requestedPage,
          pageSize: 6,
          search: nameSearch,
          status: statusFilter === "all" ? "" : statusFilter,
          role: roleFilter === "all" ? "" : roleFilter,
          sort: sortOrder,
        },
      });
      setContacts(response.data?.data?.contacts || []);
      setPagination(response.data?.data?.pagination || { page: requestedPage, pageSize: 6, total: 0, totalPages: 1 });
    } catch (error) {
      toast.error(translateError(error));
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }, [nameSearch, roleFilter, sortOrder, statusFilter]);

  useEffect(() => {
    loadContacts(1);
  }, [loadContacts]);

  const handleStatusChange = async (contact) => {
    if (updatingContactId) return;

    setUpdatingContactId(contact._id);
    const loadingToast = toast.loading("Đang cập nhật trạng thái...");
    try {
      const response = await axiosClient.patch(
        `/contacts/${contact._id}/status`,
        {
          isContactted: !contact.isContactted,
        },
      );
      const updatedContact = response.data?.data?.contact;
      setContacts((current) =>
        current.map((item) =>
          item._id === contact._id ? updatedContact : item,
        ),
      );
      toast.success(
        translateSuccess(response.data?.message || "Updated successfully"),
        { id: loadingToast },
      );
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    } finally {
      setUpdatingContactId(null);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString("vi-VN") : "—";

  return (
    <div className="staff-manage-layout admin-contact-page">
      <ManageSidebar role="admin" activeItem="contacts" />
      <main className="admin-contact-list">
        <header className="admin-contact-list__header">
          <div>
            <p className="admin-contact-list__kicker">
              <MessageSquareText size={16} /> Hòm thư liên hệ
            </p>
            <h1>Danh sách liên hệ</h1>
            <p>Các yêu cầu và phản hồi được gửi từ người tham dự sự kiện.</p>
          </div>
          <button
            className="admin-contact-list__refresh"
            type="button"
            onClick={() => loadContacts(1)}
            disabled={isLoading}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </header>

        <section
          className="admin-contact-list__card"
          aria-label="Danh sách liên hệ"
        >
          <div className="admin-contact-list__summary">
            <strong>{pagination.total ?? contacts.length}</strong>
            <span>liên hệ</span>
            <div className="admin-contact-list__filters">
              <label className="admin-contact-filter admin-contact-filter--search">
                <Search size={15} />
                <input
                  value={nameSearch}
                  onChange={(event) => setNameSearch(event.target.value)}
                  placeholder="Tìm theo tên..."
                  aria-label="Tìm theo tên"
                />
              </label>
              <label className="admin-contact-filter">
                <span>Trạng thái</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Lọc theo trạng thái"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chưa xử lý</option>
                  <option value="done">Đã xử lý</option>
                </select>
              </label>
              <label className="admin-contact-filter">
                <span>Role</span>
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  aria-label="Lọc theo role"
                >
                  <option value="all">Tất cả</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="user">Người dùng</option>
                  <option value="guest">Khách</option>
                </select>
              </label>
              <label className="admin-contact-filter">
                <span>Ngày</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  aria-label="Sắp xếp theo ngày"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </label>
            </div>
          </div>
          {isLoading ? (
            <div className="admin-contact-list__empty" aria-busy="true" />
          ) : contacts.length === 0 ? (
            <div className="admin-contact-list__empty">
              Chưa có liên hệ nào.
            </div>
          ) : (
            <div className="admin-contact-table-wrap">
              <table className="admin-contact-table">
                <thead>
                  <tr>
                    <th>Người gửi</th>
                    <th>Chủ đề</th>
                    <th>Nội dung</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>
                        <div className="admin-contact-table__person">
                          <UserRound size={17} />
                          <strong>{contact.receiverName}</strong>
                          <span>
                            <Phone size={13} />
                            {contact.phone}
                          </span>
                          <span>
                            <Mail size={13} />
                            {contact.email}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-contact-table__topic">
                          {contact.topic}
                        </span>
                        <small>
                          <Clock3 size={13} />
                          {formatDate(contact.createdAt)}
                        </small>
                      </td>
                      <td>
                        <p className="admin-contact-table__message">
                          {contact.message}
                        </p>
                      </td>

                      <td>
                        <span
                          className={`admin-contact-status ${contact.isContactted ? "is-done" : "is-pending"}`}
                        >
                          {contact.isContactted ? "Đã xử lý" : "Chưa xử lý"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-contact-action"
                          type="button"
                          disabled={updatingContactId === contact._id}
                          onClick={() => handleStatusChange(contact)}
                        >
                          <Check size={15} />{" "}
                          {contact.isContactted
                            ? "Đánh dấu chưa xử lý"
                            : "Đã xử lý"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && contacts.length > 0 && pagination.totalPages > 1 && (
            <div className="admin-contact-pagination">
              <button type="button" disabled={pagination.page <= 1} onClick={() => loadContacts(pagination.page - 1)}>Trước</button>
              <span>Trang {pagination.page} / {pagination.totalPages}</span>
              <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => loadContacts(pagination.page + 1)}>Sau</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminContactList;
