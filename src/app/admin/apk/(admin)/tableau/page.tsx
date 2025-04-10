"use client";

import { useState, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  TableCellsIcon,
  Cog8ToothIcon,
  PencilIcon,
  EyeIcon,
  LockOpenIcon,
  ArchiveBoxIcon,
  DocumentChartBarIcon,
  ShieldExclamationIcon,
  ArrowUpTrayIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

// Palette de couleurs
const primaryColor = "#b03ff3"; // mauve dominant
const accentYellow = "#FFC107";
const accentGreen = "#4CAF50";
const accentOrange = "#FF9800";
const accentPurple = "#9b59b6"; // ou la valeur de votre choix

// --- Données simulées pour le graphique d'activité des tableaux
const performanceData = [
  { day: "Lun", count: 2 },
  { day: "Mar", count: 3 },
  { day: "Mer", count: 5 },
  { day: "Jeu", count: 4 },
  { day: "Ven", count: 6 },
];

// --- Types et données initiales

// Type pour un tableau (board)
type BoardPermission = "read" | "write" | "admin";
type Board = {
  id: number;
  name: string;
  permissions: BoardPermission;
  lastModified: Date;
};

// Type pour un projet qui possède ses propres tableaux
type Project = {
  id: string;
  name: string;
  startDate: Date;
  manager: string;
  boards: Board[];
};

// Données simulées pour les projets
const initialProjects: Project[] = [
  {
    id: "alpha",
    name: "Projet Alpha",
    startDate: new Date("2024-01-10"),
    manager: "Alice Dupont",
    boards: [
      { id: 1, name: "Roadmap Produit", permissions: "admin", lastModified: new Date("2024-03-15") },
      { id: 2, name: "Suivi des Bugs", permissions: "write", lastModified: new Date("2024-03-14") },
      { id: 3, name: "Backlog Sprint", permissions: "read", lastModified: new Date("2024-03-13") },
    ],
  },
  {
    id: "beta",
    name: "Projet Beta",
    startDate: new Date("2024-02-15"),
    manager: "Bob Martin",
    boards: [
      { id: 4, name: "Analytics UX", permissions: "write", lastModified: new Date("2024-03-12") },
    ],
  },
  {
    id: "gamma",
    name: "Projet Gamma",
    startDate: new Date("2024-03-01"),
    manager: "Claire Legrand",
    boards: [],
  },
];

// --- Composant StatCard – affiche une statistique dans un rectangle
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
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`flex items-center p-5 ${bgClass} rounded-xl shadow-lg`}
  >
    <div className="p-3 bg-white bg-opacity-30 rounded-full mr-4">{icon}</div>
    <div>
      <p className="text-sm">{title}</p>
      <p className="font-bold text-xl">{value}</p>
    </div>
  </motion.div>
);

// Calcule des statistiques sur les tableaux
const getBoardStats = (boards: Board[]) => {
  const total = boards.length;
  const admin = boards.filter(b => b.permissions === "admin").length;
  const write = boards.filter(b => b.permissions === "write").length;
  const read = boards.filter(b => b.permissions === "read").length;
  return { total, admin, write, read };
};

// Renvoie les détails d'affichage en fonction de la permission
const getPermissionDetails = (permission: BoardPermission) => {
  switch (permission) {
    case "admin":
      return { color: "bg-pink-100 text-pink-800 ", icon: Cog8ToothIcon, label: "Administrateur" };
    case "write":
      return { color: "bg-blue-100 text-blue-800", icon: PencilIcon, label: "Écriture" };
    case "read":
      return { color: "bg-green-100 text-green-800", icon: EyeIcon, label: "Lecture" };
  }
};

