"use client";

import { useState, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  UserIcon,
  TableCellsIcon,
  TrashIcon,
  DocumentChartBarIcon,
  ShieldExclamationIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

// Palette de couleurs
const primaryColor = "#b03ff3"; // mauve dominant
const accentYellow = "#FFC107";
const accentGreen = "#4CAF50";
const accentOrange = "#FF9800";

// --- Données simulées pour le graphique de performance
const performanceData = [
  { day: "Lun", count: 2 },
  { day: "Mar", count: 3 },
  { day: "Mer", count: 5 },
  { day: "Jeu", count: 4 },
  { day: "Ven", count: 6 },
];

// --- Types et données initiales

// Type pour un membre de l'équipe
type Member = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Membre";
  status: "active" | "inactive";
  photo: string;
};

// Type pour un projet
type Project = {
  id: string;
  name: string;
  startDate: Date;
  manager: string;
  team: Member[];
};

// Données simulées pour les projets
const initialProjects: Project[] = [
  {
    id: "alpha",
    name: "Projet Alpha",
    startDate: new Date("2024-01-10"),
    manager: "Alice Dupont",
    team: [
      { id: 1, name: "Alex Dupont", email: "alex@example.com", role: "Admin", status: "active", photo: "https://via.placeholder.com/48" },
      { id: 2, name: "Marie Leroy", email: "marie@example.com", role: "Manager", status: "active", photo: "https://via.placeholder.com/48" },
      { id: 3, name: "Jean Martin", email: "jean.m@domain.com", role: "Membre", status: "inactive", photo: "https://via.placeholder.com/48" },
    ],
  },
  {
    id: "beta",
    name: "Projet Beta",
    startDate: new Date("2024-02-15"),
    manager: "Bob Martin",
    team: [
      { id: 4, name: "Sophie Lambert", email: "soph.lambert@mail.com", role: "Membre", status: "active", photo: "https://via.placeholder.com/48" },
      { id: 5, name: "Luc Bernard", email: "luc.bernard@mail.com", role: "Manager", status: "active", photo: "https://via.placeholder.com/48" },
    ],
  },
  {
    id: "gamma",
    name: "Projet Gamma",
    startDate: new Date("2024-03-01"),
    manager: "Claire Legrand",
    team: [
      { id: 6, name: "Emma Durand", email: "emma.durand@mail.com", role: "Membre", status: "active", photo: "https://via.placeholder.com/48" },
    ],
  },
];

// --- Composant Statistique (rectangle)
// Affiche un titre, une valeur et une icône avec un fond coloré
const StatsCard = ({
  title,
  value,
  icon,
  bgClass,
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  bgClass: string;
}) => (
  <motion.div whileHover={{ scale: 1.05 }} className={`flex items-center p-4 ${bgClass} text-gray-800 rounded-xl shadow-lg`}>
    <div className="p-3 bg-white bg-opacity-50 rounded-full mr-4">{icon}</div>
    <div>
      <p className="text-sm">{title}</p>
      <p className="font-bold text-xl">{value}</p>
    </div>
  </motion.div>
);

// --- Composants

// Composant affichant la liste des projets
const ProjectList = ({
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect: (project: Project) => void;
}) => {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-2xl space-y-6">
      <h1 className="flex items-center text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 
        bg-clip-text text-transparent">
        <div className="p-3 rounded-xl" style={{ backgroundColor: primaryColor + "20" }}>
        </div>
        <span className="ml-4">Sélectionnez un projet</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.03 }}
            onClick={() => onSelect(project)}
            className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-xl cursor-pointer 
              border border-transparent hover:border-[3px] hover:border-[#b03ff3] transition"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Début : {project.startDate.toLocaleDateString("fr-FR")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Chef de projet : {project.manager}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Membres : {project.team.length}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Composant affichant le graphique interactif de l'activité de l'équipe
const TeamPerformanceChart = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="p-5 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-xl shadow-lg mt-8"
  >
    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center space-x-2">
      <DocumentChartBarIcon className="w-6 h-6 text-pink-600" />
      <span>Activité de l'Équipe</span>
    </h2>
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={performanceData}>
        <XAxis dataKey="day" stroke={primaryColor} />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: primaryColor }} />
        <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  </motion.div>
);

