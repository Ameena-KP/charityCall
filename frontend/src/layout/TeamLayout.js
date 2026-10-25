import React from "react";
import DashboardLayout from "./DashboardLayout";

function TeamLayout({ title, subtitle, children }) {
  return (
    <DashboardLayout title={title || "Volunteer Portal"} subtitle={subtitle}>
      {children}
    </DashboardLayout>
  );
}

export default TeamLayout;
