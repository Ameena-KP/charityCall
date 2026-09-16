import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import { getDashboardStats } from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    totalTeams: 0,
    pendingTeams: 0,
    approvedTeams: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalDonations: 0,
    completedDonations: 0,
    totalFeedback: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res.success && res.dashboard) {
        setStats(res.dashboard);
      }
    } catch (err) {
      console.error("Error loading admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="System Overview Dashboard"
      subtitle="Real-time analytics, user accounts, team approvals, and charity operations"
    >
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading dashboard analytics...</p>
        </div>
      ) : (
        <>
      {/* Alert if pending team approvals */}
      {stats.pendingTeams > 0 && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center mb-4 border-warning">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            <div>
              <strong>Action Required:</strong> You have{" "}
              <strong>{stats.pendingTeams}</strong> team volunteer registration(s)
              awaiting your approval!
            </div>
          </div>
          <Link to="/admin/teams" className="btn btn-sm btn-dark">
            Review Registrations
          </Link>
        </div>
      )}

      {/* Metrics Row 1 */}
      <div className="row g-3 mb-4">
        {/* Total Users */}
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon primary">
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <div className="stat-value">{stats.totalUsers}</div>
              <p className="stat-label">Total Users</p>
              <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                {stats.blockedUsers || 0} blocked
              </small>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon success">
              <i className="bi bi-person-badge-fill"></i>
            </div>
            <div>
              <div className="stat-value">{stats.totalTeams}</div>
              <p className="stat-label">Team Members</p>
              <small className="text-warning fw-semibold" style={{ fontSize: "0.72rem" }}>
                {stats.pendingTeams || 0} pending approval
              </small>
            </div>
          </div>
        </div>

        {/* Total Requests */}
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon warning">
              <i className="bi bi-file-earmark-medical-fill"></i>
            </div>
            <div>
              <div className="stat-value">{stats.totalRequests}</div>
              <p className="stat-label">Charity Requests</p>
              <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                {stats.pendingRequests || 0} pending verification
              </small>
            </div>
          </div>
        </div>

        {/* Total Donations */}
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon danger">
              <i className="bi bi-gift-fill"></i>
            </div>
            <div>
              <div className="stat-value">{stats.totalDonations}</div>
              <p className="stat-label">Pledged Donations</p>
              <small className="text-success fw-semibold" style={{ fontSize: "0.72rem" }}>
                {stats.completedDonations || 0} delivered
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Breakdown */}
      <div className="row g-4 mb-4">
        {/* Requests Breakdown Card */}
        <div className="col-lg-6">
          <div className="content-card h-100 mb-0">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-pie-chart-fill text-primary me-2"></i>
                Charity Requests Status
              </h5>
              <Link to="/admin/requests" className="btn btn-outline-custom btn-sm">
                View All
              </Link>
            </div>
            <div className="content-card-body">
              <div className="d-flex justify-content-around text-center py-3">
                <div className="p-3 bg-light rounded flex-fill mx-1">
                  <span className="d-block fs-3 fw-bold text-success">
                    {stats.approvedRequests || 0}
                  </span>
                  <span className="text-muted small fw-semibold">Approved</span>
                </div>
                <div className="p-3 bg-light rounded flex-fill mx-1">
                  <span className="d-block fs-3 fw-bold text-warning">
                    {stats.pendingRequests || 0}
                  </span>
                  <span className="text-muted small fw-semibold">Pending</span>
                </div>
                <div className="p-3 bg-light rounded flex-fill mx-1">
                  <span className="d-block fs-3 fw-bold text-danger">
                    {stats.rejectedRequests || 0}
                  </span>
                  <span className="text-muted small fw-semibold">Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="col-lg-6">
          <div className="content-card h-100 mb-0">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                Administrative Quick Actions
              </h5>
            </div>
            <div className="content-card-body">
              <div className="row g-2">
                <div className="col-6">
                  <Link
                    to="/admin/teams"
                    className="btn btn-outline-custom w-100 text-start py-2 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-person-check-fill text-success fs-5"></i>
                    <div>
                      <div className="fw-semibold small">Approve Teams</div>
                      <small className="text-muted">{stats.pendingTeams || 0} pending</small>
                    </div>
                  </Link>
                </div>

                <div className="col-6">
                  <Link
                    to="/admin/users"
                    className="btn btn-outline-custom w-100 text-start py-2 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-shield-slash-fill text-danger fs-5"></i>
                    <div>
                      <div className="fw-semibold small">Manage Users</div>
                      <small className="text-muted">Block / Unblock</small>
                    </div>
                  </Link>
                </div>

                <div className="col-6">
                  <Link
                    to="/admin/notifications"
                    className="btn btn-outline-custom w-100 text-start py-2 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-megaphone-fill text-warning fs-5"></i>
                    <div>
                      <div className="fw-semibold small">Send Notice</div>
                      <small className="text-muted">Broadcast to all</small>
                    </div>
                  </Link>
                </div>

                <div className="col-6">
                  <Link
                    to="/admin/reports"
                    className="btn btn-outline-custom w-100 text-start py-2 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-file-earmark-bar-graph-fill text-primary fs-5"></i>
                    <div>
                      <div className="fw-semibold small">Generate Reports</div>
                      <small className="text-muted">Audit & export</small>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;