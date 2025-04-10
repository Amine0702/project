"use client";

import { useState } from "react";
import {
  DocumentArrowDownIcon,
  ChartPieIcon,
  TableCellsIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

// Palette de couleurs personnalisée
const primaryColor = "#b03ff3"; // Mauve dominant
const accentYellow = "#FFC107";
const accentGreen = "#4CAF50";
const accentOrange = "#FF9800";

interface Project {
  id: number;
  name: string;
  dateDebut: string;
  chefProjet: string;
  equipe: string;
}

export default function ExportRapport() {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [schedule, setSchedule] = useState("none"); // "none", "weekly", "monthly"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Liste fictive de projets
  const projects: Project[] = [
    {
      id: 1,
      name: "Projet Alpha",
      dateDebut: "10 Jan 2024",
      chefProjet: "Alice Dupont",
      equipe: "Développement & Design",
    },
    {
      id: 2,
      name: "Projet Beta",
      dateDebut: "15 Feb 2024",
      chefProjet: "Bob Martin",
      equipe: "Marketing & Ventes",
    },
    {
      id: 3,
      name: "Projet Gamma",
      dateDebut: "01 Mar 2024",
      chefProjet: "Claire Dupont",
      equipe: "Innovation",
    },
  ];

  // Fonction de génération du rapport (ici en CSV)
  const generateReport = () => {
    if (!selectedProject) {
      alert("Veuillez sélectionner un projet pour exporter le rapport.");
      return;
    }
    const reportContent =
      "data:text/csv;charset=utf-8," +
      `Projet,${selectedProject.name}\n` +
      `Date de début,${selectedProject.dateDebut}\n` +
      `Chef de projet,${selectedProject.chefProjet}\n` +
      `Équipe,${selectedProject.equipe}\n` +
      `Période,${dateRange.start} - ${dateRange.end}\n` +
      `Planification,${schedule}\n\n` +
      "Catégorie,Temps passé,Productivité\n" +
      "Développement,120h,85%\n" +
      "Réunions,15h,92%\n" +
      "Tests,45h,78%";
    const encodedUri = encodeURI(reportContent);
    const link = document.createElement("a");
    link.setAttribute(
      "download",
      `${selectedProject.name.replace(/\s+/g, "_")}_rapport_${new Date().toISOString()}.csv`
    );
    link.setAttribute("href", encodedUri);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Affichage de la liste des projets si aucun projet n'est sélectionné
  if (!selectedProject) {
    return (
      <section className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-2xl space-y-6">
        <h1 className="flex items-center text-4xl font-extrabold bg-gradient-to-r from-[#b03ff3] to-blue-500 bg-clip-text text-transparent">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: primaryColor + "20" }}
          >
          </div>
          <span className="ml-4">Sélectionnez un projet pour exporter son rapport</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-xl cursor-pointer border border-transparent hover:border-[3px] hover:border-[#b03ff3] transition"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{project.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Début : {project.dateDebut}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Chef : {project.chefProjet}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Équipe : {project.equipe}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Affichage du formulaire d'export pour le projet sélectionné
  return (
    <section className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-2xl space-y-6">
      {/* Bouton de retour */}
      <div className="mb-4">
        <button
          onClick={() => setSelectedProject(null)}
          className="text-sm text-[#b03ff3] hover:underline flex items-center"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Retour à la sélection de projet
        </button>
      </div>

      {/* En-tête */}
      <div className="mb-8 flex items-center">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: primaryColor + "20" }}
        >
          <DocumentArrowDownIcon className="w-8 h-8" style={{ color: primaryColor }} />
        </div>
        <h1 className="ml-4 flex items-center text-4xl font-extrabold bg-gradient-to-r from-[#b03ff3] to-blue-500 bg-clip-text text-transparent">
          Export de Rapports Analytiques
        </h1>
      </div>

      <p className="text-slate-600 dark:text-slate-300">
        Générez et téléchargez un rapport personnalisé pour analyser les performances du projet{" "}
        <span className="font-bold">{selectedProject.name}</span>.
      </p>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des rapports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#b03ff3] placeholder-slate-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-500 dark:text-slate-300" />
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire d'export */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
          <div className="space-y-6">
            {/* Période */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Période
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#b03ff3]"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                  <CalendarIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-500 dark:text-slate-300" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#b03ff3]"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                  <CalendarIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-500 dark:text-slate-300" />
                </div>
              </div>
            </div>

            {/* Format de sortie */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Format de sortie
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["csv", "pdf", "excel"] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`p-3 rounded-lg border transition ${
                      selectedFormat === format
                        ? "border-[#b03ff3] bg-[#b03ff320] dark:bg-[#b03ff330]"
                        : "border-slate-200 hover:border-slate-400 dark:border-slate-600"
                    } text-center dark:text-white`}
                  >
                    <span className="font-medium">{format.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Planification */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Planification d'export
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "none", label: "Manuel" },
                  { value: "weekly", label: "Hebdomadaire" },
                  { value: "monthly", label: "Mensuel" },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSchedule(option.value)}
                    className={`p-3 rounded-lg border transition ${
                      schedule === option.value
                        ? "border-[#b03ff3] bg-[#b03ff320] dark:bg-[#b03ff330]"
                        : "border-slate-200 hover:border-slate-400 dark:border-slate-600"
                    } text-center dark:text-white`}
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rapports disponibles */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
            Rapports Disponibles
          </h3>
          <div className="space-y-4">
            {[
              { type: "time-tracking", label: "Suivi du temps", icon: ChartPieIcon },
              { type: "productivity", label: "Productivité", icon: TableCellsIcon },
            ].map((report) => (
              <div
                key={report.type}
                className="p-4 border border-slate-100 dark:border-slate-700 rounded-lg hover:border-[#b03ff3] cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <report.icon className="w-6 h-6 text-[#b03ff3]" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {report.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphique interactif */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <ChartBarIcon className="w-6 h-6" style={{ color: primaryColor }} />
          <span>Graphique Interactif</span>
        </h3>
        <div className="relative">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className="h-28 bg-gradient-to-t from-[#b03ff320] via-[#b03ff340] to-[#b03ff360] rounded-lg flex items-end justify-center relative overflow-hidden group transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <span className="z-10 text-slate-900 dark:text-white font-bold">
                  {index === 0
                    ? "Performance"
                    : index === 1
                    ? "Productivité"
                    : index === 2
                    ? "Temps Réel"
                    : "Analyse"}
                </span>
                <div className="absolute bottom-0 left-0 right-0 bg-slate-900 bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Détail : {(index + 1) * 20}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton de génération */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
        <div className="flex justify-end">
          <button
            onClick={generateReport}
            className="bg-[#b03ff3] hover:bg-[#9d2dd9] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Générer le rapport</span>
          </button>
        </div>
      </div>
    </section>
  );
}