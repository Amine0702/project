"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Priority,
  Project,
  Task,
  useGetProjectsByClerkUserQuery,
  useGetTasksByUserQuery,
} from "@/app/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/app/lib/utils";
import ModalNewProject from "../projects/ModalNewProject";
import { PlusSquare } from "lucide-react";

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 220 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HomePage = () => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  // Récupération de l'utilisateur via Clerk
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        Loading...
      </div>
    );

  // Identifiant local fictif pour les tâches
  const localUserId = 1;

  // Requêtes API
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksByUserQuery(localUserId);

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsByClerkUserQuery(user.id);

  if (tasksLoading || projectsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        Loading...
      </div>
    );
  if (tasksError || projectsError || !tasks || !projects)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold text-red-500">
        Error fetching data
      </div>
    );

  // Distribution des priorités
  const priorityCount = tasks.reduce((acc: Record<string, number>, task: Task) => {
    const { priority } = task;
    acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
    return acc;
  }, {});
  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  // Statut des projets
  const statusCount = projects.reduce((acc: Record<string, number>, project: Project) => {
    const status = project.endDate ? "Completed" : "Active";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  // Paramètres de couleurs pour les graphiques
  const isDarkMode = false;
  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#333333",
      };

  return (
    <>
      {/* En-tête créatif */}
      <div className="container mx-auto px-6 py-6">
        <ModalNewProject
          isOpen={isModalNewProjectOpen}
          onClose={() => setIsModalNewProjectOpen(false)}
        />
        <div className="flex flex-wrap-reverse items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-4">
            <Header
              name="Project Management Dashboard"
            />
          </div>
          <button
            className="flex items-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3 text-white shadow-2xl transition transform hover:scale-105"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            <PlusSquare className="mr-2 h-6 w-6" /> New Project
          </button>
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-6 pb-8 md:grid-cols-2">
        {/* Carte : Distribution des tâches */}
        <div className="rounded-2xl bg-white/70 p-6 shadow-2xl ring-1 ring-white/30 backdrop-blur-sm dark:bg-gray-800/70 dark:ring-gray-700">
          <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid strokeDasharray="4 4" stroke={chartColors.barGrid} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#333" : "#f9fafb",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Legend wrapperStyle={{ color: chartColors.text, fontSize: "14px" }} />
              <Bar dataKey="count" fill={chartColors.bar} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Carte : Statut des projets */}
        <div className="rounded-2xl bg-white/70 p-6 shadow-2xl ring-1 ring-white/30 backdrop-blur-sm dark:bg-gray-800/70 dark:ring-gray-700">
          <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill={chartColors.pieFill} label>
                {projectStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#333" : "#f9fafb",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Legend wrapperStyle={{ color: chartColors.text, fontSize: "14px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Carte DataGrid : Vos tâches */}
        <div className="rounded-2xl bg-white/70 p-6 shadow-2xl ring-1 ring-white/30 backdrop-blur-sm dark:bg-gray-800/70 dark:ring-gray-700 md:col-span-2">
          <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Your Tasks</h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              sx={dataGridSxStyles(isDarkMode)}
              className={dataGridClassNames}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;