// Composant Header affichant le titre, la date et un slogan inspirant
const Header = ({ currentDate }: { currentDate: Date }) => (
  <div className="mb-8">
    <motion.h1
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center space-x-3"
    >
      <TableCellsIcon className="w-10 h-10" style={{ color: primaryColor }} />
      <span>Dashboard – Gestion des Tableaux</span>
    </motion.h1>
    <p className="text-gray-600 dark:text-gray-300 mt-2">
      Bonjour, aujourd'hui c'est le{" "}
      {currentDate.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
    <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-400">
      Permissions Intelligentes – Le Contrôle à Portée de Main
    </p>
  </div>
);

// Composant RecentActivity affichant les dernières actions
const RecentActivity = () => {
  const recentActivities = [
    { id: 1, message: "Roadmap Produit a été mis à jour.", time: "il y a 10 minutes" },
    { id: 2, message: "Suivi des Bugs a changé de permissions.", time: "il y a 30 minutes" },
    { id: 3, message: "Backlog Sprint a été consulté.", time: "il y a 1 heure" },
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
        {recentActivities.map((activity) => (
          <li key={activity.id} className="flex items-center space-x-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-pink-500" style={{ color: accentOrange }} />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {activity.message} <span className="text-xs text-gray-500">{activity.time}</span>
            </p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

// Composant graphique interactif pour l'activité des tableaux
const BoardActivityChart = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="p-5 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-xl shadow-lg mt-8"
  >
    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center space-x-2">
      <DocumentChartBarIcon className="w-6 h-6 text-pink-600" style={{ color: accentGreen }} />
      <span>Activité des Tableaux</span>
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

// Composant modal pour ajouter un nouveau tableau
const AddBoardModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (board: Omit<Board, "id" | "lastModified">) => void;
}) => {
  const [newBoard, setNewBoard] = useState({ name: "", permissions: "read" as BoardPermission });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBoard((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newBoard);
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
          <Cog8ToothIcon className="w-6 h-6" />
          <span>Ajouter un Tableau</span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom du Tableau</label>
            <input
              name="name"
              type="text"
              value={newBoard.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-[primaryColor] focus:border-[primaryColor]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</label>
            <select
              name="permissions"
              value={newBoard.permissions}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md  border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-[primaryColor] focus:border-[primaryColor]"
            >
              <option value="read">Lecture</option>
              <option value="write">Écriture</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-4 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-[#b03ff3] text-white rounded-md hover:bg-[#9c33c3] transition">
              Ajouter
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Composant ProjectList affichant la liste des projets
const ProjectList = ({
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect: (project: Project) => void;
}) => {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-2xl space-y-6">
      <h1 className="flex items-center text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
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
            className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-xl cursor-pointer border border-transparent hover:border-[3px] hover:border-[#b03ff3] transition"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Début : {project.startDate.toLocaleDateString("fr-FR")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Chef de projet : {project.manager}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Tableaux : {project.boards.length}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Composant ProjectDetails pour la gestion des tableaux d'un projet
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

  // Statistiques sur les tableaux du projet
  const { total, admin, write, read } = getBoardStats(project.boards);

  // Filtrage des tableaux
  const filteredBoards = project.boards.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mise à jour d'une permission de tableau
  const handleBoardPermissionChange = (boardId: number, newPermission: BoardPermission) => {
    const updatedBoards = project.boards.map((board) =>
      board.id === boardId ? { ...board, permissions: newPermission, lastModified: new Date() } : board
    );
    onUpdateProject({ ...project, boards: updatedBoards });
  };

  // Ajout d'un nouveau tableau
  const addBoard = (newBoard: Omit<Board, "id" | "lastModified">) => {
    const nextId = project.boards.length ? Math.max(...project.boards.map(b => b.id)) + 1 : 1;
    onUpdateProject({ ...project, boards: [...project.boards, { id: nextId, ...newBoard, lastModified: new Date() }] });
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
          <span className="flex items-center text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            {project.name}
          </span>
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300">
          Début : {project.startDate.toLocaleDateString("fr-FR")} • Chef de projet : {project.manager}
        </p>
      </div>
      {/* Cartes statistiques pour les tableaux */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tableaux"
          value={total}
          icon={<TableCellsIcon className="w-6 h-6 text-black" style={{ color: accentOrange }} />}
          bgClass="bg-orange-100 text-black"
        />
        <StatsCard
          title="Admins"
          value={admin}
          icon={<Cog8ToothIcon className="w-6 h-6 text-white" style={{ color: accentGreen }} />}
          bgClass="bg-green-100"
        />
        <StatsCard
          title="Écriture"
          value={write}
          icon={<PencilIcon className="w-6 h-6 text-white" style={{ color: accentPurple }} />}
          bgClass="bg-blue-100"
        />
        <StatsCard
          title="Lecture"
          value={read}
          icon={<EyeIcon className="w-6 h-6 text-black" style={{ color: accentGreen }} />}
          bgClass="bg-green-100 text-black"
        />
      </div>
      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Rechercher un tableau..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-[#b03ff3] focus:border-[#b03ff3]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-pink-700 transition"
        >
          Ajouter un Tableau
        </motion.button>
      </div>
      {/* Grille des tableaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredBoards.map((board) => {
          const { color, icon: BoardIcon, label } = getPermissionDetails(board.permissions);
          return (
            <motion.div
              key={board.id}
              whileHover={{ scale: 1.02 }}
              className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                <div className="p-3 rounded-xl" style={{ backgroundColor: primaryColor + "20" }}>
                <TableCellsIcon className="w-5 h-5 text-white  "  style={{ color: accentGreen }}/>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{board.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                      <BoardIcon className="w-4 h-4"  />
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Dernière modification :{" "}
                    {new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(
                      board.lastModified
                    )}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <select
                      value={board.permissions}
                      onChange={(e) => handleBoardPermissionChange(board.id, e.target.value as BoardPermission)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:border-gray-600 
              bg-white dark:bg-gray-700  dark:text-white shadow-sm focus:border-[#b03ff3] focus:ring-[#b03ff3] text-sm"
                    >
                      <option value="read">Lecture</option>
                      <option value="write">Écriture</option>
                      <option value="admin">Administrateur</option>
                    </select>
                    <LockOpenIcon className="w-5 h-5 text-gray-400 dark:text-gray-300"  />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {filteredBoards.length === 0 && (
        <div className="text-center py-12">
          <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
          <p className="mt-4 text-sm text-gray-500">Aucun tableau trouvé</p>
        </div>
      )}
      {/* Graphique d'activité */}
      <BoardActivityChart />
      {/* Activités récentes */}
      <RecentActivity />
      <AnimatePresence>
        {isModalOpen && (
          <AddBoardModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={(newBoard) => {
              const nextId = project.boards.length ? Math.max(...project.boards.map(b => b.id)) + 1 : 1;
              addBoard(newBoard);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant principal ProjectsPage regroupant la liste des projets et la gestion d'un projet sélectionné
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(proj => (proj.id === updatedProject.id ? updatedProject : proj)));
    if (selectedProject && selectedProject.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-slate-900">
      {!selectedProject ? (
        <ProjectList projects={projects} onSelect={(proj) => setSelectedProject(proj)} />
      ) : (
        <ProjectDetails
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
          onUpdateProject={handleUpdateProject}
        />
      )}
    </div>
  );
}
