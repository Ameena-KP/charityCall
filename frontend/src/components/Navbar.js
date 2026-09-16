import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthToken, getAuthRole, getAuthUser } from "../utils/authStorage";

function Navbar() {
  const navigate = useNavigate();
  const token = getAuthToken();
  const role = getAuthRole();
  const user = getAuthUser();

  const getDashboardPath = () => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "team") return "/team/dashboard";
    return "/user/browse";
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2 border-bottom border-secondary">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: "#fff",
            }}
          >
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <div>
            <span className="fw-bold fs-5 text-white">Charity Connect</span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNav"
          aria-controls="publicNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="publicNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light px-3">
                <i className="bi bi-house me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <a href="/#how-it-works" className="nav-link text-light px-3">
                <i className="bi bi-shield-check me-1"></i> Verification Process
              </a>
            </li>
            <li className="nav-item">
              <a href="/#categories" className="nav-link text-light px-3">
                <i className="bi bi-grid me-1"></i> Categories
              </a>
            </li>
            <li className="nav-item">
              <a href="/#requests" className="nav-link text-light px-3">
                <i className="bi bi-gift me-1"></i> Verified Requests
              </a>
            </li>

            {token ? (
              <li className="nav-item d-flex align-items-center gap-2 ms-lg-3 mt-2 mt-lg-0">
                <Link
                  to={getDashboardPath()}
                  className="btn btn-primary-custom d-flex align-items-center gap-2"
                >
                  <i className="bi bi-layout-sidebar"></i>
                  <span>Go to Portal ({user?.name || role})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm"
                  title="Log Out"
                >
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </li>
            ) : (
              <li className="nav-item d-flex gap-2 ms-lg-3 mt-2 mt-lg-0">
                <Link to="/login" className="btn btn-outline-light px-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-primary-custom px-3">
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;