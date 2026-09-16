import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthRole, getAuthUser } from "../utils/authStorage";

function Sidebar({ isMobileOpen, closeMobileSidebar }) {
  const navigate = useNavigate();

  const role = getAuthRole() || "user";
  const user = getAuthUser() || { name: "User", email: "" };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      clearAuthSession();
      navigate("/login");
    }
  };

  const getRoleBadgeClass = () => {
    if (role === "admin") return "role-badge-admin";
    if (role === "team") return "role-badge-team";
    return "role-badge-user";
  };

  const getRoleLabel = () => {
    if (role === "admin") return "Administrator";
    if (role === "team") return "Verification Team";
    return "Donor / Beneficiary";
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? "show-mobile" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand">
            <div className="brand-icon-box">
              <i className="bi bi-heart-pulse-fill"></i>
            </div>
            <div>
              <h1 className="brand-title">Charity Connect</h1>
              <span className="brand-subtitle">Verified Giving Platform</span>
            </div>
          </NavLink>
        </div>

        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="sidebar-user-name" title={user.name || "User"}>
              {user.name || "Welcome"}
            </div>
            <span className={`sidebar-role-badge ${getRoleBadgeClass()}`}>
              {getRoleLabel()}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="sidebar-nav-container">
          {/* USER NAVIGATION */}
          {role === "user" && (
            <>
              <div className="sidebar-section-label">Charity & Giving</div>
              <NavLink
                to="/user/browse"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-grid-fill nav-link-icon"></i>
                  <span>Browse Requests</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/user/create-request"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-plus-circle-fill nav-link-icon text-primary"></i>
                  <span>Request Help</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/user/my-requests"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-file-earmark-medical-fill nav-link-icon"></i>
                  <span>My Requests & Help</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/user/my-donations"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-box2-heart-fill nav-link-icon text-success"></i>
                  <span>My Donations</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <div className="sidebar-section-label mt-3">Account & Tools</div>
              <NavLink
                to="/user/notifications"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-bell-fill nav-link-icon text-warning"></i>
                  <span>Notifications</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/user/feedback"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-chat-square-text-fill nav-link-icon"></i>
                  <span>Give Feedback</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/user/profile"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-person-gear nav-link-icon"></i>
                  <span>Profile Settings</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>
            </>
          )}

          {/* TEAM NAVIGATION */}
          {role === "team" && (
            <>
              <div className="sidebar-section-label">Verification Desk</div>
              <NavLink
                to="/team/dashboard"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-shield-check nav-link-icon text-warning"></i>
                  <span>Verification Queue</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/team/approved"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-check2-circle nav-link-icon text-success"></i>
                  <span>Approved Requests</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/team/donations"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-box-seam-fill nav-link-icon text-info"></i>
                  <span>Manage Donations</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>
            </>
          )}

          {/* ADMIN NAVIGATION */}
          {role === "admin" && (
            <>
              <div className="sidebar-section-label">System Control</div>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-speedometer2 nav-link-icon text-primary"></i>
                  <span>Dashboard Overview</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-people-fill nav-link-icon text-info"></i>
                  <span>User Management</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/admin/teams"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-person-badge-fill nav-link-icon text-success"></i>
                  <span>Team Approvals</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/admin/requests"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-inbox-fill nav-link-icon text-warning"></i>
                  <span>All Charity Requests</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/admin/donations"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-cash-stack nav-link-icon"></i>
                  <span>Monitor Donations</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <div className="sidebar-section-label mt-3">Communications & Reports</div>
              <NavLink
                to="/admin/notifications"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-megaphone-fill nav-link-icon text-warning"></i>
                  <span>Send Notifications</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/admin/reports"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-bar-chart-line-fill nav-link-icon text-primary"></i>
                  <span>System Reports</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>

              <NavLink
                to="/admin/feedback"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileSidebar}
              >
                <span className="nav-link-content">
                  <i className="bi bi-chat-dots-fill nav-link-icon"></i>
                  <span>User Feedback</span>
                </span>
                <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.75rem" }}></i>
              </NavLink>
            </>
          )}

          <div className="sidebar-section-label mt-3">Public Portal</div>
          <NavLink
            to="/"
            className="sidebar-nav-item"
            onClick={closeMobileSidebar}
          >
            <span className="nav-link-content">
              <i className="bi bi-house-door-fill nav-link-icon"></i>
              <span>View Landing Page</span>
            </span>
            <i className="bi bi-box-arrow-up-right text-muted" style={{ fontSize: "0.75rem" }}></i>
          </NavLink>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
