import React from "react";
import { AtSign, Building2, BriefcaseBusiness, CheckCircle2, Mail, Phone, ShieldCheck, UserRound, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const AdminUserDetail = ({ user, onClose, onToggleStatus, formatDate }) => {
  const { t } = useTranslation();
  const componentText = (key) => t(`components.${key}`);
  if (!user) return null;

  const roleName = user.roleId?.roleName || componentText("unknownRole");

  return (
    <div className="admin-user-detail__overlay" role="presentation" onMouseDown={onClose}>
      <section className="admin-user-detail" role="dialog" aria-modal="true" aria-labelledby="admin-user-detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="admin-user-detail__header">
          <div><p><ShieldCheck size={16} /> {componentText("adminProfile")}</p><h2 id="admin-user-detail-title">{user.fullName || componentText("notUpdated")}</h2></div>
          <button type="button" onClick={onClose} aria-label={componentText("close")}><X size={20} /></button>
        </header>
        <div className="admin-user-detail__status"><span className={`admin-user-status ${user.isDisabled ? "is-disabled" : "is-active"}`}>{componentText(user.isDisabled ? "disabled" : "active")}</span><span className="admin-user-role">{roleName}</span></div>
        <div className="admin-user-detail__grid">
          <div><UserRound size={17} /><span><small>{componentText("fullName")}</small><strong>{user.fullName || componentText("notUpdated")}</strong></span></div>
          <div><AtSign size={17} /><span><small>{componentText("username")}</small><strong>{user.userName || componentText("notUpdated")}</strong></span></div>
          <div><Mail size={17} /><span><small>{componentText("email")}</small><strong>{user.email || componentText("notUpdated")}</strong></span></div>
          <div><Phone size={17} /><span><small>{componentText("phone")}</small><strong>{user.phone || componentText("notUpdated")}</strong></span></div>
          <div><ShieldCheck size={17} /><span><small>{componentText("authMethod")}</small><strong>{user.authProvider || componentText("notUpdated")}</strong></span></div>
          <div><Building2 size={17} /><span><small>{componentText("department")}</small><strong>{user.department || componentText("notUpdated")}</strong></span></div>
          <div><BriefcaseBusiness size={17} /><span><small>{componentText("position")}</small><strong>{user.department_position || componentText("notUpdated")}</strong></span></div>
          <div><CheckCircle2 size={17} /><span><small>{componentText("email")}</small><strong>{componentText(user.isVerified ? "verified" : "unverified")}</strong></span></div>
          <div><span><small>{componentText("created")}</small><strong>{formatDate(user.createdAt)}</strong></span></div>
        </div>
        <footer className="admin-user-detail__footer"><span>{componentText("updated")}: {formatDate(user.updatedAt)}</span><button className={`admin-user-detail__disable ${user.isDisabled ? "is-enable" : ""}`} type="button" onClick={() => onToggleStatus(user)}>{componentText(user.isDisabled ? "enableAccount" : "disableAccount")}</button></footer>
      </section>
    </div>
  );
};

export default AdminUserDetail;
