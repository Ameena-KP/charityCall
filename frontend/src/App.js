import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import ApprovedRequests from "./pages/user/ApprovedRequests";
import CreateRequest from "./pages/user/CreateRequest";
import MyRequests from "./pages/user/MyRequests";
import MyDonations from "./pages/user/MyDonations";
import UserNotifications from "./pages/user/Notifications";
import UserFeedback from "./pages/user/Feedback";
import UserProfile from "./pages/user/Profile";

// Team Pages
import TeamDashboard from "./pages/team/Dashboard";
import TeamApprovedRequests from "./pages/team/ApprovedRequests";
import TeamDonations from "./pages/team/Donations";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminTeams from "./pages/admin/Teams";
import AdminRequests from "./pages/admin/Requests";
import AdminDonations from "./pages/admin/Donations";
import AdminNotifications from "./pages/admin/Notifications";
import AdminReports from "./pages/admin/Reports";
import AdminFeedback from "./pages/admin/Feedback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Portal Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/browse"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ApprovedRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/create-request"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CreateRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/my-requests"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/my-donations"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/notifications"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/feedback"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Team Portal Routes */}
        <Route
          path="/team/dashboard"
          element={
            <ProtectedRoute allowedRoles={["team"]}>
              <TeamDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/approved"
          element={
            <ProtectedRoute allowedRoles={["team"]}>
              <TeamApprovedRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/donations"
          element={
            <ProtectedRoute allowedRoles={["team"]}>
              <TeamDonations />
            </ProtectedRoute>
          }
        />

        {/* Admin Portal Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminTeams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminFeedback />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;