import React, { useEffect, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import { getProfile, updateProfile } from "../../services/userService";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "",
    created_at: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ text: "", type: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      if (res.success && res.user) {
        setProfile(res.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertInfo({ text: "", type: "" });

    try {
      const res = await updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });

      if (res.success) {
        setAlertInfo({ text: "Profile updated successfully!", type: "success" });
        // update cached user name in sessionStorage and localStorage
        const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.name = profile.name;
          sessionStorage.setItem("user", JSON.stringify(parsed));
          localStorage.setItem("user_user", JSON.stringify(parsed));
        }
      }
    } catch (err) {
      setAlertInfo({
        text: err.response?.data?.message || "Failed to update profile.",
        type: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserLayout
      title="Profile Settings"
      subtitle="Manage your personal contact information and delivery address"
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="content-card">
            <div className="content-card-header">
              <h5 className="content-card-title">
                <i className="bi bi-person-circle text-primary me-2"></i>
                Account Details
              </h5>
              <span className={`status-badge ${profile.status === "Active" ? "approved" : "blocked"}`}>
                Status: {profile.status || "Active"}
              </span>
            </div>

            <div className="content-card-body">
              {alertInfo.text && (
                <div className={`alert alert-${alertInfo.type} d-flex align-items-center gap-2 mb-3`}>
                  <i
                    className={`bi ${
                      alertInfo.type === "success"
                        ? "bi-check-circle-fill"
                        : "bi-exclamation-triangle-fill"
                    }`}
                  ></i>
                  <div>{alertInfo.text}</div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={profile.name || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <input
                        type="email"
                        className="form-control bg-light"
                        value={profile.email || ""}
                        disabled
                        title="Email cannot be changed"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={profile.phone || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Account Role</label>
                      <input
                        type="text"
                        className="form-control bg-light text-capitalize"
                        value={profile.role || "User"}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Residential Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows="3"
                      value={profile.address || ""}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary-custom px-4"
                      disabled={saving}
                    >
                      {saving ? "Saving Changes..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Profile;
