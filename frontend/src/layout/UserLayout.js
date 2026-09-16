import React from "react";
import DashboardLayout from "./DashboardLayout";

function UserLayout({ title, subtitle, children }) {
  return (
    <DashboardLayout title={title || "Donor & Beneficiary Portal"} subtitle={subtitle}>
      {children}
    </DashboardLayout>
  );
}

export default UserLayout;
