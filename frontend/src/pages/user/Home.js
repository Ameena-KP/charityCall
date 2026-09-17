import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getApprovedRequests } from "../../services/charityService";
import { getAuthUser } from "../../utils/authStorage";

function Home() {
  const currentUser = getAuthUser();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  // Modals state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Quick feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    message: "",
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const categories = [
    {
      name: "Food & Groceries",
      icon: "bi-basket2-fill",
      desc: "Essential nutritional rations and dry food support for vulnerable families.",
      color: "#f59e0b",
      badge: "Food",
    },
    {
      name: "Clothing & Apparel",
      icon: "bi-tag-fill",
      desc: "Warm clothing, seasonal wear, and school uniforms for children and elderly.",
      color: "#0284c7",
      badge: "Clothing",
    },
    {
      name: "Medicine & Healthcare",
      icon: "bi-capsule",
      desc: "Critical prescription medications, medical aids, and emergency treatment support.",
      color: "#ef4444",
      badge: "Medicine",
    },
    {
      name: "Education & Books",
      icon: "bi-mortarboard-fill",
      desc: "Academic textbooks, stationery, and learning materials for deserving students.",
      color: "#8b5cf6",
      badge: "Education",
    },
    {
      name: "Shelter & Living",
      icon: "bi-house-heart-fill",
      desc: "Blankets, household essentials, and rehabilitation provisions for displaced persons.",
      color: "#10b981",
      badge: "Shelter",
    },
    {
      name: "Emergency Relief",
      icon: "bi-shield-exclamation",
      desc: "Immediate relief resources for disaster recovery and crisis assistance.",
      color: "#ec4899",
      badge: "Emergency",
    },
  ];

  useEffect(() => {
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    try {
      const res = await getApprovedRequests();
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error("Error fetching requests count:", err);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) return;
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setShowFeedbackModal(false);
      setFeedbackForm((prev) => ({ ...prev, message: "" }));
    }, 1600);
  };

  return (
    <div className="home-fixed-viewport">
      {/* Top Navigation */}
      <Navbar
        onOpenVerification={() => setShowVerificationModal(true)}
        onOpenCategories={() => setShowCategoriesModal(true)}
      />

      {/* Hero & Stats Fullscreen Main Section */}
      <main className="hero-fullscreen-container">
        {/* Ambient Glowing Background Lights */}
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="hero-content-inner">
          {/* Tagline Badge */}
          <div className="hero-tagline">
            <i className="bi bi-shield-check me-2"></i>
            100% VERIFIED CHARITY NETWORK
          </div>

          {/* Headline */}
          <h1 className="hero-title">
            Empowering Communities Through <br />
            <span>Transparent Giving</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Charity Connect connects compassionate donors with verified individuals
            who genuinely need support. Every charity request is verified by our dedicated
            team before being published.
          </p>

          {/* Action Call-to-Actions */}
          <div className="d-flex flex-wrap justify-content-center gap-3 hero-action-buttons">
            <Link to="/user/browse" className="btn btn-primary-custom btn-lg">
              <i className="bi bi-heart-fill me-2"></i> Browse &amp; Donate
            </Link>
            <Link to="/user/create-request" className="btn btn-outline-light btn-lg">
              <i className="bi bi-plus-circle me-2"></i> Request Assistance
            </Link>
            <Link to="/register" className="btn btn-outline-info btn-lg">
              <i className="bi bi-people me-2"></i> Join as Volunteer
            </Link>
          </div>

          {/* Impact Stats Row */}
          <div className="row g-3 justify-content-center hero-stats-row">
            <div className="col-6 col-md-3">
              <div className="impact-counter-card">
                <div className="impact-number">
                  {requests.length > 0 ? `${requests.length}+` : "7+"}
                </div>
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
      </main>

      {/* Fixed Contacts Footer */}
      <footer className="home-contacts-footer">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2 text-center text-lg-start">
            {/* Left: Brand & Guarantee */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-secondary">
                &copy; {new Date().getFullYear()}{" "}
                <strong className="text-light">Charity Connect</strong> &bull; Direct &amp; Transparent Giving
              </span>
            </div>

            {/* Center: Contact Details Pills */}
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
              <a
                href="mailto:support@charityconnect.org"
                className="contact-pill text-light text-decoration-none"
                title="Send an email to support"
              >
                <i className="bi bi-envelope-fill text-info me-1"></i>
                <span>support@charityconnect.org</span>
              </a>

              <a
                href="tel:+919876543210"
                className="contact-pill text-light text-decoration-none"
                title="Call charity support helpline"
              >
                <i className="bi bi-telephone-fill text-success me-1"></i>
                <span>+91 98765 43210</span>
              </a>

              <span className="contact-pill text-light" title="Central Office Location">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                <span>Central Charity Hub, Kerala, India</span>
              </span>

              <span className="contact-pill text-light d-none d-md-inline-flex" title="Team Availability">
                <i className="bi bi-clock-fill text-warning me-1"></i>
                <span>24/7 Verification Support</span>
              </span>
            </div>

            {/* Right: Quick Action Social & Direct Contact Icons */}
            <div className="d-flex align-items-center gap-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn whatsapp"
                title="Chat with support on WhatsApp"
              >
                <i className="bi bi-whatsapp"></i>
              </a>
              <a
                href="mailto:support@charityconnect.org"
                className="social-icon-btn email"
                title="Email Us Directly"
              >
                <i className="bi bi-envelope"></i>
              </a>
              <button
                type="button"
                onClick={() => setShowFeedbackModal(true)}
                className="social-icon-btn feedback"
                title="Send Feedback / Inquiry"
              >
                <i className="bi bi-chat-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 1. Verification Process Modal */}
      {/* ========================================================= */}
      {showVerificationModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(11, 17, 32, 0.85)", backdropFilter: "blur(6px)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary shadow-lg">
              <div className="modal-header border-secondary">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    <i className="bi bi-shield-check text-white"></i>
                  </div>
                  <h5 className="modal-title fw-bold mb-0">Our 3-Tier Verification Process</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowVerificationModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="text-secondary small mb-4">
                  Every request submitted to Charity Connect undergoes stringent documentary and human inspection to protect donors and guarantee legitimate community impact.
                </p>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="p-3 rounded-3 h-100" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-primary rounded-circle p-2">1</span>
                        <h6 className="fw-bold mb-0 text-white">Request Submission</h6>
                      </div>
                      <p className="small text-secondary mb-0">
                        Beneficiaries detail essential items needed (food, medicines, stationery) and attach supporting documents like ID and income proof.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 rounded-3 h-100" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-info rounded-circle p-2">2</span>
                        <h6 className="fw-bold mb-0 text-white">Team Verification</h6>
                      </div>
                      <p className="small text-secondary mb-0">
                        Our designated verification team reviews user authenticity, checks documentation, and verifies need before granting public approval.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 rounded-3 h-100" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-success rounded-circle p-2">3</span>
                        <h6 className="fw-bold mb-0 text-white">Direct Giving</h6>
                      </div>
                      <p className="small text-secondary mb-0">
                        Compassionate donors discover verified needs, pledge items directly, and track status with zero intermediary commission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setShowVerificationModal(false)}
                >
                  Close
                </button>
                <Link
                  to="/user/browse"
                  className="btn btn-primary-custom"
                  onClick={() => setShowVerificationModal(false)}
                >
                  <i className="bi bi-gift me-1"></i> Browse Verified Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. Categories Modal */}
      {/* ========================================================= */}
      {showCategoriesModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(11, 17, 32, 0.85)", backdropFilter: "blur(6px)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary shadow-lg">
              <div className="modal-header border-secondary">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    <i className="bi bi-grid-fill text-white"></i>
                  </div>
                  <h5 className="modal-title fw-bold mb-0">Aid Categories</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCategoriesModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="text-secondary small mb-4">
                  Browse requests by category to direct your support where it is needed most.
                </p>

                <div className="row g-3">
                  {categories.map((cat, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div
                        className="p-3 rounded-3 h-100 d-flex align-items-start gap-3"
                        style={{
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => {
                          setShowCategoriesModal(false);
                          navigate("/user/browse");
                        }}
                      >
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            background: `rgba(${cat.color === "#f59e0b" ? "245, 158, 11" : cat.color === "#0284c7" ? "2, 132, 199" : cat.color === "#ef4444" ? "239, 68, 68" : cat.color === "#8b5cf6" ? "139, 92, 246" : cat.color === "#10b981" ? "16, 185, 129" : "236, 72, 153"}, 0.15)`,
                            color: cat.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.3rem",
                            flexShrink: 0,
                          }}
                        >
                          <i className={`bi ${cat.icon}`}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold text-white mb-1">{cat.name}</h6>
                          <p className="small text-secondary mb-2">{cat.desc}</p>
                          <span className="badge bg-secondary text-light">
                            Explore {cat.badge} &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setShowCategoriesModal(false)}
                >
                  Close
                </button>
                <Link
                  to="/user/browse"
                  className="btn btn-primary-custom"
                  onClick={() => setShowCategoriesModal(false)}
                >
                  <i className="bi bi-gift me-1"></i> View All Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Contact / Feedback Modal */}
      {/* ========================================================= */}
      {showFeedbackModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(11, 17, 32, 0.85)", backdropFilter: "blur(6px)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary shadow-lg">
              <div className="modal-header border-secondary">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i className="bi bi-chat-heart text-white"></i>
                  </div>
                  <h5 className="modal-title fw-bold mb-0">Contact Support &amp; Feedback</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowFeedbackModal(false)}
                ></button>
              </div>

              <form onSubmit={handleFeedbackSubmit}>
                <div className="modal-body p-4">
                  {feedbackSuccess ? (
                    <div className="alert alert-success text-center py-3 mb-0">
                      <i className="bi bi-check-circle-fill fs-3 d-block mb-2 text-success"></i>
                      <strong>Thank you for reaching out!</strong>
                      <p className="small mb-0 mt-1">Our support team will review your inquiry shortly.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label className="form-label small text-secondary">Your Name</label>
                        <input
                          type="text"
                          className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                          placeholder="e.g. John Doe"
                          value={feedbackForm.name}
                          onChange={(e) =>
                            setFeedbackForm({ ...feedbackForm, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small text-secondary">Email Address</label>
                        <input
                          type="email"
                          className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                          placeholder="name@example.com"
                          value={feedbackForm.email}
                          onChange={(e) =>
                            setFeedbackForm({ ...feedbackForm, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small text-secondary">Message / Query</label>
                        <textarea
                          rows="4"
                          className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                          placeholder="How can we assist you or what would you like to share?"
                          value={feedbackForm.message}
                          onChange={(e) =>
                            setFeedbackForm({ ...feedbackForm, message: e.target.value })
                          }
                          required
                        ></textarea>
                      </div>
                      <div className="p-2 rounded bg-secondary bg-opacity-10 border border-secondary border-opacity-25 text-secondary small">
                        <i className="bi bi-shield-lock me-1"></i>
                        Direct hotline: <strong className="text-white">+91 98765 43210</strong> (24/7)
                      </div>
                    </>
                  )}
                </div>

                {!feedbackSuccess && (
                  <div className="modal-footer border-secondary">
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      onClick={() => setShowFeedbackModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary-custom">
                      <i className="bi bi-send me-1"></i> Submit Message
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;