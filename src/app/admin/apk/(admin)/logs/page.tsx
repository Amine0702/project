"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// Palette de couleurs
const primaryColor = "#b03ff3"; // mauve dominant
const accentYellow = "#FFC107";
const accentGreen = "#4CAF50";
const accentOrange = "#FF9800";

// Types de données

interface LogEntry {
  id: string;
  timestamp: string; // format "YYYY-MM-DD HH:mm:ss"
  nom: string; // nom ou titre de l'action
  contenu: string; // contenu complet
}

type Projet = {
  id: string;
  nom: string;
  dateDebut: Date;
  chefProjet: string;
  equipe: string;
};

// Données simulées pour les projets
const projets: Projet[] = [
  { id: "alpha", nom: "Projet Alpha", dateDebut: new Date("2024-01-10"), chefProjet: "Alice Dupont", equipe: "Développement & Design" },
  { id: "beta", nom: "Projet Beta", dateDebut: new Date("2024-02-15"), chefProjet: "Bob Martin", equipe: "Marketing & Ventes" },
  { id: "gamma", nom: "Projet Gamma", dateDebut: new Date("2024-03-01"), chefProjet: "Claire Legrand", equipe: "Innovation & R&D" },
];

// Logs simulés pour chaque projet
const logsData: { [projetId: string]: LogEntry[] } = {
  alpha: [
    {
      id: "log1",
      timestamp: "2024-03-15 10:15:00",
      nom: "Création ticket Kanban",
      contenu: "Fichier log : Ticket créé par IA, action réalisée par Alice Dupont, le 15/03/2024 à 10:15.",
    },
    {
      id: "log2",
      timestamp: "2024-03-16 09:30:00",
      nom: "Résumé de réunion",
      contenu: "Fichier log : Résumé généré par IA pour la réunion du 16/03/2024, projet Alpha.",
    },
  ],
  beta: [
    {
      id: "log3",
      timestamp: "2024-03-17 11:20:00",
      nom: "Mise à jour de statut",
      contenu: "Fichier log : Statut mis à jour par IA pour le projet Beta le 17/03/2024.",
    },
  ],
  gamma: [
    {
      id: "log4",
      timestamp: "2024-03-18 14:45:00",
      nom: "Création d'un rapport",
      contenu: "Fichier log : Rapport généré par IA pour le projet Gamma, le 18/03/2024.",
    },
  ],
};

const ProjectList = ({
  onSelect,
}: {
  onSelect: (projet: Projet) => void;
}) => {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-2xl space-y-6 transition-all duration-300">
      <h1 className="flex items-center text-4xl font-extrabold bg-gradient-to-r from-[#b03ff3] to-blue-500 bg-clip-text text-transparent">
        <div className="p-3 rounded-xl" style={{ backgroundColor: primaryColor + "20" }}></div>
        <span className="ml-4">Sélectionnez un projet</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projets.map((projet) => (
          <motion.div
            key={projet.id}
            whileHover={{ scale: 1.03 }}
            onClick={() => onSelect(projet)}
            className="p-6 bg-gray-50  dark:text-white dark:bg-slate-700 rounded-2xl shadow-xl cursor-pointer border border-transparent hover:border-[3px] hover:border-[#b03ff3] transition"
          >
            <h3 className="text-xl font-bold mb-2">{projet.nom}</h3>
            <p className="text-sm">Début : {projet.dateDebut.toLocaleDateString("fr-FR")}</p>
            <p className="text-sm">Chef : {projet.chefProjet}</p>
            <p className="text-sm">Équipe : {projet.equipe}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProjectLogs = ({
  projet,
  logs,
  onBack,
}: {
  projet: Projet;
  logs: LogEntry[];
  onBack: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Filtrer les logs par nom et par date
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.nom.toLowerCase().includes(search.toLowerCase());
    const matchesDate = dateFilter ? log.timestamp.startsWith(dateFilter) : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-2xl space-y-6 transition-all duration-300">
      <button
        onClick={onBack}
        className="flex items-center text-sm hover:underline transition-colors"
        style={{ color: primaryColor }}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Retour à la liste des projets
      </button>
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        {projet.nom} - Journal d'Activité
      </h2>

      {/* Filtres de recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center border rounded p-2 focus-within:ring-2 focus-within:ring-[#b03ff3] transition">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Filtrer par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none bg-transparent"
          />
        </div>
        <div className="flex items-center border rounded p-2 focus-within:ring-2 focus-within:ring-[#b03ff3] transition">
          <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="AAAA-MM-JJ"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Liste des logs */}
      <div className="space-y-3">
        {filteredLogs.length ? (
          filteredLogs.map((log) => (
            <motion.div
              key={log.id}
              whileHover={{ scale: 1.01 }}
              className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer border border-transparent hover:border-2 hover:border-[#b03ff3] transition-all duration-300"
              onClick={() => setSelectedLog(log)}
            >
              <p className="font-semibold">{log.nom}</p>
              <p className="text-xs text-gray-500">{log.timestamp}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600">Aucun log trouvé.</p>
        )}
      </div>

      {/* Détail du log (modal) */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setSelectedLog(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">{selectedLog.nom}</h3>
              <p className="text-xs text-gray-500 mb-2">{selectedLog.timestamp}</p>
              <p className="text-sm">{selectedLog.contenu}</p>
              <button
                className="mt-4 px-4 py-2 bg-[#b03ff3] text-white rounded hover:bg-opacity-90 transition-colors"
                onClick={() => setSelectedLog(null)}
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<Projet | null>(null);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      {!selectedProject ? (
        <ProjectList onSelect={(projet) => setSelectedProject(projet)} />
      ) : (
        <ProjectLogs
          projet={selectedProject}
          logs={logsData[selectedProject.id] || []}
          onBack={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
