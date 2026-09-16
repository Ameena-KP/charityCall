import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getApprovedRequests } from "../../services/charityService";
import { donateItem } from "../../services/donationService";
import { getAuthUser } from "../../utils/authStorage";

function Home() {
  const currentUser = getAuthUser();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Donation Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donateFormData, setDonateFormData] = useState({
    item_name: "",
    quantity: 1,
  });
  const [donateSubmitting, setDonateSubmitting] = useState(false);
  const [donateSuccessMsg, setDonateSuccessMsg] = useState("");

  const categories = [
    { name: "All", icon: "bi-grid-fill" },
    { name: "Food", icon: "bi-basket2-fill" },
    { name: "Clothing", icon: "bi-tag-fill" },
    { name: "Medicine", icon: "bi-capsule" },
    { name: "Education", icon: "bi-mortarboard-fill" },
    { name: "Shelter", icon: "bi-house-heart-fill" },
  ];

  useEffect(() => {
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    try {
      setLoading(true);
      const res = await getApprovedRequests();
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    // Exclude logged-in user's own requests from public donation discovery
    if (currentUser) {
      if (currentUser.id && Number(req.user_id) === Number(currentUser.id)) {
        return false;
      }
      if (currentUser.email && req.user_email && req.user_email.toLowerCase() === currentUser.email.toLowerCase()) {
        return false;
      }
      if (currentUser.name && req.user_name && req.user_name.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) {
        return false;
      }
    }

    const matchesCategory =
      selectedCategory === "All" ||
      (req.category &&
        req.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.required_items &&
        req.required_items.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenDonateModal = (req) => {
    if (currentUser && Number(req.user_id) === Number(currentUser.id)) {
      alert("You cannot donate to your own charity request.");
      return;
    }
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      if (
        window.confirm(
          "You need to log in to make a donation pledge. Would you like to go to the login page?"
        )
      ) {
        navigate("/login");
      }
      return;
    }
    setSelectedRequest(req);
    setDonateFormData({
      item_name: req.required_items ? req.required_items.split(",")[0] : "",
      quantity: 1,
    });
    setDonateSuccessMsg("");
  };

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    if (!donateFormData.item_name || donateFormData.quantity < 1) {
      alert("Please specify the item name and quantity");
      return;
    }

    try {
      setDonateSubmitting(true);
      const res = await donateItem({
        request_id: selectedRequest.id,
        item_name: donateFormData.item_name,
        quantity: donateFormData.quantity,
      });

      if (res.success) {
        setDonateSuccessMsg("Donation pledge recorded successfully! Thank you!");
        setTimeout(() => {
          setSelectedRequest(null);
          setDonateSuccessMsg("");
        }, 1800);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit donation pledge.");
    } finally {
      setDonateSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-wrapper text-center">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <span className="hero-tagline">
            <i className="bi bi-shield-check me-1"></i> 100% Verified Charity
            Network
          </span>
          <h1 className="hero-title">
            Empowering Communities Through <br />
            <span>Transparent Giving</span>
          </h1>
          <p className="hero-subtitle">
            Charity Connect connects compassionate donors with verified individuals
            who genuinely need support. Every charity request is verified by our dedicated
            team before being published.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            <a href="#requests" className="btn btn-primary-custom btn-lg px-4 py-2">
              <i className="bi bi-heart-fill me-2"></i> Browse & Donate
            </a>
            <Link to="/user/create-request" className="btn btn-outline-light btn-lg px-4 py-2">
              <i className="bi bi-plus-circle me-2"></i> Request Assistance
            </Link>
            <Link to="/register" className="btn btn-outline-info btn-lg px-4 py-2">
              <i className="bi bi-people me-2"></i> Join as Volunteer
            </Link>
          </div>

          {/* Impact Stats */}
          <div className="row g-3 justify-content-center">
            <div className="col-6 col-md-3">
              <div className="impact-counter-card">
                <div className="impact-number">{requests.length}+</div>
                <p className="impact-text">Verified Requests</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="impact-counter-card">
                <div className="impact-number">5+</div>
                <p className="impact-text">Aid Categories</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="impact-counter-card">
                <div className="impact-number">100%</div>
                <p className="impact-text">Document Verified</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="impact-counter-card">
                <div className="impact-number">0%</div>
                <p className="impact-text">Platform Fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "0.08em" }}>
              Reliable & Fraud-Free
            </span>
            <h2 className="fw-bold fs-2 mt-1">How Charity Connect Works</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Our transparent three-tier verification process ensures all aid reaches the right hands.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="step-card">
                <div className="step-num">1</div>
                <h4 className="fw-bold mb-2">Submit Request</h4>
                <p className="text-muted">
                  Beneficiaries submit their charity needs specifying essential items (food, medicines, books) and upload official verification proof.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card">
                <div className="step-num">2</div>
                <h4 className="fw-bold mb-2">Team Verification</h4>
                <p className="text-muted">
                  Our verification team examines user identity, verifies eligibility and supporting documents, and categorizes the request before approval.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card">
                <div className="step-num">3</div>
                <h4 className="fw-bold mb-2">Direct Donating</h4>
                <p className="text-muted">
                  Donors browse verified requests, pledge essential items, track delivery status, and ensure direct, transparent community impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter Section */}
      <section id="categories" className="py-5 bg-light border-bottom">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold fs-2">Explore Causes by Category</h2>
            <p className="text-muted">
              Choose an area of need to discover active verified requests.
            </p>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`btn d-flex align-items-center gap-2 px-3 py-2 ${
                  selectedCategory === cat.name
                    ? "btn-primary-custom"
                    : "btn-outline-custom"
                }`}
              >
                <i className={`bi ${cat.icon}`}></i>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-6">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search requests by title, description or items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Requests Grid */}
      <section id="requests" className="py-5 flex-grow-1">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h3 className="fw-bold m-0">Verified Active Requests</h3>
              <small className="text-muted">
                Showing {filteredRequests.length} verified appeals
              </small>
            </div>
            <Link to="/user/create-request" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-plus-lg me-1"></i> Submit a New Request
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading verified requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border">
              <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
              <h5 className="mt-3 fw-bold">No Requests Found</h5>
              <p className="text-muted">
                {selectedCategory !== "All"
                  ? `No verified requests currently in category "${selectedCategory}".`
                  : "No charity requests currently match your search criteria."}
              </p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredRequests.map((req) => (
                <div key={req.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border shadow-sm d-flex flex-column">
                    <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                      <span className="category-tag">
                        <i className="bi bi-tag-fill me-1"></i>
                        {req.category || "General"}
                      </span>
                      <span className="status-badge approved">
                        <i className="bi bi-patch-check-fill"></i> Verified
                      </span>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className="request-card-title" title={req.title}>
                        {req.title}
                      </h5>
                      <div className="request-card-desc" title={req.description}>
                        {req.description}
                      </div>

                      {req.required_items ? (
                        <div className="needed-items-box">
                          <small className="d-block fw-bold text-secondary mb-1">
                            <i className="bi bi-box-seam me-1"></i> Required Items:
                          </small>
                          <span className="needed-items-badge">
                            {req.required_items}
                          </span>
                        </div>
                      ) : (
                        <div className="needed-items-box d-flex align-items-center">
                          <small className="text-muted fst-italic">
                            <i className="bi bi-info-circle me-1"></i> General Assistance
                          </small>
                        </div>
                      )}

                      <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center text-muted" style={{ fontSize: "0.8rem" }}>
                        <span>
                          <i className="bi bi-person me-1"></i> {req.user_name || "Applicant"}
                        </span>
                        <span>
                          <i className="bi bi-calendar3 me-1"></i>{" "}
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="card-footer bg-white border-top p-3 d-flex gap-2">
                      {req.document && (
                        <a
                          href={`http://localhost:5000/uploads/${req.document}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-secondary btn-sm flex-fill"
                          title="View Verified Proof Document"
                        >
                          <i className="bi bi-file-earmark-pdf me-1"></i> Proof
                        </a>
                      )}
                      <button
                        className="btn btn-primary-custom btn-sm flex-fill"
                        onClick={() => handleOpenDonateModal(req)}
                      >
                        <i className="bi bi-heart-fill me-1"></i> Donate Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Donate Modal */}
      {selectedRequest && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-heart-fill me-2"></i> Donate to: {selectedRequest.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>

              <form onSubmit={handleDonateSubmit}>
                <div className="modal-body p-4">
                  {donateSuccessMsg ? (
                    <div className="alert alert-success d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill fs-5"></i>
                      <div>{donateSuccessMsg}</div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 p-3 bg-light rounded border">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted small">Category:</span>
                          <span className="fw-semibold">{selectedRequest.category}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted small">Items Requested:</span>
                          <span className="fw-semibold text-primary">
                            {selectedRequest.required_items || "Essential Support"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Item you wish to donate <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Rice 10kg, Blanket, Medicine strip"
                          value={donateFormData.item_name}
                          onChange={(e) =>
                            setDonateFormData({
                              ...donateFormData,
                              item_name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={donateFormData.quantity}
                          onChange={(e) =>
                            setDonateFormData({
                              ...donateFormData,
                              quantity: parseInt(e.target.value) || 1,
                            })
                          }
                          required
                        />
                      </div>

                      <p className="text-muted small mb-0">
                        <i className="bi bi-info-circle me-1"></i> Your donation pledge will be recorded in your dashboard. You can track handover with the verification team.
                      </p>
                    </>
                  )}
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedRequest(null)}
                    disabled={donateSubmitting}
                  >
                    Close
                  </button>
                  {!donateSuccessMsg && (
                    <button
                      type="submit"
                      className="btn btn-primary-custom"
                      disabled={donateSubmitting}
                    >
                      {donateSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-1"></i> Confirm Pledge
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white pt-5 pb-4 border-top border-secondary">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    background: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <i className="bi bi-heart-pulse-fill"></i>
                </div>
                <h5 className="m-0 fw-bold">Charity Connect</h5>
              </div>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                A centralized, secure online charity management system that connects donors with genuine beneficiaries through transparent verification.
              </p>
            </div>

            <div className="col-md-4">
              <h6 className="fw-bold text-uppercase text-primary mb-3">Quick Navigation</h6>
              <ul className="list-unstyled" style={{ fontSize: "0.9rem" }}>
                <li className="mb-2">
                  <Link to="/" className="text-light text-decoration-none">
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/login" className="text-light text-decoration-none">
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Login to Portal
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/register" className="text-light text-decoration-none">
                    <i className="bi bi-chevron-right me-1 text-primary"></i> Register New Account
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-4">
              <h6 className="fw-bold text-uppercase text-primary mb-3">Contact Information</h6>
              <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                <i className="bi bi-envelope me-2 text-primary"></i> support@charityconnect.org
              </p>
              <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                <i className="bi bi-telephone me-2 text-primary"></i> +91 9876543210
              </p>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                <i className="bi bi-geo-alt me-2 text-primary"></i> Bangalore, India
              </p>
            </div>
          </div>

          <div className="border-top border-secondary pt-3 text-center text-muted small">
            © {new Date().getFullYear()} Charity Connect – Online Charity Management System. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;