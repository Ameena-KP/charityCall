import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../../layout/UserLayout";
import { getMyDonations } from "../../services/donationService";

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const res = await getMyDonations();
      if (res.success && res.donations) {
        setDonations(res.donations);
      }
    } catch (err) {
      console.error("Error loading donations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout
      title="My Donation History"
      subtitle="View items pledged and track fulfillment with beneficiaries"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold m-0">Your Giving Contributions</h5>
          <small className="text-muted">Total Pledges: {donations.length}</small>
        </div>
        <Link to="/user/browse" className="btn btn-primary-custom btn-sm">
          <i className="bi bi-heart me-1"></i> Make Another Pledge
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading your donations...</p>
        </div>
      ) : donations.length === 0 ? (
        <div className="content-card text-center py-5">
          <i className="bi bi-gift text-muted" style={{ fontSize: "2.5rem" }}></i>
          <h5 className="mt-3 fw-bold">No Donations Made Yet</h5>
          <p className="text-muted">You haven't made any donation pledges so far.</p>
          <Link to="/user/browse" className="btn btn-primary-custom btn-sm">
            Browse Verified Requests to Donate
          </Link>
        </div>
      ) : (
        <div className="content-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Donation ID</th>
                  <th>Appeal / Cause</th>
                  <th>Item Pledged</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date Pledged</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td className="text-muted">#{d.id}</td>
                    <td className="fw-semibold text-primary">{d.title}</td>
                    <td>
                      <strong>{d.item_name}</strong>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {d.quantity} units
                      </span>
                    </td>
                    <td>
                      <span className="category-tag">{d.category || "General"}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          d.donation_status === "Completed" ? "completed" : "pending"
                        }`}
                      >
                        <i
                          className={`bi ${
                            d.donation_status === "Completed"
                              ? "bi-check-circle-fill"
                              : "bi-clock-history"
                          }`}
                        ></i>{" "}
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
      )}
    </UserLayout>
  );
}

export default MyDonations;
