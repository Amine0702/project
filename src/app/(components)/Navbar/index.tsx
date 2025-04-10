"use client";
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { Menu, Moon, Search, Settings, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/app/state";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle de la sidebar (inversion du booléen)
  const handleToggle = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // Focus sur la barre de recherche via ⌘+K ou Ctrl+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown as any);
    return () => document.removeEventListener("keydown", handleKeyDown as any);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-50 dark:bg-gray-900 dark:border-gray-800 lg:px-6">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full">
        <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-200 dark:border-gray-800 lg:border-b-0 lg:py-4">
          {/* Bouton de toggle pour la sidebar */}
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg z-50 dark:text-gray-400 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* Barre de recherche */}
          <div className="hidden lg:block relative w-full max-w-[430px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search or type command..."
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
            />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
              <span>⌘</span>
              <span>K</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-3">
          {/* Toggle Dark Mode */}
          <button
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
          {/* Lien vers Settings */}
          <Link href="/settings" className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="h-6 w-6 text-gray-700 dark:text-white" />
          </Link>
          <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-600" />
          {/* Bouton Utilisateur */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;