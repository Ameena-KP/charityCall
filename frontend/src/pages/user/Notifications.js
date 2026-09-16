import React, { useEffect, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import { getNotifications, markNotificationRead } from "../../services/userService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, status: "Read" } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserLayout
      title="Notifications"
      subtitle="Administrative announcements and system alerts regarding your account"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold m-0">Recent Announcements</h5>
          <small className="text-muted">Total: {notifications.length}</small>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="content-card text-center py-5">
          <i className="bi bi-bell-slash text-muted" style={{ fontSize: "2.5rem" }}></i>
          <h5 className="mt-3 fw-bold">No Notifications</h5>
          <p className="text-muted">You are all caught up!</p>
        </div>
      ) : (
        <div className="row g-3">
          {notifications.map((n) => (
            <div key={n.id} className="col-12">
              <div
                className={`content-card mb-2 ${
                  n.status === "Unread" ? "border-primary" : ""
                }`}
              >
                <div className="content-card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background: n.status === "Unread" ? "#e0f2fe" : "#f1f5f9",
                        color: n.status === "Unread" ? "var(--primary)" : "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        flexShrink: 0,
                      }}
                    >
                      <i className="bi bi-megaphone-fill"></i>
                    </div>

                    <div>
                      <p className="m-0 fw-semibold" style={{ fontSize: "0.95rem" }}>
                        {n.message}
                      </p>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <div>
                    {n.status === "Unread" ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleMarkRead(n.id)}
                      >
                        <i className="bi bi-check2 me-1"></i> Mark as Read
                      </button>
                    ) : (
                      <span className="status-badge approved">
                        <i className="bi bi-check-all"></i> Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
}

export default Notifications;