// Composant affichant les activités récentes
const RecentActivity = () => {
  const activities = [
    { id: 1, message: "Alex Dupont a modifié son profil.", time: "il y a 5 minutes" },
    { id: 2, message: "Marie Leroy a ajouté un nouveau projet.", time: "il y a 20 minutes" },
    { id: 3, message: "Jean Martin a été désactivé.", time: "il y a 1 heure" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <ShieldExclamationIcon className="w-6 h-6" />
        <span>Activités Récentes</span>
      </h2>
      <ul className="space-y-3">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-center space-x-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-pink-500" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {activity.message} <span className="text-xs text-gray-500">{activity.time}</span>
            </p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

// Composant pour afficher et gérer les membres d'un projet
const ProjectDetails = ({
  project,
  onBack,
  onUpdateProject,
}: {
  project: Project;
  onBack: () => void;
  onUpdateProject: (updatedProject: Project) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Statistiques sur les membres
  const totalMembers = project.team.length;
  const activeMembers = project.team.filter((m) => m.status === "active").length;
  const offlineMembers = project.team.filter((m) => m.status !== "active").length;

  // Filtrage des membres
  const filteredTeam = project.team.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mise à jour du rôle d'un membre
  const handleRoleChange = (memberId: number, newRole: Member["role"]) => {
    const updatedTeam = project.team.map((member) =>
      member.id === memberId ? { ...member, role: newRole } : member
    );
    onUpdateProject({ ...project, team: updatedTeam });
  };

  // Suppression d'un membre
  const handleDeleteMember = (memberId: number) => {
    const updatedTeam = project.team.filter((member) => member.id !== memberId);
    onUpdateProject({ ...project, team: updatedTeam });
  };

  // Ajout d'un nouveau membre
  const addMember = (newMember: Omit<Member, "id">) => {
    const nextId = project.team.length ? Math.max(...project.team.map((m) => m.id)) + 1 : 1;
    onUpdateProject({ ...project, team: [...project.team, { id: nextId, ...newMember }] });
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-2xl space-y-6">
      <button onClick={onBack} className="flex items-center text-sm hover:underline" style={{ color: primaryColor }}>
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Retour à la liste des projets
      </button>
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold flex items-center gap-3"
          style={{ color: primaryColor }}
        >
          <div className="p-3 rounded-xl" style={{ backgroundColor: primaryColor + "20" }}>
            <TableCellsIcon className="w-8 h-8" style={{ color: primaryColor }} />
          </div>
          <span className="flex items-center text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 
            bg-clip-text text-transparent">{project.name}</span>
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300">
          Début : {project.startDate.toLocaleDateString("fr-FR")} • Chef de projet : {project.manager}
        </p>
      </div>
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Membres"
          value={totalMembers}
          icon={<UserIcon className="w-6 h-6" style={{ color: accentOrange }} />}
          bgClass="bg-orange-100"
        />
        <StatsCard
          title="Membres Actifs"
          value={activeMembers}
          icon={<UserIcon className="w-6 h-6" style={{ color: accentGreen }} />}
          bgClass="bg-green-100"
        />
        <StatsCard
          title="Membres Hors Ligne"
          value={offlineMembers}
          icon={<ShieldExclamationIcon className="w-6 h-6" style={{ color: accentYellow }} />}
          bgClass="bg-yellow-100"
        />
      </div>
      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Rechercher un membre..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-[#b03ff3] focus:border-[#b03ff3]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-md shadow hover:bg-pink-700 transition"
        >
          Ajouter un membre
        </motion.button>
      </div>
      {/* Liste des membres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredTeam.map((member) => (
          <MemberCard key={member.id} member={member} onRoleChange={handleRoleChange} onDelete={handleDeleteMember} />
        ))}
      </div>
      {filteredTeam.length === 0 && (
        <div className="text-center py-12">
          <p className="mt-4 text-sm text-gray-500">Aucun membre trouvé</p>
        </div>
      )}
      {/* Graphique de performance */}
      <TeamPerformanceChart />
      {/* Activités récentes */}
      <RecentActivity />
      <AnimatePresence>
        {isModalOpen && <AddMemberModal onClose={() => setIsModalOpen(false)} onSubmit={addMember} />}
      </AnimatePresence>
    </div>
  );
};

// Composant affichant une carte de membre avec gestion du rôle et suppression
const MemberCard = ({
  member,
  onRoleChange,
  onDelete,
}: {
  member: Member;
  onRoleChange: (id: number, role: Member["role"]) => void;
  onDelete: (id: number) => void;
}) => (
  <motion.div whileHover={{ scale: 1.02 }} className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-shadow">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <img src={member.photo} alt={member.name} className="h-12 w-12 rounded-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              member.role === "Admin"
                ? "bg-pink-100 text-pink-800"
                : member.role === "Manager"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {member.role}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{member.email}</p>
        <div className="mt-3 flex items-center gap-3">
          <select
            value={member.role}
            onChange={(e) => onRoleChange(member.id, e.target.value as Member["role"])}
            className="block w-full rounded-md border-gray-300  dark:border-gray-600 
              bg-white dark:bg-gray-700  dark:text-white dark:border-gray-600 shadow-sm focus:border-[#b03ff3] focus:ring-[#b03ff3] text-sm"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Membre">Membre</option>
          </select>
          <button onClick={() => onDelete(member.id)} title="Supprimer">
            <TrashIcon className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Modal d'ajout d'un nouveau membre
const AddMemberModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (member: Omit<Member, "id">) => void;
}) => {
  const [newMember, setNewMember] = useState<Omit<Member, "id">>({
    name: "",
    email: "",
    role: "Membre",
    status: "active",
    photo: "https://via.placeholder.com/48",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6" />
          <span>Ajouter un membre</span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
            <input
              name="name"
              type="text"
              value={newMember.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-[#b03ff3] focus:border-[#b03ff3]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              value={newMember.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-[#b03ff3] focus:border-[#b03ff3]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rôle</label>
            <select
              name="role"
              value={newMember.role}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-[#b03ff3] focus:border-[#b03ff3]"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Membre">Membre</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-4 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition">
              Ajouter
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Composant principal ProjectsPage

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects((prev) => prev.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj)));
    if (selectedProject && selectedProject.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-slate-900">
      {!selectedProject ? (
        <ProjectList projects={projects} onSelect={(proj) => setSelectedProject(proj)} />
      ) : (
        <ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} onUpdateProject={handleUpdateProject} />
      )}
    </div>
  );
}
