import React, { useState } from "react";
import UserLayout from "../../layout/UserLayout";
import { submitFeedback } from "../../services/userService";

function Feedback() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setAlertInfo({ text: "", type: "" });

    try {
      const res = await submitFeedback(message);
      if (res.success) {
        setAlertInfo({ text: res.message, type: "success" });
        setMessage("");
      }
    } catch (err) {
      setAlertInfo({
        text: err.response?.data?.message || "Failed to submit feedback.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout
      title="Provide Feedback"
      subtitle="Share your suggestions, complaints, or compliments to help us improve the platform"
    >
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="content-card">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-chat-heart text-primary me-2"></i>
                We Value Your Feedback
              </h5>
            </div>

            <div className="content-card-body">
              {alertInfo.text && (
                <div className={`alert alert-${alertInfo.type} d-flex align-items-center gap-2 mb-3`}>
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

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Your Message / Suggestion <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Tell us about your experience, suggestions for new features, or any issues you encountered..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4"
                    disabled={loading || !message.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-1"></i> Send Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Feedback;
