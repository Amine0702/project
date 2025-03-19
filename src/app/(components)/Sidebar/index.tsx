"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from "@clerk/nextjs";
import { useGetProjectsByClerkUserQuery } from "@/app/state/api";
import { 
  AlertCircle, 
  AlertOctagon, 
  AlertTriangle, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  FileChartLine, 
  Home, 
  Inbox, 
  Layers3, 
  ShieldAlert, 
  Users, 
  X, 
  Video, 
  Calendar 
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../redux';
import Link from 'next/link';
import { setIsSidebarCollapsed } from '@/app/state';

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [showProjects2, setShowProjects2] = useState(true);

  // Récupération de l'utilisateur via Clerk
  const { user, isLoaded: userLoaded } = useUser();
  // Utilisation du clerkUserId depuis Clerk (user.id)
  const clerkUserId = user?.id || '';

  // Appel de l'API pour récupérer les projets liés au clerkUserId
  const { data: projects, error, isLoading } = useGetProjectsByClerkUserQuery(clerkUserId, {
    skip: !userLoaded || !clerkUserId,
  });

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">MDW</div>
          {!isSidebarCollapsed && (
            <button
              className="py-3"
              onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>

        {/* Navbar Links */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/home" />
          <SidebarLink icon={Inbox} label="BoiteRéception" href="/timeline" />
          <SidebarLink icon={FileChartLine} label="Rapport et analyse" href="/search" />
          <SidebarLink icon={Video} label="Join Meet" href="/meeting" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
          <SidebarLink icon={Calendar} label="Calendar" href="/calendar" />
        </nav>

        {/* PROJECTS LINKS */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span>Votre Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {/* PROJECTS LIST */}
        {showProjects && (
          <>
            {isLoading && <div className="px-8 py-2 text-gray-500">Chargement...</div>}
            {error && <div className="px-8 py-2 text-red-500">Erreur lors du chargement des projets.</div>}
            {projects?.map((project) => (
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/projects/${project.id}`}
              />
            ))}
          </>

          
        )}


        {/* PROJECTS LINKS */}
        <button
          onClick={() => setShowProjects2((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span>Projects Invitée</span>
          {showProjects2 ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {/* PROJECTS LIST */}
        {showProjects2 && (
          <>
            {isLoading && <div className="px-8 py-2 text-gray-500">Chargement...</div>}
            {error && <div className="px-8 py-2 text-red-500">Erreur lors du chargement des projets.</div>}
            {projects?.map((project) => (
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/projects/${project.id}`}
              />
            ))}
          </>

          
        )}

        {/* PRIORITIES LINKS */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span>Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" />
            <SidebarLink icon={ShieldAlert} label="High" href="/priority/high" />
            <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" />
          </>
        )}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && <div className="absolute left-0 top-0 h-full w-[5px] bg-blue-200" />}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className="font-medium text-gray-800 dark:text-gray-100">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
