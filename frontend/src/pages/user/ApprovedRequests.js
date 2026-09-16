import React, { useEffect, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import { getApprovedRequests } from "../../services/charityService";
import { donateItem } from "../../services/donationService";
import { getAuthUser } from "../../utils/authStorage";

function ApprovedRequests() {
  const currentUser = getAuthUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const categories = ["All", "Food", "Clothing", "Medicine", "Education", "Shelter", "Medical"];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await getApprovedRequests();
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter((r) => {
    // Exclude the logged-in user's own requests (they manage their own requests in "My Requests & Help")
    if (currentUser) {
      if (currentUser.id && Number(r.user_id) === Number(currentUser.id)) {
        return false;
      }
      if (currentUser.email && r.user_email && r.user_email.toLowerCase() === currentUser.email.toLowerCase()) {
        return false;
      }
      if (currentUser.name && r.user_name && r.user_name.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) {
        return false;
      }
    }

    const matchCat =
      categoryFilter === "All" ||
      (r.category && r.category.toLowerCase() === categoryFilter.toLowerCase());
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.required_items && r.required_items.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleOpenDonate = (r) => {
    if (currentUser && Number(r.user_id) === Number(currentUser.id)) {
      alert("You cannot donate to your own charity request.");
      return;
    }
    setSelectedRequest(r);
    setItemName(r.required_items ? r.required_items.split(",")[0].trim() : "");
    setQuantity(1);
    setMessage({ text: "", type: "" });
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!itemName) return;
    setSubmitting(true);
    try {
      const res = await donateItem({
        request_id: selectedRequest.id,
        item_name: itemName,
        quantity: parseInt(quantity) || 1,
      });

      if (res.success) {
        setMessage({ text: "Donation pledge recorded successfully! Check My Donations.", type: "success" });
        setTimeout(() => {
          setSelectedRequest(null);
          setMessage({ text: "", type: "" });
        }, 1800);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to pledge donation.",
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserLayout
      title="Browse Verified Requests"
      subtitle="Support individuals whose needs have been verified by our team"
    >
      {/* Category Pills & Search */}
      <div className="content-card mb-4">
        <div className="content-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-7">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${
                      categoryFilter === cat
                        ? "btn-primary-custom"
                        : "btn-outline-custom"
                    }`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search appeals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading verified requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="content-card text-center py-5">
          <i className="bi bi-inbox text-muted" style={{ fontSize: "2.5rem" }}></i>
          <h5 className="mt-3 fw-bold">No Verified Requests Found</h5>
          <p className="text-muted">
            {categoryFilter !== "All"
              ? `No requests currently found in category "${categoryFilter}".`
              : "Try adjusting your search filters."}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((req) => (
            <div key={req.id} className="col-md-6 col-lg-4">
              <div className="content-card h-100 d-flex flex-column m-0">
                <div className="content-card-header">
                  <span className="category-tag">
                    <i className="bi bi-tag-fill me-1"></i> {req.category || "General"}
                  </span>
                  <span className="status-badge approved">
                    <i className="bi bi-check-circle-fill"></i> Verified
                  </span>
                </div>

                <div className="content-card-body d-flex flex-column flex-grow-1">
                  <h5 className="request-card-title" title={req.title}>
                    {req.title}
                  </h5>
                  <div className="request-card-desc" title={req.description}>
                    {req.description}
                  </div>

                  {req.required_items ? (
                    <div className="needed-items-box">
                      <small className="d-block fw-bold text-secondary mb-1">
                        <i className="bi bi-box-seam me-1"></i> Needed Items:
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

                  <div className="mt-auto border-top pt-2 d-flex justify-content-between text-muted small">
                    <span>
                      <i className="bi bi-person me-1"></i> {req.user_name || "Applicant"}
                    </span>
                    <span>
                      <i className="bi bi-calendar3 me-1"></i>{" "}
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white border-top d-flex gap-2">
                  {req.document && (
                    <a
                      href={`http://localhost:5000/uploads/${req.document}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-custom btn-sm flex-fill"
                    >
                      <i className="bi bi-file-earmark-pdf me-1"></i> Proof
                    </a>
                  )}
                  <button
                    className="btn btn-primary-custom btn-sm flex-fill"
                    onClick={() => handleOpenDonate(req)}
                  >
                    <i className="bi bi-heart-fill me-1"></i> Donate Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Donate Pledge Modal */}
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
                  <i className="bi bi-heart-fill me-2"></i> Pledge Donation
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>

              <form onSubmit={handleDonate}>
                <div className="modal-body p-4">
                  {message.text && (
                    <div className={`alert alert-${message.type} small mb-3`}>
                      {message.text}
                    </div>
                  )}

                  <div className="p-3 bg-light rounded border mb-3">
                    <h6 className="fw-bold mb-1 text-primary text-break" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                      {selectedRequest.title}
                    </h6>
                    <div className="small text-muted mb-1 text-break" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                      <strong>Category:</strong> {selectedRequest.category}
                    </div>
                    {selectedRequest.description && (
                      <div className="small text-muted mb-1 text-break" style={{ wordBreak: "break-word", overflowWrap: "anywhere", maxHeight: "100px", overflowY: "auto" }}>
                        <strong>Description:</strong> {selectedRequest.description}
                      </div>
                    )}
                    {selectedRequest.required_items && (
                      <div className="small text-muted text-break" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                        <strong>Requested:</strong> {selectedRequest.required_items}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Item Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rice, Blankets, Medicines"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Quantity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>

                  <p className="text-muted small mb-0">
                    <i className="bi bi-info-circle me-1"></i> By pledging, you agree to coordinate the delivery with the verification team.
                  </p>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedRequest(null)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-custom btn-sm"
                    disabled={submitting}
                  >
                    {submitting ? "Pledging..." : "Confirm Donation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default ApprovedRequests;
