import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { registerUser } from "../../services/userService";
import { registerTeam } from "../../services/teamService";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateAddress,
  sanitizePhoneInput,
} from "../../utils/validators";

function Register() {
  const navigate = useNavigate();
  const [roleType, setRoleType] = useState("user"); // 'user' | 'team'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      case "password":
        return validatePassword(value, 6);
      case "address":
        return roleType === "user" ? validateAddress(value, 6) : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "phone" ? sanitizePhoneInput(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, finalValue),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateAll = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password, 6),
      address: roleType === "user" ? validateAddress(formData.address, 6) : "",
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      address: true,
    });

    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const isValid = validateAll();
    if (!isValid) {
      setErrorMsg("Please fix the errors in the form before submitting.");
      return;
    }

    setLoading(true);

    try {
      if (roleType === "user") {
        const res = await registerUser(formData);
        if (res.success) {
          setSuccessMsg("User registration successful! Redirecting to login...");
          setTimeout(() => navigate("/login"), 1500);
        }
      } else {
        const res = await registerTeam({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        if (res.success) {
          setSuccessMsg(
            "Volunteer registration submitted! Your account is pending admin approval."
          );
          setTimeout(() => navigate("/login"), 2500);
        }
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Registration failed. Please check your information."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <div className="auth-page-wrapper flex-grow-1">
        <div className="auth-box" style={{ maxWidth: "500px" }}>
          <div className="auth-header">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.2)",
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: "1.5rem",
              }}
            >
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <h3 className="fw-bold m-0">Create an Account</h3>
            <p className="text-light opacity-75 small m-0 mt-1">
              Join Charity Connect and be part of transparent aid
            </p>
          </div>

          <div className="auth-body">
            {/* Role Switcher */}
            <div className="role-tabs mb-4">
              <button
                type="button"
                className={`role-tab-btn ${roleType === "user" ? "active" : ""}`}
                onClick={() => {
                  setRoleType("user");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                <i className="bi bi-person me-1"></i> Donor / Beneficiary
              </button>
              <button
                type="button"
                className={`role-tab-btn ${roleType === "team" ? "active" : ""}`}
                onClick={() => {
                  setRoleType("team");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                <i className="bi bi-shield-check me-1"></i> Volunteer
              </button>
            </div>

            {roleType === "team" && (
              <div className="alert alert-info py-2 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <div>
                  <strong>Notice:</strong> Volunteer accounts require verification and approval by the platform administrator before login.
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill"></i>
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Full Name <span className="text-danger">*</span></label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-person text-muted"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${touched.name ? (errors.name ? "is-invalid" : "is-valid") : ""}`}
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.name && errors.name && (
                    <div className="invalid-feedback d-block">{errors.name}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address <span className="text-danger">*</span></label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${touched.email ? (errors.email ? "is-invalid" : "is-valid") : ""}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.email && errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label fw-semibold small mb-1">
                    Mobile Number <span className="text-danger">*</span>
                  </label>
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    10 digits only
                  </small>
                </div>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-telephone text-muted"></i>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    className={`form-control ${touched.phone ? (errors.phone ? "is-invalid" : "is-valid") : ""}`}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.phone && errors.phone && (
                    <div className="invalid-feedback d-block">{errors.phone}</div>
                  )}
                </div>
              </div>

              {roleType === "user" && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Residential Address <span className="text-danger">*</span></label>
                  <div className="input-group has-validation">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-geo-alt text-muted"></i>
                    </span>
                    <textarea
                      name="address"
                      className={`form-control ${touched.address ? (errors.address ? "is-invalid" : "is-valid") : ""}`}
                      rows="2"
                      placeholder="Street, City, Postal Code"
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    ></textarea>
                    {touched.address && errors.address && (
                      <div className="invalid-feedback d-block">{errors.address}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label fw-semibold small mb-1">Password <span className="text-danger">*</span></label>
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    Min. 6 characters
                  </small>
                </div>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-key text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${touched.password ? (errors.password ? "is-invalid" : "is-valid") : ""}`}
                    placeholder="Create a strong password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.password && errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check me-2"></i>
                    Register as {roleType === "team" ? "Team Volunteer" : "User"}
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 text-center small text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;