import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Eye,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "../../apis/axiosClient";
import ManageSidebar from "../../components/ManageSidebar";
import AdminUserDetail from "../../components/AdminUserDetail";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import "./AdminListUser.scss";

const AdminListUser = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [nameSearch, setNameSearch] = useState("");

  const getRoleName = (user) => user.roleId?.roleName || "Chưa xác định";
  const visibleUsers = useMemo(
    () =>
      users.filter((user) => {
        const searchValue = nameSearch.trim().toLowerCase();
        const matchesName =
          !searchValue || user.fullName?.toLowerCase().includes(searchValue);
        const matchesRole =
          roleFilter === "all" || getRoleName(user) === roleFilter;
        const matchesDepartment =
          departmentFilter === "all" ||
          (user.department || "Chưa cập nhật") === departmentFilter;
        const matchesPosition =
          positionFilter === "all" ||
          (user.department_position || "Chưa cập nhật") === positionFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "disabled" ? user.isDisabled : !user.isDisabled);
        return (
          matchesName &&
          matchesRole &&
          matchesDepartment &&
          matchesPosition &&
          matchesStatus
        );
      }),
    [
      departmentFilter,
      nameSearch,
      positionFilter,
      roleFilter,
      statusFilter,
      users,
    ],
  );

  const roleOptions = [...new Set(users.map(getRoleName))];
  const departmentOptions = [
    ...new Set(users.map((user) => user.department || "Chưa cập nhật")),
  ];
  const positionOptions = [
    ...new Set(
      users.map((user) => user.department_position || "Chưa cập nhật"),
    ),
  ];

  const loadUsers = useCallback(
    async (requestedPage = 1) => {
      const loadingToast = toast.loading("Đang tải danh sách người dùng...");
      setIsLoading(true);
      try {
        const response = await axiosClient.get("/users", {
          params: {
            page: requestedPage,
            pageSize: 6,
            search: nameSearch,
            role: roleFilter === "all" ? "" : roleFilter,
            department: departmentFilter === "all" ? "" : departmentFilter,
            position: positionFilter === "all" ? "" : positionFilter,
            status: statusFilter === "all" ? "" : statusFilter,
          },
        });
        const data = response.data || {};
        setUsers(data.users || []);
        setPagination(
          data.pagination || {
            page: requestedPage,
            pageSize: 6,
            total: data.users?.length || 0,
            totalPages: 1,
          },
        );
        toast.success(translateSuccess("Operation successful"), {
          id: loadingToast,
        });
      } catch (error) {
        toast.error(translateError(error), { id: loadingToast });
      } finally {
        setIsLoading(false);
      }
    },
    [departmentFilter, nameSearch, positionFilter, roleFilter, statusFilter],
  );

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  const handleViewDetail = async (user) => {
    try {
      const response = await axiosClient.get(`/users/${user._id}`);
      setSelectedUser(response.data);
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    }
  };

  const handleToggleUserStatus = async (user) => {
    const isDisabling = !user.isDisabled;
    const loadingToast = toast.loading(
      isDisabling
        ? "Đang vô hiệu hóa tài khoản..."
        : "Đang gỡ vô hiệu hóa tài khoản...",
    );
    try {
      const endpoint = isDisabling ? "disable" : "enable";
      const response = await axiosClient.patch(
        `/users/${user._id}/${endpoint}`,
      );
      const updatedUser = response.data;
      setUsers((current) =>
        current.map((item) => (item._id === user._id ? updatedUser : item)),
      );
      setSelectedUser(updatedUser);
      toast.success(
        translateSuccess(
          isDisabling
            ? "User disabled successfully"
            : "User enabled successfully",
        ),
        { id: loadingToast },
      );
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "—";
  return (
    <div className="staff-manage-layout admin-user-page">
      <ManageSidebar role="admin" activeItem="users" />
      <main className="admin-user-list">
        <header className="admin-user-list__header">
          <div>
            <p className="admin-user-list__kicker">
              <ShieldCheck size={16} /> Quản trị người dùng
            </p>
            <h1>Danh sách người dùng</h1>
            <p>
              Theo dõi thông tin tài khoản và trạng thái hoạt động trong hệ
              thống.
            </p>
          </div>
          <button
            className="admin-user-list__refresh"
            type="button"
            onClick={() => loadUsers(1)}
            disabled={isLoading}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </header>

        <section
          className="admin-user-list__card"
          aria-label="Danh sách người dùng"
        >
          <div className="admin-user-list__summary">
            <strong>{pagination.total ?? users.length}</strong>
            <span>người dùng</span>
            <div className="admin-user-list__filters">
              <label className="admin-user-filter admin-user-filter--search">
                <Search size={15} />
                <input
                  value={nameSearch}
                  onChange={(event) => setNameSearch(event.target.value)}
                  placeholder="Tìm theo tên..."
                  aria-label="Tìm theo tên"
                />
              </label>
              <label className="admin-user-filter">
                <span>Role</span>
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  aria-label="Lọc theo role"
                >
                  <option value="all">Tất cả</option>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-user-filter">
                <span>Phòng ban</span>
                <select
                  value={departmentFilter}
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                  aria-label="Lọc theo phòng ban"
                >
                  <option value="all">Tất cả</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-user-filter">
                <span>Position</span>
                <select
                  value={positionFilter}
                  onChange={(event) => setPositionFilter(event.target.value)}
                  aria-label="Lọc theo position"
                >
                  <option value="all">Tất cả</option>
                  {positionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-user-filter">
                <span>Trạng thái</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Lọc theo trạng thái"
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="disabled">Đã vô hiệu hóa</option>
                </select>
              </label>
            </div>
          </div>
          {isLoading ? (
            <div className="admin-user-list__empty" aria-busy="true" />
          ) : users.length === 0 ? (
            <div className="admin-user-list__empty">
              Chưa có người dùng nào.
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className="admin-user-list__empty">
              Không tìm thấy người dùng phù hợp.
            </div>
          ) : (
            <div className="admin-user-table-wrap">
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Liên hệ</th>
                    <th>Phòng ban</th>
                    <th>Role</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="admin-user-table__person">
                          <UserRound size={18} />
                          <strong>{user.fullName || "Chưa cập nhật"}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="admin-user-table__contact">
                          <span>
                            <Mail size={14} />
                            {user.email}
                          </span>
                          <span>
                            <Phone size={14} />
                            {user.phone || "Chưa cập nhật"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <strong>{user.department || "Chưa cập nhật"}</strong>
                        <small>{user.department_position || "—"}</small>
                      </td>
                      <td>
                        <span className="admin-user-role">
                          {getRoleName(user)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-user-status ${user.isDisabled ? "is-disabled" : "is-active"}`}
                        >
                          {user.isDisabled
                            ? "Đã vô hiệu hóa"
                            : "Đang hoạt động"}
                        </span>
                        <small>
                          {user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                        </small>
                      </td>
                      <td>
                        <button
                          className="admin-user-action"
                          type="button"
                          onClick={() => handleViewDetail(user)}
                        >
                          <Eye size={16} /> Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && users.length > 0 && pagination.totalPages > 1 && (
            <div className="admin-user-pagination">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => loadUsers(pagination.page - 1)}
              >
                Trước
              </button>
              <span>
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadUsers(pagination.page + 1)}
              >
                Sau
              </button>
            </div>
          )}
        </section>
      </main>
      <AdminUserDetail
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleStatus={handleToggleUserStatus}
        formatDate={formatDate}
      />
    </div>
  );
};

export default AdminListUser;
