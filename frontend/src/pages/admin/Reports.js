import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getReports } from "../../services/adminService";

function AdminReports() {
  const [reportData, setReportData] = useState({
    summary: {},
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await getReports();
      if (res.success) {
        setReportData({
          summary: res.summary || {},
          categoryBreakdown: res.categoryBreakdown || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const { summary, categoryBreakdown } = reportData;
  const totalReq = summary.totalRequests || 0;
  const approvedReq = summary.approvedRequests || 0;
  const approvalRate =
    totalReq > 0 ? ((approvedReq / totalReq) * 100).toFixed(1) : 0;

  return (
    <AdminLayout
      title="System Reports & Analytics"
      subtitle="Comprehensive performance metrics, category distribution, and printable audit reports"
    >
      {/* Action Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="badge bg-light text-dark border px-3 py-2">
            <i className="bi bi-calendar-check me-1 text-primary"></i>
            Report Generated: {new Date().toLocaleDateString()}
          </span>
        </div>
        <button className="btn btn-primary-custom btn-sm" onClick={handlePrint}>
          <i className="bi bi-printer-fill me-1"></i> Print / Export Report
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Compiling system reports...</p>
        </div>
      ) : (
        <div className="report-printable-area">
          {/* Executive Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon primary">
                  <i className="bi bi-percent"></i>
                </div>
                <div>
                  <div className="stat-value">{approvalRate}%</div>
                  <p className="stat-label">Approval Rate</p>
                  <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                    Verified Genuine Appeals
                  </small>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon success">
                  <i className="bi bi-gift-fill"></i>
                </div>
                <div>
                  <div className="stat-value">{summary.totalDonations || 0}</div>
                  <p className="stat-label">Total Donations</p>
                  <small className="text-success fw-semibold" style={{ fontSize: "0.72rem" }}>
                    {summary.completedDonations || 0} Delivered
                  </small>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon warning">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div>
                  <div className="stat-value">{summary.totalUsers || 0}</div>
                  <p className="stat-label">Beneficiaries & Donors</p>
                  <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                    {summary.blockedUsers || 0} Blocked
                  </small>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon primary">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div>
                  <div className="stat-value">{summary.totalTeams || 0}</div>
                  <p className="stat-label">Verification Volunteers</p>
                  <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                    {summary.approvedTeams || 0} Approved
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="content-card mb-4">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-pie-chart-fill text-primary me-2"></i>
                Aid Requests by Category Breakdown
              </h5>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total Requests</th>
                    <th>Approved</th>
                    <th>Pending</th>
                    <th>Rejected</th>
                    <th>Verification Share</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No category data recorded yet.
                      </td>
                    </tr>
                  ) : (
                    categoryBreakdown.map((c, idx) => {
                      const share =
                        totalReq > 0
                          ? ((c.total_requests / totalReq) * 100).toFixed(1)
                          : 0;
                      return (
                        <tr key={idx}>
                          <td>
                            <span className="category-tag">{c.category || "General"}</span>
                          </td>
                          <td className="fw-bold">{c.total_requests}</td>
                          <td>
                            <span className="text-success fw-semibold">
                              {c.approved || 0}
                            </span>
                          </td>
                          <td>
                            <span className="text-warning fw-semibold">
                              {c.pending || 0}
                            </span>
                          </td>
                          <td>
                            <span className="text-danger fw-semibold">
                              {c.rejected || 0}
                            </span>
                          </td>
                          <td style={{ minWidth: "150px" }}>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="progress flex-grow-1"
                                style={{ height: "6px" }}
                              >
                                <div
                                  className="progress-bar bg-primary"
                                  style={{ width: `${share}%` }}
                                ></div>
                              </div>
                              <small className="text-muted">{share}%</small>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform Integrity Summary */}
          <div className="content-card">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-file-earmark-check-fill text-success me-2"></i>
                Platform Transparency & Verification Summary
              </h5>
            </div>
            <div className="content-card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded border text-center">
                    <span className="text-muted small d-block">Pending Request Verification</span>
                    <span className="fs-4 fw-bold text-warning">
                      {summary.pendingRequests || 0}
                    </span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded border text-center">
                    <span className="text-muted small d-block">Pending Volunteer Approvals</span>
                    <span className="fs-4 fw-bold text-warning">
                      {summary.pendingTeams || 0}
                    </span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded border text-center">
                    <span className="text-muted small d-block">User Feedback Items</span>
                    <span className="fs-4 fw-bold text-info">
                      {summary.totalFeedback || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminReports;
