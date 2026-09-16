import React, { useEffect, useState } from "react";
import TeamLayout from "../../layout/TeamLayout";
import { getTeamDonations, completeTeamDonation } from "../../services/teamService";

function TeamDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const res = await getTeamDonations();
      if (res.success && res.donations) {
        setDonations(res.donations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Mark this donation pledge as completed/handed over to beneficiary?")) return;
    try {
      setUpdatingId(id);
      await completeTeamDonation(id);
      setDonations(
        donations.map((d) =>
          d.id === id ? { ...d, donation_status: "Completed" } : d
        )
      );
    } catch (err) {
      alert("Failed to update donation status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <TeamLayout
      title="Manage Donations"
      subtitle="Coordinate with donors and beneficiaries to confirm item receipt and delivery"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold m-0">All Donor Pledges</h5>
          <small className="text-muted">Total Pledges Logged: {donations.length}</small>
        </div>
        <button
          className="btn btn-outline-custom btn-sm"
          onClick={loadDonations}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading donations log...</p>
        </div>
      ) : donations.length === 0 ? (
        <div className="content-card text-center py-5">
          <i className="bi bi-box2 text-muted" style={{ fontSize: "2.5rem" }}></i>
          <h5 className="mt-3 fw-bold">No Donations Recorded Yet</h5>
          <p className="text-muted">When donors pledge items for approved appeals, they appear here.</p>
        </div>
      ) : (
        <div className="content-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Donor Info</th>
                  <th>Associated Appeal</th>
                  <th>Item Pledged</th>
                  <th>Quantity</th>
                  <th>Current Status</th>
                  <th>Pledge Date</th>
                  <th className="text-end">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td className="text-muted">#{d.id}</td>
                    <td>
                      <div className="fw-semibold">{d.donor_name || "Anonymous Donor"}</div>
                      <small className="text-muted d-block">{d.donor_email}</small>
                      <small className="text-muted">{d.donor_phone}</small>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{d.title}</div>
                      <span className="category-tag mt-1">{d.category || "General"}</span>
                    </td>
                    <td>
                      <strong>{d.item_name}</strong>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {d.quantity} units
                      </span>
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
                    <td className="text-end">
                      {d.donation_status === "Pending" ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleComplete(d.id)}
                          disabled={updatingId === d.id}
                        >
                          <i className="bi bi-check2-circle me-1"></i> Mark Delivered
                        </button>
                      ) : (
                        <span className="text-success small fw-semibold">
                          <i className="bi bi-check-all"></i> Fulfilled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </TeamLayout>
  );
}

export default TeamDonations;
