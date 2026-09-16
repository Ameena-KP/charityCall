import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layout/UserLayout";
import { createCharityRequest } from "../../services/charityService";

function CreateRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "Food",
    required_items: "",
    description: "",
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const categories = ["Food", "Clothing", "Medicine", "Education", "Shelter", "Medical", "Other"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.title || !formData.description) {
      setMessage({ text: "Please enter a title and description.", type: "danger" });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("required_items", formData.required_items);
    data.append("description", formData.description);
    if (documentFile) {
      data.append("document", documentFile);
    }

    try {
      setSubmitting(true);
      const res = await createCharityRequest(data);
      if (res.success) {
        setMessage({
          text: "Charity request submitted successfully! Our verification team will review your proof document shortly.",
          type: "success",
        });
        setTimeout(() => {
          navigate("/user/my-requests");
        }, 1800);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to submit charity request.",
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserLayout
      title="Request Assistance"
      subtitle="Submit an aid request with required items and supporting verification documents"
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="content-card">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-file-earmark-plus text-primary me-2"></i>
                Charity Request Application
              </h5>
            </div>

            <div className="content-card-body">
              {message.text && (
                <div className={`alert alert-${message.type} d-flex align-items-center gap-2 mb-4`}>
                  <i className={`bi ${message.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
                  <div>{message.text}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Request Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Monthly Grocery Support for Low-Income Family"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      Aid Category <span className="text-danger">*</span>
                    </label>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      Specific Items Needed <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="required_items"
                      className="form-control"
                      placeholder="e.g. Rice 10kg, Cooking Oil 2L, Blankets (3)"
                      value={formData.required_items}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      List items and quantities so donors can pledge exact needs.
                    </small>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Detailed Explanation of Need <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Describe your current circumstances, reason for need, and how this aid will help..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">
                    Upload Supporting Document (Proof / Verification)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted d-block mt-1" style={{ fontSize: "0.75rem" }}>
                    Accepted formats: PDF, PNG, JPG (Medical certificates, income slips, ration cards, hospital bills).
                  </small>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/user/my-requests")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-1"></i> Submit for Verification
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

export default CreateRequest;
