import React, { useEffect, useState } from "react";
import UserLayout from "../../layout/UserLayout";
import {
  getAllPublishedDonations,
  getMyPublishedDonations,
  createPublishedDonation,
  updatePublishedDonation,
  updatePublishedDonationStatus,
  deletePublishedDonation,
} from "../../services/publishedDonationService";
import { getAuthUser } from "../../utils/authStorage";
import {
  validateTitle,
  validateItemName,
  validateQuantity,
  validateLocation,
  validatePhone,
  sanitizePhoneInput,
} from "../../utils/validators";

function PublishedDonations() {
  const currentUser = getAuthUser();

  const [allItems, setAllItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("browse"); // 'browse' | 'my_items'

  // Filters for browse tab
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  // Contact Donor Modal
  const [contactItem, setContactItem] = useState(null);

  // Form State
  const initialForm = {
    title: "",
    category: "Clothing",
    item_name: "",
    quantity: 1,
    item_condition: "Good",
    description: "",
    location: currentUser?.address || "",
    contact_phone: currentUser?.phone || "",
  };
  const [formData, setFormData] = useState(initialForm);

  const categories = [
    "All",
    "Food",
    "Clothing",
    "Medicine",
    "Education",
    "Shelter",
    "Electronics",
    "Other",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allRes, myRes] = await Promise.all([
        getAllPublishedDonations(),
        getMyPublishedDonations().catch(() => ({ success: false, data: [] })),
      ]);

      if (allRes.success && allRes.data) {
        setAllItems(allRes.data);
      }
      if (myRes.success && myRes.data) {
        setMyItems(myRes.data);
      }
    } catch (err) {
      console.error("Error loading published donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateModalField = (field, value) => {
    switch (field) {
      case "title":
        return validateTitle(value, 5, 150);
      case "item_name":
        return validateItemName(value, 2, 100);
      case "quantity":
        return validateQuantity(value, 10000);
      case "location":
        return validateLocation(value, 3, 100);
      case "contact_phone":
        return validatePhone(value);
      default:
        return "";
    }
  };

  const handleOpenPublishModal = (item = null) => {
    setModalError("");
    setFormErrors({});
    setFormTouched({});
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || "",
        category: item.category || "Clothing",
        item_name: item.item_name || "",
        quantity: item.quantity || 1,
        item_condition: item.item_condition || "Good",
        description: item.description || "",
        location: item.location || "",
        contact_phone: item.contact_phone || currentUser?.phone || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        ...initialForm,
        location: currentUser?.address || "",
        contact_phone: currentUser?.phone || "",
      });
    }
    setShowPublishModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    const titleErr = validateTitle(formData.title, 5, 150);
    const itemErr = validateItemName(formData.item_name, 2, 100);
    const qtyErr = validateQuantity(formData.quantity, 10000);
    const locErr = validateLocation(formData.location, 3, 100);
    const phoneErr = validatePhone(formData.contact_phone);

    const newErrors = {
      title: titleErr,
      item_name: itemErr,
      quantity: qtyErr,
      location: locErr,
      contact_phone: phoneErr,
    };

    setFormErrors(newErrors);
    setFormTouched({
      title: true,
      item_name: true,
      quantity: true,
      location: true,
      contact_phone: true,
    });

    if (titleErr || itemErr || qtyErr || locErr || phoneErr) {
      setModalError("Please correct the errors in the form before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem) {
        const res = await updatePublishedDonation(editingItem.id, formData);
        if (res.success) {
          setShowPublishModal(false);
          await loadData();
        }
      } else {
        const res = await createPublishedDonation(formData);
        if (res.success) {
          setShowPublishModal(false);
          setActiveTab("my_items");
          await loadData();
        }
      }
    } catch (err) {
      setModalError(
        err.response?.data?.message || "Failed to save donation listing. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await updatePublishedDonationStatus(itemId, newStatus);
      await loadData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDeleteItem = async (itemId, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from published donations?`)) {
      return;
    }
    try {
      await deletePublishedDonation(itemId);
      await loadData();
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  // Helper to determine if an item was published by the logged-in user
  const isOwnItem = (item) => {
    if (!currentUser) return false;
    if (currentUser.id && Number(item.user_id) === Number(currentUser.id)) return true;
    if (currentUser.email && item.donor_email && item.donor_email.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (currentUser.name && item.donor_name && item.donor_name.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) return true;
    return false;
  };

  // Community offerings - strictly exclude the logged-in user's own items
  const communityItems = allItems.filter((item) => !isOwnItem(item));

  // Filtered community offerings
  const filteredCommunityItems = communityItems.filter((item) => {
    const matchCat =
      selectedCategory === "All" ||
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchStatus =
      selectedStatus === "All" ||
      (item.status && item.status.toLowerCase() === selectedStatus.toLowerCase());
    const matchSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.donor_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchStatus && matchSearch;
  });

  const getStatusBadge = (status) => {
    if (status === "Available") {
      return (
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
          <i className="bi bi-check-circle-fill me-1"></i> Available
        </span>
      );
    }
    if (status === "Reserved") {
      return (
        <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">
          <i className="bi bi-clock-fill me-1"></i> Reserved
        </span>
      );
    }
    return (
      <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
        <i className="bi bi-gift-fill me-1"></i> Donated
      </span>
    );
  };

  const getCategoryColor = (cat) => {
    const map = {
      Food: "#f59e0b",
      Clothing: "#0284c7",
      Medicine: "#ef4444",
      Education: "#8b5cf6",
      Shelter: "#10b981",
      Electronics: "#3b82f6",
      Other: "#64748b",
    };
    return map[cat] || "#0284c7";
  };

  const availableCount = communityItems.filter((i) => i.status === "Available").length;
  const donatedCount = allItems.filter((i) => i.status === "Donated").length;

  return (
    <UserLayout
      title="Offered Donations & Community Giving"
      subtitle="Publish items you are willing to give away, manage your offers, or connect directly with generous donors."
    >
      {/* Top Impact Statistics & Quick Action */}
      <div className="row g-3 mb-4 align-items-center">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-icon success">
              <i className="bi bi-box2-heart-fill"></i>
            </div>
            <div>
              <div className="stat-value">{availableCount}</div>
              <p className="stat-label">Available in Community</p>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-icon primary">
              <i className="bi bi-person-heart"></i>
            </div>
            <div>
              <div className="stat-value">{myItems.length}</div>
              <p className="stat-label">My Published Items</p>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-icon info">
              <i className="bi bi-check2-all"></i>
            </div>
            <div>
              <div className="stat-value">{donatedCount}</div>
              <p className="stat-label">Completed Donations</p>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3 text-md-end">
          <button
            type="button"
            className="btn btn-primary-custom w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
            onClick={() => handleOpenPublishModal()}
          >
            <i className="bi bi-plus-circle-fill fs-5"></i>
            <span className="fw-bold">Publish Item to Donate</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-4">
        <div className="role-tabs" style={{ maxWidth: "420px" }}>
          <button
            type="button"
            className={`role-tab-btn ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => setActiveTab("browse")}
          >
            <i className="bi bi-grid-fill me-1"></i> Browse Community Items ({communityItems.length})
          </button>
          <button
            type="button"
            className={`role-tab-btn ${activeTab === "my_items" ? "active" : ""}`}
            onClick={() => setActiveTab("my_items")}
          >
            <i className="bi bi-box-seam-fill me-1"></i> My Published ({myItems.length})
          </button>
        </div>

        <div className="d-none d-md-block text-muted small">
          <i className="bi bi-info-circle me-1 text-primary"></i>
          Direct community sharing with zero mediator fees
        </div>
      </div>

      {/* TAB 1: BROWSE ALL COMMUNITY OFFERINGS */}
      {activeTab === "browse" && (
        <>
          {/* Search & Category Filter Bar */}
          <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
            <div className="row g-3 align-items-center">
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="Search by title, item name, city, or donor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted fw-semibold text-nowrap">Status:</span>
                  <select
                    className="form-select form-select-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available Only</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Donated">Donated</option>
                  </select>
                </div>
              </div>

              <div className="col-md-3 text-md-end text-muted small">
                Showing <strong>{filteredCommunityItems.length}</strong> items
              </div>
            </div>

            {/* Category Pills Filter */}
            <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${
                    selectedCategory === cat ? "btn-dark fw-bold" : "btn-outline-secondary"
                  }`}
                  style={{ borderRadius: "20px", fontSize: "0.82rem", padding: "4px 14px" }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted small">Loading published donation items...</p>
            </div>
          ) : filteredCommunityItems.length === 0 ? (
            <div className="content-card text-center py-5">
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  color: "#94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  marginBottom: "1rem",
                }}
              >
                <i className="bi bi-box2-heart"></i>
              </div>
              <h5 className="fw-bold">No Community Items Found</h5>
              <p className="text-muted small mx-auto" style={{ maxWidth: "420px" }}>
                {searchQuery || selectedCategory !== "All" || selectedStatus !== "All"
                  ? "Try clearing your search filters to view other available community donations."
                  : "No items from other community members are available right now. Visit 'My Published' to review items you have offered."}
              </p>
              <button
                type="button"
                className="btn btn-primary-custom btn-sm mt-2"
                onClick={() => handleOpenPublishModal()}
              >
                <i className="bi bi-plus-circle me-1"></i> Offer an Item
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {filteredCommunityItems.map((item) => (
                <div className="col-md-6 col-lg-4" key={item.id}>
                  <div className="content-card h-100 d-flex flex-column border">
                    {/* Top Header */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span
                        className="badge"
                        style={{
                          background: `${getCategoryColor(item.category)}18`,
                          color: getCategoryColor(item.category),
                          fontWeight: 700,
                          fontSize: "0.76rem",
                        }}
                      >
                        <i className="bi bi-tag-fill me-1"></i> {item.category}
                      </span>

                      <div className="d-flex align-items-center gap-1">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    {/* Title & Specific Item */}
                    <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: "1.05rem" }}>
                      {item.title}
                    </h5>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="fw-semibold text-primary small">
                        <i className="bi bi-box-seam me-1"></i> {item.item_name}
                      </span>
                      <span className="text-muted small">&bull;</span>
                      <span className="badge bg-light text-dark border small">
                        Qty: <strong>{item.quantity}</strong>
                      </span>
                      {item.item_condition && (
                        <span className="badge bg-light text-secondary border small">
                          {item.item_condition}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      className="text-muted small flex-grow-1 mb-3"
                      style={{
                        lineHeight: "1.5",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description || "No additional description provided by donor."}
                    </p>

                    {/* Metadata Footer */}
                    <div className="pt-2 border-top mt-auto">
                      <div className="d-flex align-items-center justify-content-between small text-muted mb-3">
                        <span title="Pickup Location" className="text-truncate" style={{ maxWidth: "60%" }}>
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {item.location || "Location not specified"}
                        </span>
                        <span title="Donor Name">
                          <i className="bi bi-person-fill text-primary me-1"></i>
                          {item.donor_name || "Community Donor"}
                        </span>
                      </div>

                      {/* Action Button: Connect with Donor */}
                      <button
                        type="button"
                        className="btn btn-primary-custom btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => setContactItem(item)}
                      >
                        <i className="bi bi-telephone-outbound-fill"></i>
                        <span>Connect with Donor</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: MY PUBLISHED ITEMS */}
      {activeTab === "my_items" && (
        <div className="content-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h5 className="fw-bold mb-0">Your Published Donation Listings</h5>
              <small className="text-muted">
                Track and update the status of items you have offered to give away.
              </small>
            </div>
            <button
              type="button"
              className="btn btn-primary-custom btn-sm"
              onClick={() => handleOpenPublishModal()}
            >
              <i className="bi bi-plus-circle me-1"></i> Add New Item
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
            </div>
          ) : myItems.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box2-heart text-muted fs-1 d-block mb-2"></i>
              <h6 className="fw-bold">You haven't published any donation items yet</h6>
              <p className="text-muted small">
                Have books, clothes, dry food, or household items to donate? Publish them now to reach individuals in need.
              </p>
              <button
                type="button"
                className="btn btn-primary-custom btn-sm"
                onClick={() => handleOpenPublishModal()}
              >
                <i className="bi bi-plus-circle me-1"></i> Publish Your First Item
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table custom-table align-middle">
                <thead>
                  <tr>
                    <th>Item &amp; Category</th>
                    <th>Quantity</th>
                    <th>Condition</th>
                    <th>Location &amp; Contact</th>
                    <th>Current Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-bold text-dark">{item.title}</div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span
                            className="badge"
                            style={{
                              background: `${getCategoryColor(item.category)}18`,
                              color: getCategoryColor(item.category),
                              fontSize: "0.72rem",
                            }}
                          >
                            {item.category}
                          </span>
                          <small className="text-muted">{item.item_name}</small>
                        </div>
                      </td>
                      <td>
                        <strong>{item.quantity}</strong> units
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">
                          {item.item_condition || "Good"}
                        </span>
                      </td>
                      <td>
                        <div className="small">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {item.location || "N/A"}
                        </div>
                        <div className="small text-muted mt-1">
                          <i className="bi bi-telephone me-1"></i>
                          {item.contact_phone || "N/A"}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <div>{getStatusBadge(item.status)}</div>
                          <select
                            className="form-select form-select-sm mt-1"
                            style={{ fontSize: "0.75rem", width: "120px" }}
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Donated">Donated</option>
                          </select>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleOpenPublishModal(item)}
                            title="Edit Item"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            title="Delete Item"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PUBLISH / EDIT MODAL */}
      {/* ========================================================= */}
      {showPublishModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i className="bi bi-bag-heart-fill"></i>
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">
                      {editingItem ? "Edit Donation Offer" : "Publish an Item to Donate"}
                    </h5>
                    <small className="text-light opacity-75">
                      Share essentials directly with individuals and charities
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPublishModal(false)}
                ></button>
              </div>

              <form onSubmit={handleFormSubmit} noValidate>
                <div className="modal-body p-4">
                  {modalError && (
                    <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                      <span>{modalError}</span>
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-8">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label fw-semibold small mb-1">
                          Listing Title <span className="text-danger">*</span>
                        </label>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Min. 5 characters
                        </small>
                      </div>
                      <input
                        type="text"
                        className={`form-control ${formTouched.title ? (formErrors.title ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="e.g. Warm Blankets and Winter Jackets for Children"
                        value={formData.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, title: val });
                          if (formTouched.title) {
                            setFormErrors((prev) => ({ ...prev, title: validateModalField("title", val) }));
                          }
                        }}
                        onBlur={() => {
                          setFormTouched((prev) => ({ ...prev, title: true }));
                          setFormErrors((prev) => ({ ...prev, title: validateModalField("title", formData.title) }));
                        }}
                        required
                      />
                      {formTouched.title && formErrors.title && (
                        <div className="invalid-feedback d-block">{formErrors.title}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Clothing">Clothing &amp; Apparel</option>
                        <option value="Food">Food &amp; Groceries</option>
                        <option value="Medicine">Medicine &amp; Health</option>
                        <option value="Education">Education &amp; Books</option>
                        <option value="Shelter">Shelter &amp; Living</option>
                        <option value="Electronics">Electronics &amp; Appliances</option>
                        <option value="Other">Other Community Aids</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label fw-semibold small mb-1">
                          Specific Item Name <span className="text-danger">*</span>
                        </label>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Min. 2 characters
                        </small>
                      </div>
                      <input
                        type="text"
                        className={`form-control ${formTouched.item_name ? (formErrors.item_name ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="e.g. 5x Thermal Jackets, 2x Blankets"
                        value={formData.item_name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, item_name: val });
                          if (formTouched.item_name) {
                            setFormErrors((prev) => ({ ...prev, item_name: validateModalField("item_name", val) }));
                          }
                        }}
                        onBlur={() => {
                          setFormTouched((prev) => ({ ...prev, item_name: true }));
                          setFormErrors((prev) => ({ ...prev, item_name: validateModalField("item_name", formData.item_name) }));
                        }}
                        required
                      />
                      {formTouched.item_name && formErrors.item_name && (
                        <div className="invalid-feedback d-block">{formErrors.item_name}</div>
                      )}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold small">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        className={`form-control ${formTouched.quantity ? (formErrors.quantity ? "is-invalid" : "is-valid") : ""}`}
                        value={formData.quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, quantity: val });
                          if (formTouched.quantity) {
                            setFormErrors((prev) => ({ ...prev, quantity: validateModalField("quantity", val) }));
                          }
                        }}
                        onBlur={() => {
                          setFormTouched((prev) => ({ ...prev, quantity: true }));
                          setFormErrors((prev) => ({ ...prev, quantity: validateModalField("quantity", formData.quantity) }));
                        }}
                        required
                      />
                      {formTouched.quantity && formErrors.quantity && (
                        <div className="invalid-feedback d-block">{formErrors.quantity}</div>
                      )}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold small">Condition</label>
                      <select
                        className="form-select"
                        value={formData.item_condition}
                        onChange={(e) => setFormData({ ...formData, item_condition: e.target.value })}
                      >
                        <option value="Brand New">Brand New</option>
                        <option value="Like New">Like New</option>
                        <option value="Gently Used">Gently Used</option>
                        <option value="Good">Good / Working</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label fw-semibold small mb-1">
                          Pickup Location / City <span className="text-danger">*</span>
                        </label>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Min. 3 characters
                        </small>
                      </div>
                      <div className="input-group has-validation">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-geo-alt text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control ${formTouched.location ? (formErrors.location ? "is-invalid" : "is-valid") : ""}`}
                          placeholder="e.g. Edappally, Kochi, Kerala"
                          value={formData.location}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({ ...formData, location: val });
                            if (formTouched.location) {
                              setFormErrors((prev) => ({ ...prev, location: validateModalField("location", val) }));
                            }
                          }}
                          onBlur={() => {
                            setFormTouched((prev) => ({ ...prev, location: true }));
                            setFormErrors((prev) => ({ ...prev, location: validateModalField("location", formData.location) }));
                          }}
                          required
                        />
                        {formTouched.location && formErrors.location && (
                          <div className="invalid-feedback d-block">{formErrors.location}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label fw-semibold small mb-1">
                          Contact Phone / WhatsApp <span className="text-danger">*</span>
                        </label>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          10 digits only
                        </small>
                      </div>
                      <div className="input-group has-validation">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-telephone text-muted"></i>
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          className={`form-control ${formTouched.contact_phone ? (formErrors.contact_phone ? "is-invalid" : "is-valid") : ""}`}
                          placeholder="e.g. 9876543210"
                          value={formData.contact_phone}
                          onChange={(e) => {
                            const val = sanitizePhoneInput(e.target.value);
                            setFormData({ ...formData, contact_phone: val });
                            if (formTouched.contact_phone) {
                              setFormErrors((prev) => ({ ...prev, contact_phone: validateModalField("contact_phone", val) }));
                            }
                          }}
                          onBlur={() => {
                            setFormTouched((prev) => ({ ...prev, contact_phone: true }));
                            setFormErrors((prev) => ({ ...prev, contact_phone: validateModalField("contact_phone", formData.contact_phone) }));
                          }}
                          required
                        />
                        {formTouched.contact_phone && formErrors.contact_phone && (
                          <div className="invalid-feedback d-block">{formErrors.contact_phone}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description &amp; Pickup Notes</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Provide details about size, condition, expiry (if food/medicine), pickup timings, etc."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPublishModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i>
                        {editingItem ? "Update Listing" : "Publish Offer"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONTACT DONOR MODAL */}
      {/* ========================================================= */}
      {contactItem && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <h5 className="modal-title fw-bold mb-0">Donor Contact Details</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setContactItem(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "#e0f2fe",
                      color: "#0284c7",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.6rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <h5 className="fw-bold mb-0">{contactItem.donor_name}</h5>
                  <small className="text-muted">Community Donor</small>
                </div>

                <div className="p-3 rounded bg-light border mb-3">
                  <div className="small text-muted mb-1">Item Offered:</div>
                  <div className="fw-bold text-dark">{contactItem.title}</div>
                  <div className="small text-primary mt-1">
                    <i className="bi bi-box-seam me-1"></i> {contactItem.item_name} ({contactItem.quantity} units)
                  </div>
                  <div className="small text-muted mt-1">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i> {contactItem.location}
                  </div>
                </div>

                <div className="d-flex flex-column gap-2">
                  {contactItem.contact_phone && (
                    <>
                      <a
                        href={`tel:${contactItem.contact_phone}`}
                        className="btn btn-outline-primary py-2 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi bi-telephone-fill"></i>
                        <span>Call Donor ({contactItem.contact_phone})</span>
                      </a>
                      <a
                        href={`https://wa.me/${contactItem.contact_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${contactItem.donor_name}, I saw your donation listing for "${contactItem.title}" on Charity Connect and would like to coordinate.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success py-2 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi bi-whatsapp"></i>
                        <span>Chat on WhatsApp</span>
                      </a>
                    </>
                  )}
                  {contactItem.donor_email && (
                    <a
                      href={`mailto:${contactItem.donor_email}?subject=${encodeURIComponent(
                        `Charity Connect: Inquiry regarding ${contactItem.title}`
                      )}`}
                      className="btn btn-outline-secondary py-2 d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="bi bi-envelope-fill"></i>
                      <span>Email Donor ({contactItem.donor_email})</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => setContactItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default PublishedDonations;
