import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAuthRole, getAuthUser } from "../utils/authStorage";

function DashboardLayout({ title, subtitle, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = getAuthRole() || "user";
  const user = getAuthUser() || { name: "User" };

  return (
    <div className="app-container">
      {/* Leftside Navbar / Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        closeMobileSidebar={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Top Header Bar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              title="Toggle Menu"
            >
              <i className="bi bi-list"></i>
            </button>
            <div>
              <h2 className="topbar-title">{title}</h2>
              {subtitle && (
                <small className="text-muted d-block" style={{ fontSize: "0.78rem" }}>
                  {subtitle}
                </small>
              )}
            </div>
          </div>

          <div className="topbar-right">
            <div className="d-none d-md-flex align-items-center gap-2 me-2">
              <span className="badge bg-light text-dark border py-2 px-3">
                <i className="bi bi-clock me-1 text-primary"></i>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="d-none d-sm-block text-start">
                <span className="d-block fw-semibold" style={{ fontSize: "0.84rem" }}>
                  {user.name}
                </span>
                <span className="d-block text-muted text-capitalize" style={{ fontSize: "0.72rem" }}>
                  {role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
