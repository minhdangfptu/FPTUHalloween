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
import { useTranslation } from "react-i18next";
import { SkeletonRows } from "../../components/LoadingSkeletons";
import axiosClient from "../../apis/axiosClient";
import ManageSidebar from "../../components/ManageSidebar";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import "./AdminContactList.scss";

const AdminContactList = () => {
  const { t, i18n } = useTranslation();
  const contactText = (key, options) => t(`management.contacts.${key}`, options);
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [updatingContactId, setUpdatingContactId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [nameSearch, setNameSearch] = useState("");

  const loadContacts = useCallback(async (requestedPage = 1) => {
    const loadingToast = toast.loading(t("management.contacts.loading"));
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
  }, [nameSearch, roleFilter, sortOrder, statusFilter, t]);

  useEffect(() => {
    loadContacts(1);
  }, [loadContacts]);

  const handleStatusChange = async (contact) => {
    if (updatingContactId) return;

    setUpdatingContactId(contact._id);
    const loadingToast = toast.loading(contactText("updatingStatus"));
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
    date ? new Date(date).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN") : "—";

  return (
    <div className="staff-manage-layout admin-contact-page">
      <ManageSidebar role="admin" activeItem="contacts" />
      <main className="admin-contact-list">
        <header className="admin-contact-list__header">
          <div>
            <p className="admin-contact-list__kicker">
              <MessageSquareText size={16} /> {contactText("kicker")}
            </p>
            <h1>{contactText("title")}</h1>
            <p>{contactText("intro")}</p>
          </div>
          <button
            className="admin-contact-list__refresh"
            type="button"
            onClick={() => loadContacts(1)}
            disabled={isLoading}
          >
            <RefreshCw size={16} /> {t("management.common.refresh")}
          </button>
        </header>

        <section
          className="admin-contact-list__card"
          aria-label={contactText("title")}
        >
          <div className="admin-contact-list__summary">
            <strong>{pagination.total ?? contacts.length}</strong>
            <span>{contactText("contacts")}</span>
            <div className="admin-contact-list__filters">
              <label className="admin-contact-filter admin-contact-filter--search">
                <Search size={15} />
                <input
                  value={nameSearch}
                  onChange={(event) => setNameSearch(event.target.value)}
                  placeholder={contactText("searchPlaceholder")}
                  aria-label={contactText("search")}
                />
              </label>
              <label className="admin-contact-filter">
                <span>{t("management.common.status")}</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label={contactText("filterStatus")}
                >
                  <option value="all">{t("management.common.all")}</option>
                  <option value="pending">{contactText("pending")}</option>
                  <option value="done">{contactText("done")}</option>
                </select>
              </label>
              <label className="admin-contact-filter">
                <span>{contactText("role")}</span>
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  aria-label={contactText("filterRole")}
                >
                  <option value="all">{t("management.common.all")}</option>
                  <option value="admin">{t("components.admin")}</option>
                  <option value="staff">{t("components.staff")}</option>
                  <option value="user">{contactText("user")}</option>
                  <option value="guest">{contactText("guest")}</option>
                </select>
              </label>
              <label className="admin-contact-filter">
                <span>{t("management.common.date")}</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  aria-label={contactText("sortDate")}
                >
                  <option value="newest">{contactText("newest")}</option>
                  <option value="oldest">{contactText("oldest")}</option>
                </select>
              </label>
            </div>
          </div>
          {isLoading ? (
            <SkeletonRows rows={6} columns={5} />
          ) : contacts.length === 0 ? (
            <div className="admin-contact-list__empty">
              {contactText("empty")}
            </div>
          ) : (
            <div className="admin-contact-table-wrap">
              <table className="admin-contact-table">
                <thead>
                  <tr>
                    <th>{contactText("sender")}</th>
                    <th>{contactText("subject")}</th>
                    <th>{contactText("content")}</th>
                    <th>{t("management.common.status")}</th>
                    <th>{t("management.common.actions")}</th>
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
                          {contactText(contact.isContactted ? "done" : "pending")}
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
                          {contactText(contact.isContactted ? "markPending" : "markDone")}
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
              <button type="button" disabled={pagination.page <= 1} onClick={() => loadContacts(pagination.page - 1)}>{t("management.common.previous")}</button>
              <span>{contactText("pageOf", { page: pagination.page, total: pagination.totalPages })}</span>
              <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => loadContacts(pagination.page + 1)}>{t("management.common.next")}</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminContactList;
