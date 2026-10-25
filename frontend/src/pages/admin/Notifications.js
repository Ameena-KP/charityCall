import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  sendNotification,
  getAdminNotifications,
  getAllUsers,
} from "../../services/adminService";
import { validateDescription } from "../../utils/validators";

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [targetUser, setTargetUser] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ text: "", type: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifRes, userRes] = await Promise.all([
        getAdminNotifications(),
        getAllUsers(),
      ]);
      if (notifRes.success && notifRes.notifications) {
        setNotifications(notifRes.notifications);
      }
      if (userRes.success && userRes.users) {
        setUsers(userRes.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setTouched(true);
    const msgErr = validateDescription(message, 5, 500);
    setError(msgErr);

    if (msgErr) {
      setAlertInfo({ text: msgErr, type: "danger" });
      return;
    }

    try {
      setSending(true);
      setAlertInfo({ text: "", type: "" });
      const res = await sendNotification({
        user_id: targetUser === "all" ? null : targetUser,
        message: message.trim(),
      });

      if (res.success) {
        setAlertInfo({ text: res.message, type: "success" });
        setMessage("");
        setTargetUser("all");
        setTouched(false);
        setError("");
        // Reload notifications list
        const notifRes = await getAdminNotifications();
        if (notifRes.success) setNotifications(notifRes.notifications);
      }
    } catch (err) {
      setAlertInfo({
        text: err.response?.data?.message || "Failed to send notification.",
        type: "danger",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout
      title="Send Notifications"
      subtitle="Broadcast announcements or send targeted system alerts to platform members"
    >
      <div className="row g-4">
        {/* Composer Form */}
        <div className="col-lg-5">
          <div className="content-card">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-send-fill text-primary me-2"></i>
                Compose Notification
              </h5>
            </div>

            <div className="content-card-body">
              {alertInfo.text && (
                <div className={`alert alert-${alertInfo.type} d-flex align-items-center gap-2 mb-3 small`}>
                  <i
                    className={`bi ${
                      alertInfo.type === "success"
                        ? "bi-check-circle-fill"
                        : "bi-exclamation-triangle-fill"
                    }`}
                  ></i>
                  <div>{alertInfo.text}</div>
                </div>
              )}

              <form onSubmit={handleSend}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Recipient Target</label>
                  <select
                    className="form-select"
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                  >
                    <option value="all">📢 Broadcast to All Users</option>
                    <optgroup label="Individual Users">
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    Select whether to broadcast to every active user or target a specific user.
                  </small>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-semibold small mb-1">
                      Notification Message <span className="text-danger">*</span>
                    </label>
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Min. 5 chars ({message.length}/500)
                    </small>
                  </div>
                  <textarea
                    className={`form-control ${touched ? (error ? "is-invalid" : "is-valid") : ""}`}
                    rows="4"
                    maxLength={500}
                    placeholder="Write your announcement or alert message here..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (touched) setError(validateDescription(e.target.value, 5, 500));
                    }}
                    onBlur={() => {
                      setTouched(true);
                      setError(validateDescription(message, 5, 500));
                    }}
                    required
                  ></textarea>
                  {touched && error && (
                    <div className="invalid-feedback d-block">{error}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2"
                  disabled={sending || !message.trim()}
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-megaphone me-2"></i>
                      Dispatch Notification
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sent Log Table */}
        <div className="col-lg-7">
          <div className="content-card">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-clock-history text-muted me-2"></i>
                Notification Dispatch Log ({notifications.length})
              </h5>
              <button
                className="btn btn-outline-custom btn-sm"
                onClick={loadData}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading dispatch history...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-bell text-muted" style={{ fontSize: "2rem" }}></i>
                <p className="text-muted mt-2">No notifications have been dispatched yet.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ maxHeight: "480px", overflowY: "auto" }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Recipient</th>
                      <th>Message Content</th>
                      <th>Sent Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((n) => (
                      <tr key={n.id}>
                        <td>
                          {n.user_id ? (
                            <div>
                              <span className="badge bg-light text-dark border">
                                {n.user_name || `User #${n.user_id}`}
                              </span>
                              <small className="text-muted d-block">{n.user_email}</small>
                            </div>
                          ) : (
                            <span className="badge bg-primary text-white">
                              <i className="bi bi-broadcast me-1"></i> Broadcast
                            </span>
                          )}
                        </td>
                        <td style={{ maxWidth: "260px" }}>
                          <span className="small text-dark">{n.message}</span>
                        </td>
                        <td className="small text-muted">
                          {new Date(n.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminNotifications;
