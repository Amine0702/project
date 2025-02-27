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

  // Tant que le composant n'est pas monté, on renvoie directement les enfants
  if (!mounted) {
    return <>{children}</>;
  }

  const isLandingPage = pathname === "/" || pathname === "/landing"; // Ajuste en fonction de tes routes

  if (isLandingPage) {
    return <>{children}</>;
  }

  return <DashboardWrapper>{children}</DashboardWrapper>;
};

export default ConditionalDashboardWrapper;
