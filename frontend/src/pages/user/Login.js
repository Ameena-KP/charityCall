import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { loginUser } from "../../services/userService";
import { loginTeam } from "../../services/teamService";
import { loginAdmin } from "../../services/adminService";
import { setAuthSession } from "../../utils/authStorage";

function Login() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("user"); // 'user' | 'team' | 'admin'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let res;
      if (activeRole === "user") {
        res = await loginUser({ email, password });
      } else if (activeRole === "team") {
        res = await loginTeam({ email, password });
      } else {
        res = await loginAdmin({ email, password });
      }

      if (res.success && res.token) {
        const userData = res.user || { name: activeRole.toUpperCase(), email };
        setAuthSession(res.token, activeRole, userData);

        // Navigate to appropriate dashboard
        if (activeRole === "admin") {
          navigate("/admin/dashboard");
        } else if (activeRole === "team") {
          navigate("/team/dashboard");
        } else {
          navigate("/user/browse");
        }
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Login failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Demo credential autofill helper
  const fillDemo = (roleType) => {
    setActiveRole(roleType);
    setErrorMsg("");
    if (roleType === "user") {
      setEmail("ameena@gmail.com");
      setPassword("123456");
    } else if (roleType === "team") {
      setEmail("rahul@gmail.com");
      setPassword("123456");
    } else if (roleType === "admin") {
      setEmail("admin@gmail.com");
      setPassword("123456");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <div className="auth-page-wrapper flex-grow-1">
        <div className="auth-box">
          {/* Header */}
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
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h3 className="fw-bold m-0">Welcome Back</h3>
            <p className="text-light opacity-75 small m-0 mt-1">
              Sign in to manage donations and requests
            </p>
          </div>

          {/* Body */}
          <div className="auth-body">
            {/* Role Switcher Tabs */}
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab-btn ${activeRole === "user" ? "active" : ""}`}
                onClick={() => {
                  setActiveRole("user");
                  setErrorMsg("");
                }}
              >
                <i className="bi bi-person me-1"></i> User
              </button>
              <button
                type="button"
                className={`role-tab-btn ${activeRole === "team" ? "active" : ""}`}
                onClick={() => {
                  setActiveRole("team");
                  setErrorMsg("");
                }}
              >
                <i className="bi bi-person-badge me-1"></i> Team
              </button>
              <button
                type="button"
                className={`role-tab-btn ${activeRole === "admin" ? "active" : ""}`}
                onClick={() => {
                  setActiveRole("admin");
                  setErrorMsg("");
                }}
              >
                <i className="bi bi-gear me-1"></i> Admin
              </button>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-key text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In as {activeRole === "admin" ? "Admin" : activeRole === "team" ? "Team Member" : "User"}
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Autofill */}
            <div className="mt-4 pt-3 border-top text-center">
              <small className="text-muted d-block mb-2 fw-semibold">
                Quick Demo Accounts (Click to Fill):
              </small>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => fillDemo("user")}
                >
                  <i className="bi bi-person me-1"></i> User Demo
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => fillDemo("team")}
                >
                  <i className="bi bi-shield-check me-1"></i> Team Demo
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => fillDemo("admin")}
                >
                  <i className="bi bi-gear me-1"></i> Admin Demo
                </button>
              </div>
            </div>

            {/* Registration Link */}
            {activeRole !== "admin" && (
              <div className="mt-3 text-center small text-muted">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary fw-semibold">
                  Register here
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;