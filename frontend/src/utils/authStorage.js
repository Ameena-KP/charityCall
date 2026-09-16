// Centralized tab-isolated Auth storage manager
// Uses sessionStorage so each browser tab can maintain an independent role session (Admin in Tab 1, User in Tab 2, Team in Tab 3).

export const getAuthToken = () => {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
};

export const getAuthRole = () => {
  return sessionStorage.getItem("role") || localStorage.getItem("role");
};

export const getAuthUser = () => {
  const stored = sessionStorage.getItem("user") || localStorage.getItem("user");
  try {
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthSession = (token, role, user) => {
  // 1. Save to tab-specific sessionStorage (isolated to current tab)
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("role", role);
  if (user) {
    const userStr = typeof user === "string" ? user : JSON.stringify(user);
    sessionStorage.setItem("user", userStr);
    localStorage.setItem(`user_${role}`, userStr);
  }

  // 2. Save role-scoped token in localStorage (so new tabs for that role can inherit if opened directly)
  localStorage.setItem(`token_${role}`, token);
  localStorage.setItem(`role_${role}`, role);

  // 3. Clear legacy global token to prevent role collision across tabs
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};

export const clearAuthSession = () => {
  const currentRole = sessionStorage.getItem("role") || localStorage.getItem("role");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user");

  if (currentRole) {
    localStorage.removeItem(`token_${currentRole}`);
    localStorage.removeItem(`role_${currentRole}`);
    localStorage.removeItem(`user_${currentRole}`);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};
