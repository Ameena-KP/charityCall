import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { registerUser } from "../../services/userService";
import { registerTeam } from "../../services/teamService";

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
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
            "Team registration submitted! Your account is pending admin approval."
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
                <i className="bi bi-shield-check me-1"></i> Team Volunteer
              </button>
            </div>

            {roleType === "team" && (
              <div className="alert alert-info py-2 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <div>
                  <strong>Notice:</strong> Team volunteer accounts require verification and approval by the platform administrator before login.
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

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Full Name <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-person text-muted"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Phone Number <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-telephone text-muted"></i>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {roleType === "user" && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Residential Address <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-geo-alt text-muted"></i>
                    </span>
                    <textarea
                      name="address"
                      className="form-control"
                      rows="2"
                      placeholder="Street, City, Postal Code"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold small">Password <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-key text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
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