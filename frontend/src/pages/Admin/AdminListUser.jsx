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
import { useTranslation } from "react-i18next";
import { SkeletonRows } from "../../components/LoadingSkeletons";
import axiosClient from "../../apis/axiosClient";
import ManageSidebar from "../../components/ManageSidebar";
import AdminUserDetail from "../../components/AdminUserDetail";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import "./AdminListUser.scss";

const AdminListUser = () => {
  const { t, i18n } = useTranslation();
  const userText = (key, options) => t(`management.users.${key}`, options);
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
  const [searchInput, setSearchInput] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  const getRoleName = (user) => user.roleId?.roleName || t("management.common.unknown");
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
          (user.department || t("management.common.notUpdated")) === departmentFilter;
        const matchesPosition =
          positionFilter === "all" ||
          (user.department_position || t("management.common.notUpdated")) === positionFilter;
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
      t,
      users,
    ],
  );

  const roleOptions = [...new Set(users.map(getRoleName))];
  const departmentOptions = [
    ...new Set(users.map((user) => user.department || t("management.common.notUpdated"))),
  ];
  const positionOptions = [
    ...new Set(
      users.map((user) => user.department_position || t("management.common.notUpdated")),
    ),
  ];

  const loadUsers = useCallback(
    async (requestedPage = 1) => {
      const loadingToast = toast.loading(t("management.users.loading"));
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
    [departmentFilter, nameSearch, positionFilter, roleFilter, statusFilter, t],
  );

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  const handleViewDetail = async (user) => {
    try {
      const response = await axiosClient.get(`/users/${user._id}`);
      setSelectedUser(response.data);
    } catch (error) {
      toast.error(translateError(error));
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setNameSearch(searchInput);
  };

  const handleToggleUserStatus = async (user) => {
    const isDisabling = !user.isDisabled;
    const loadingToast = toast.loading(
      isDisabling
        ? userText("disabling")
        : userText("enabling"),
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
    date ? new Date(date).toLocaleDateString(i18n.language === "en" ? "en-US" : "vi-VN") : "—";
  return (
    <div className="staff-manage-layout admin-user-page">
      <ManageSidebar role="admin" activeItem="users" />
      <main className="admin-user-list">
        <header className="admin-user-list__header">
          <div>
            <p className="admin-user-list__kicker">
              <ShieldCheck size={16} /> {userText("kicker")}
            </p>
            <h1>{userText("title")}</h1>
            <p>{userText("intro")}</p>
          </div>
          <button
            className="admin-user-list__refresh"
            type="button"
            onClick={() => loadUsers(1)}
            disabled={isLoading}
          >
            <RefreshCw size={16} /> {t("management.common.refresh")}
          </button>
        </header>

        <section
          className="admin-user-list__card"
          aria-label={userText("title")}
        >
          <div className="admin-user-list__summary">
            <strong>{pagination.total ?? users.length}</strong>
            <span>{userText("users")}</span>
            <div className="admin-user-list__filters">
              <form className="admin-user-filter admin-user-filter--search" onSubmit={handleSearchSubmit}>
                <Search size={15} />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder={userText("searchPlaceholder")}
                  aria-label={userText("search")}
                />
                <button type="submit" aria-label={userText("search")}>
                  <Search size={15} />
                </button>
              </form>
              <label className="admin-user-filter">
                <span>{userText("role")}</span>
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  aria-label={userText("filterRole")}
                >
                  <option value="all">{t("management.common.all")}</option>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-user-filter">
                <span>{userText("department")}</span>
                <select
                  value={departmentFilter}
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                  aria-label={userText("filterDepartment")}
                >
                  <option value="all">{t("management.common.all")}</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-user-filter">
                <span>{userText("position")}</span>
                <select
                  value={positionFilter}
                  onChange={(event) => setPositionFilter(event.target.value)}
                  aria-label={userText("filterPosition")}
                >
                  <option value="all">{t("management.common.all")}</option>
                  {positionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-user-filter">
                <span>{t("management.common.status")}</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label={userText("filterStatus")}
                >
                  <option value="all">{t("management.common.all")}</option>
                  <option value="active">{t("management.common.active")}</option>
                  <option value="disabled">{t("management.common.disabled")}</option>
                </select>
              </label>
            </div>
          </div>
          {isLoading ? (
            <SkeletonRows rows={7} columns={6} />
          ) : users.length === 0 ? (
            <div className="admin-user-list__empty">
              {userText("empty")}
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className="admin-user-list__empty">
              {userText("noMatch")}
            </div>
          ) : (
            <div className="admin-user-table-wrap">
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>{userText("user")}</th>
                    <th>{userText("contact")}</th>
                    <th>{userText("department")}</th>
                    <th>{userText("role")}</th>
                    <th>{t("management.common.status")}</th>
                    <th>{t("management.common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="admin-user-table__person">
                          <UserRound size={18} />
                          <strong>{user.fullName || t("management.common.notUpdated")}</strong>
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
                            {user.phone || t("management.common.notUpdated")}
                          </span>
                        </div>
                      </td>
                      <td>
                        <strong>{user.department || t("management.common.notUpdated")}</strong>
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
                          {t(`management.common.${user.isDisabled ? "disabled" : "active"}`)}
                        </span>
                        <small>
                          {userText(user.isVerified ? "verified" : "unverified")}
                        </small>
                      </td>
                      <td>
                        <button
                          className="admin-user-action"
                          type="button"
                          onClick={() => handleViewDetail(user)}
                        >
                          <Eye size={16} /> {t("management.common.details")}
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
                {t("management.common.previous")}
              </button>
              <span>
                {userText("pageOf", { page: pagination.page, total: pagination.totalPages })}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadUsers(pagination.page + 1)}
              >
                {t("management.common.next")}
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
