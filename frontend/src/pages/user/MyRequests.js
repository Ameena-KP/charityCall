import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../../layout/UserLayout";
import { getMyRequests } from "../../services/charityService";
import { getReceivedDonations } from "../../services/donationService";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [receivedDonations, setReceivedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests"); // 'requests' | 'received'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reqRes, donRes] = await Promise.all([
        getMyRequests(),
        getReceivedDonations(),
      ]);

      if (reqRes.success) setRequests(reqRes.requests);
      if (donRes.success) setReceivedDonations(donRes.donations);
    } catch (err) {
      console.error("Error loading user requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return (
        <span className="status-badge approved">
          <i className="bi bi-check-circle-fill"></i> Approved & Published
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="status-badge rejected">
          <i className="bi bi-x-circle-fill"></i> Rejected
        </span>
      );
    }
    return (
      <span className="status-badge pending">
        <i className="bi bi-hourglass-split"></i> Pending Verification
      </span>
    );
  };

  const renderRequestsContent = () => {
    if (requests.length === 0) {
      return (
        <div className="content-card text-center py-5">
          <i className="bi bi-clipboard2-check text-muted" style={{ fontSize: "2.5rem" }}></i>
          <h5 className="mt-3 fw-bold">No Requests Submitted Yet</h5>
          <p className="text-muted">You have not submitted any aid requests yet.</p>
          <Link to="/user/create-request" className="btn btn-primary-custom btn-sm">
            Submit Your First Request
          </Link>
        </div>
      );
    }

    return (
      <div className="row g-3">
        {requests.map((r) => (
          <div key={r.id} className="col-12">
            <div className="content-card mb-2">
              <div className="content-card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="category-tag">{r.category}</span>
                      <h5 className="fw-bold m-0">{r.title}</h5>
                    </div>
                    <small className="text-muted">
                      Submitted on {new Date(r.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <div>{getStatusBadge(r.status)}</div>
                </div>

                <p className="text-muted mb-2 text-break" style={{ fontSize: "0.9rem", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  {r.description}
                </p>

                {r.required_items && (
                  <div className="p-2 bg-light rounded border mb-2 small">
                    <strong>Requested Items:</strong>{" "}
                    <span className="text-primary fw-semibold">{r.required_items}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                  <div>
                    {r.document ? (
                      <a
                        href={`http://localhost:5000/uploads/${r.document}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <i className="bi bi-file-earmark-pdf me-1"></i> View Verification Proof
                      </a>
                    ) : (
                      <span className="text-muted small">No proof document uploaded</span>
                    )}
                  </div>

                  <div className="small text-muted">
                    Request ID: #{r.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReceivedDonationsContent = () => {
    if (receivedDonations.length === 0) {
      return (
        <div className="content-card text-center py-5">
          <i className="bi bi-box2 text-muted" style={{ fontSize: "2.5rem" }}></i>
          <h5 className="mt-3 fw-bold">No Donations Received Yet</h5>
          <p className="text-muted">
            Once your request is approved and donors pledge items, they will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Appeal Title</th>
                <th>Item Donated</th>
                <th>Quantity</th>
                <th>Donor Details</th>
                <th>Donation Status</th>
                <th>Pledge Date</th>
              </tr>
            </thead>
            <tbody>
              {receivedDonations.map((d) => (
                <tr key={d.id}>
                  <td className="fw-semibold text-primary">{d.request_title}</td>
                  <td>
                    <strong>{d.item_name}</strong>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border px-2 py-1">
                      {d.quantity} units
                    </span>
                  </td>
                  <td>
                    <div>{d.donor_name}</div>
                    <small className="text-muted">{d.donor_phone || d.donor_email}</small>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        d.donation_status === "Completed" ? "completed" : "pending"
                      }`}
                    >
                      {d.donation_status}
                    </span>
                  </td>
                  <td>{new Date(d.donated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <UserLayout
      title="My Requests & Received Aid"
      subtitle="Track your submitted charity requests and monitor received donor pledges"
    >
      {/* Top Action & Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="role-tabs m-0">
          <button
            type="button"
            className={`role-tab-btn px-3 ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            <i className="bi bi-file-earmark-text me-1"></i> My Requests ({requests.length})
          </button>
          <button
            type="button"
            className={`role-tab-btn px-3 ${activeTab === "received" ? "active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            <i className="bi bi-gift me-1"></i> Received Donations ({receivedDonations.length})
          </button>
        </div>

        <Link to="/user/create-request" className="btn btn-primary-custom btn-sm">
          <i className="bi bi-plus-lg me-1"></i> Create New Request
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading your requests...</p>
        </div>
      ) : (
        activeTab === "requests" ? renderRequestsContent() : renderReceivedDonationsContent()
      )}
    </UserLayout>
  );
}

export default MyRequests;
