"use client";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import AuthWrapper from "@/app/AuthWrapper";
import StoreProvider from "./(components)/redux"; // Redux Provider

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-white`}>
          <StoreProvider> {/* ✅ Le Redux Provider est dans body */}
            <AuthWrapper>{children}</AuthWrapper>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
