import React from "react";
import DashboardLayout from "./DashboardLayout";

function AdminLayout({ title, subtitle, children }) {
  return (
    <DashboardLayout title={title || "Administrator Portal"} subtitle={subtitle}>
      {children}
    </DashboardLayout>
  );
}

export default AdminLayout;
