import React, { useEffect, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import { getProfile, updateProfile } from "../../services/userService";
import {
  validateName,
  validatePhone,
  validateAddress,
  sanitizePhoneInput,
} from "../../utils/validators";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "",
    created_at: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        return validateName(value);
      case "phone":
        return validatePhone(value);
      case "address":
        return validateAddress(value, 6);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "phone" ? sanitizePhoneInput(value) : value;
    setProfile((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, finalValue),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, profile[field]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo({ text: "", type: "" });

    const nameErr = validateName(profile.name);
    const phoneErr = validatePhone(profile.phone);
    const addrErr = validateAddress(profile.address, 6);

    setErrors({ name: nameErr, phone: phoneErr, address: addrErr });
    setTouched({ name: true, phone: true, address: true });

    if (nameErr || phoneErr || addrErr) {
      setAlertInfo({
        text: "Please correct the highlighted fields before saving.",
        type: "danger",
      });
      return;
    }

    setSaving(true);

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
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Full Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${touched.name ? (errors.name ? "is-invalid" : "is-valid") : ""}`}
                        value={profile.name || ""}
                        onChange={handleChange}
                        onBlur={() => handleBlur("name")}
                        required
                      />
                      {touched.name && errors.name && (
                        <div className="invalid-feedback d-block">{errors.name}</div>
                      )}
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
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label fw-semibold small mb-1">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          10 digits only
                        </small>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        className={`form-control ${touched.phone ? (errors.phone ? "is-invalid" : "is-valid") : ""}`}
                        value={profile.phone || ""}
                        onChange={handleChange}
                        onBlur={() => handleBlur("phone")}
                        required
                      />
                      {touched.phone && errors.phone && (
                        <div className="invalid-feedback d-block">{errors.phone}</div>
                      )}
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
                    <label className="form-label fw-semibold small">
                      Residential Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="address"
                      className={`form-control ${touched.address ? (errors.address ? "is-invalid" : "is-valid") : ""}`}
                      rows="3"
                      value={profile.address || ""}
                      onChange={handleChange}
                      onBlur={() => handleBlur("address")}
                      required
                    ></textarea>
                    {touched.address && errors.address && (
                      <div className="invalid-feedback d-block">{errors.address}</div>
                    )}
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
