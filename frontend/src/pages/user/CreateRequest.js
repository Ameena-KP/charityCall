import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layout/UserLayout";
import { createCharityRequest } from "../../services/charityService";
import {
  validateTitle,
  validateItemName,
  validateDescription,
  validateDocumentFile,
} from "../../utils/validators";

function CreateRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "Food",
    required_items: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [documentFile, setDocumentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const categories = ["Food", "Clothing", "Medicine", "Education", "Shelter", "Medical", "Other"];

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        return validateTitle(value, 5, 150);
      case "required_items":
        return validateItemName(value, 3, 200);
      case "description":
        return validateDescription(value, 15, 2000);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileErr = validateDocumentFile(file, ["pdf", "png", "jpg", "jpeg"], 5);
      if (fileErr) {
        setErrors((prev) => ({ ...prev, document: fileErr }));
        setDocumentFile(null);
        e.target.value = "";
      } else {
        setErrors((prev) => ({ ...prev, document: "" }));
        setDocumentFile(file);
      }
    } else {
      setDocumentFile(null);
      setErrors((prev) => ({ ...prev, document: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const titleErr = validateTitle(formData.title, 5, 150);
    const itemsErr = validateItemName(formData.required_items, 3, 200);
    const descErr = validateDescription(formData.description, 15, 2000);
    const fileErr = documentFile
      ? validateDocumentFile(documentFile, ["pdf", "png", "jpg", "jpeg"], 5)
      : "";

    setErrors({
      title: titleErr,
      required_items: itemsErr,
      description: descErr,
      document: fileErr,
    });
    setTouched({
      title: true,
      required_items: true,
      description: true,
      document: true,
    });

    if (titleErr || itemsErr || descErr || fileErr) {
      setMessage({
        text: "Please correct the errors in the application before submitting.",
        type: "danger",
      });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("category", formData.category);
    data.append("required_items", formData.required_items.trim());
    data.append("description", formData.description.trim());
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

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-semibold small mb-1">
                      Request Title <span className="text-danger">*</span>
                    </label>
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Min. 5 characters
                    </small>
                  </div>
                  <input
                    type="text"
                    name="title"
                    className={`form-control ${touched.title ? (errors.title ? "is-invalid" : "is-valid") : ""}`}
                    placeholder="e.g. Monthly Grocery Support for Low-Income Family"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={() => handleBlur("title")}
                    required
                  />
                  {touched.title && errors.title && (
                    <div className="invalid-feedback d-block">{errors.title}</div>
                  )}
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
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label fw-semibold small mb-1">
                        Specific Items Needed <span className="text-danger">*</span>
                      </label>
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Min. 3 characters
                      </small>
                    </div>
                    <input
                      type="text"
                      name="required_items"
                      className={`form-control ${touched.required_items ? (errors.required_items ? "is-invalid" : "is-valid") : ""}`}
                      placeholder="e.g. Rice 10kg, Cooking Oil 2L, Blankets (3)"
                      value={formData.required_items}
                      onChange={handleChange}
                      onBlur={() => handleBlur("required_items")}
                      required
                    />
                    {touched.required_items && errors.required_items ? (
                      <div className="invalid-feedback d-block">{errors.required_items}</div>
                    ) : (
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                        List items and quantities so donors can pledge exact needs.
                      </small>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-semibold small mb-1">
                      Detailed Explanation of Need <span className="text-danger">*</span>
                    </label>
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Min. 15 characters
                    </small>
                  </div>
                  <textarea
                    name="description"
                    className={`form-control ${touched.description ? (errors.description ? "is-invalid" : "is-valid") : ""}`}
                    rows="4"
                    placeholder="Describe your current circumstances, reason for need, and how this aid will help..."
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={() => handleBlur("description")}
                    required
                  ></textarea>
                  {touched.description && errors.description && (
                    <div className="invalid-feedback d-block">{errors.description}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">
                    Upload Supporting Document (Proof / Verification)
                  </label>
                  <input
                    type="file"
                    className={`form-control ${errors.document ? "is-invalid" : ""}`}
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                  {errors.document ? (
                    <div className="invalid-feedback d-block">{errors.document}</div>
                  ) : (
                    <small className="text-muted d-block mt-1" style={{ fontSize: "0.75rem" }}>
                      Accepted formats: PDF, PNG, JPG under 5MB (Medical certificates, income slips, ration cards, hospital bills).
                    </small>
                  )}
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
