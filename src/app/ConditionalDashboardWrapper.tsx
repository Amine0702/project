"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardWrapper from "./dashboardWrapper";

interface ConditionalDashboardWrapperProps {
  children: React.ReactNode;
}

const ConditionalDashboardWrapper: React.FC<ConditionalDashboardWrapperProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  const landingPages = ["/", "/landing"];
  const isLandingPage = landingPages.includes(pathname);

  if (isLandingPage) {
    return <>{children}</>;
  }

  return <DashboardWrapper>{children}</DashboardWrapper>;
};

export default ConditionalDashboardWrapper;
