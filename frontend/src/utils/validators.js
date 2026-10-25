// Centralized Form Validators for Charity Connect

/**
 * Validates full name: letters, spaces, dots, hyphens, min 2 chars, max 60 chars.
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return "Name is required.";
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return "Name must be at least 2 characters.";
  }
  if (trimmed.length > 60) {
    return "Name cannot exceed 60 characters.";
  }
  const nameRegex = /^[a-zA-Z\s.'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return "Name can only contain letters, spaces, dots, and hyphens.";
  }
  return "";
};

/**
 * Validates standard email address.
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return "Email address is required.";
  }
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return "Please enter a valid email address (e.g. name@example.com).";
  }
  return "";
};

/**
 * Validates mobile number: exactly 10 digits.
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.toString().trim()) {
    return "Mobile number is required.";
  }
  const cleanPhone = phone.toString().replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    return "Mobile number must be exactly 10 digits.";
  }
  if (!/^[6-9]\d{9}$/.test(cleanPhone) && !/^\d{10}$/.test(cleanPhone)) {
    return "Please enter a valid 10-digit mobile number.";
  }
  return "";
};

/**
 * Restricts input to only digits and max 10 characters.
 */
export const sanitizePhoneInput = (value) => {
  return value.replace(/\D/g, "").slice(0, 10);
};

/**
 * Validates password: min length.
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return "Password is required.";
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters.`;
  }
  return "";
};

/**
 * Validates residential address.
 */
export const validateAddress = (address, minLength = 6) => {
  if (!address || !address.trim()) {
    return "Address is required.";
  }
  if (address.trim().length < minLength) {
    return `Please enter a complete address (minimum ${minLength} characters).`;
  }
  if (address.trim().length > 300) {
    return "Address cannot exceed 300 characters.";
  }
  return "";
};

/**
 * Validates request or donation title.
 */
export const validateTitle = (title, minLength = 5, maxLength = 150) => {
  if (!title || !title.trim()) {
    return "Title is required.";
  }
  const trimmed = title.trim();
  if (trimmed.length < minLength) {
    return `Title must be at least ${minLength} characters.`;
  }
  if (trimmed.length > maxLength) {
    return `Title cannot exceed ${maxLength} characters.`;
  }
  return "";
};

/**
 * Validates item name.
 */
export const validateItemName = (itemName, minLength = 2, maxLength = 100) => {
  if (!itemName || !itemName.trim()) {
    return "Item name is required.";
  }
  const trimmed = itemName.trim();
  if (trimmed.length < minLength) {
    return `Item name must be at least ${minLength} characters.`;
  }
  if (trimmed.length > maxLength) {
    return `Item name cannot exceed ${maxLength} characters.`;
  }
  return "";
};

/**
 * Validates quantity: positive integer between 1 and max.
 */
export const validateQuantity = (quantity, max = 10000) => {
  if (quantity === "" || quantity === null || quantity === undefined) {
    return "Quantity is required.";
  }
  const num = Number(quantity);
  if (isNaN(num) || !Number.isInteger(num) || num < 1) {
    return "Quantity must be a positive whole number (at least 1).";
  }
  if (num > max) {
    return `Quantity cannot exceed ${max}.`;
  }
  return "";
};

/**
 * Validates explanation / description.
 */
export const validateDescription = (description, minLength = 15, maxLength = 2000) => {
  if (!description || !description.trim()) {
    return "Description is required.";
  }
  const trimmed = description.trim();
  if (trimmed.length < minLength) {
    return `Please provide a more detailed description (minimum ${minLength} characters).`;
  }
  if (trimmed.length > maxLength) {
    return `Description cannot exceed ${maxLength} characters.`;
  }
  return "";
};

/**
 * Validates city / location.
 */
export const validateLocation = (location, minLength = 3, maxLength = 100) => {
  if (!location || !location.trim()) {
    return "Pickup location / city is required.";
  }
  const trimmed = location.trim();
  if (trimmed.length < minLength) {
    return `Location must be at least ${minLength} characters.`;
  }
  if (trimmed.length > maxLength) {
    return `Location cannot exceed ${maxLength} characters.`;
  }
  return "";
};

/**
 * Validates uploaded proof document.
 */
export const validateDocumentFile = (file, allowedExtensions = ["pdf", "png", "jpg", "jpeg"], maxMB = 5) => {
  if (!file) return "";
  const ext = file.name.split(".").pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return `Invalid file format (.${ext}). Allowed: ${allowedExtensions.join(", ")}.`;
  }
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File size exceeds the maximum allowed limit of ${maxMB}MB.`;
  }
  return "";
};
