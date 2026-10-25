import React, { useState } from "react";
import UserLayout from "../../layout/UserLayout";
import { submitFeedback } from "../../services/userService";
import { validateDescription } from "../../utils/validators";

function Feedback() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ text: "", type: "" });

  const validate = (val) => {
    return validateDescription(val, 10, 1000);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    if (touched) {
      setError(validate(val));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(message));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validate(message);
    setError(err);

    if (err) {
      setAlertInfo({ text: err, type: "danger" });
      return;
    }

    setLoading(true);
    setAlertInfo({ text: "", type: "" });

    try {
      const res = await submitFeedback(message.trim());
      if (res.success) {
        setAlertInfo({ text: res.message || "Feedback submitted successfully!", type: "success" });
        setMessage("");
        setTouched(false);
        setError("");
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

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-semibold small mb-1">
                      Your Message / Suggestion <span className="text-danger">*</span>
                    </label>
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Min. 10 chars ({message.length}/1000)
                    </small>
                  </div>
                  <textarea
                    className={`form-control ${touched ? (error ? "is-invalid" : "is-valid") : ""}`}
                    rows="5"
                    maxLength={1000}
                    placeholder="Tell us about your experience, suggestions for new features, or any issues you encountered..."
                    value={message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                  {touched && error && (
                    <div className="invalid-feedback d-block">{error}</div>
                  )}
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
