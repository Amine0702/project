import Calendar from "@/app/calendar/components/Calendar";
import PageBreadcrumb from "@/app/calendar/components/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Calendar",
  description:
    "This is Next.js Calendar page for TailAdmin Tailwind CSS Admin Dashboard Template",
};

export default function CalendarPage() {
  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div>
  );
}
