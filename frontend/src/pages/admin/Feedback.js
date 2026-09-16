import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getFeedback } from "../../services/adminService";

function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const res = await getFeedback();
      if (res.success && res.feedback) {
        setFeedbackList(res.feedback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="User Feedback Inbox"
      subtitle="Review suggestions, reports, and experiences submitted by community members"
    >
      <div className="content-card">
        <div className="content-card-header flex-wrap gap-2">
          <h5 className="content-card-title">
            <i className="bi bi-chat-left-heart text-primary me-2"></i>
            Feedback Submissions ({feedbackList.length})
          </h5>
          <button
            className="btn btn-outline-custom btn-sm"
            onClick={loadFeedback}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading feedback...</p>
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-chat-dots text-muted" style={{ fontSize: "2.5rem" }}></i>
            <h5 className="mt-3 fw-bold">No Feedback Received Yet</h5>
            <p className="text-muted">User submissions will appear here once submitted.</p>
          </div>
        ) : (
          <div className="content-card-body p-0">
            <div className="list-group list-group-flush">
              {feedbackList.map((f) => (
                <div key={f.id} className="list-group-item p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "#e0f2fe",
                          color: "#0284c7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                        }}
                      >
                        {f.user_name ? f.user_name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <h6 className="m-0 fw-bold">{f.user_name || "Community Member"}</h6>
                        <small className="text-muted">
                          {f.user_email} • {f.user_phone || "No phone"}
                        </small>
                      </div>
                    </div>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      {new Date(f.created_at).toLocaleString()}
                    </small>
                  </div>

                  <div className="p-3 bg-light rounded border text-dark mt-2" style={{ lineHeight: 1.6 }}>
                    {f.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminFeedback;
