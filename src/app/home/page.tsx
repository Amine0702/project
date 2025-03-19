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
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HomePage = () => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  // Récupération de l'utilisateur connecté via Clerk
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return <div>Loading...</div>;

  // Ici, nous utilisons un identifiant local fictif pour la requête des tâches.
  // Dans votre application, remplacez cette valeur par l'identifiant retourné par votre API Laravel.
  const localUserId = 1;

  // Récupération des tâches de l'utilisateur via l'ID local (number)
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksByUserQuery(localUserId);

  // Récupération des projets via l'ID Clerk (string)
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsByClerkUserQuery(user.id);

  if (tasksLoading || projectsLoading) return <div>Loading...</div>;
  if (tasksError || projectsError || !tasks || !projects)
    return <div>Error fetching data</div>;

  // Calcul de la distribution des priorités des tâches
  const priorityCount = tasks.reduce((acc: Record<string, number>, task: Task) => {
    const { priority } = task;
    acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
    return acc;
  }, {});
  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  // Calcul du statut des projets (basé sur la présence ou non d'une date de fin)
  const statusCount = projects.reduce((acc: Record<string, number>, project: Project) => {
    const status = project.endDate ? "Completed" : "Active";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  // Définition du mode sombre (fixé ici à false, adaptez selon votre state)
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
        text: "#000000",
      };

  return (
    <>
      <div className="container h-full w-full bg-gray-100 bg-transparent p-4">
        <ModalNewProject
          isOpen={isModalNewProjectOpen}
          onClose={() => setIsModalNewProjectOpen(false)}
        />

        <div className="flex flex-wrap-reverse gap-2 md:items-center">
          <div className="flex flex-1 items-center gap-2 md:gap-4">
            <Header name="Project Management Dashboard" />
          </div>
          <button
            className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" /> New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Graphique : Distribution des tâches par priorité */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip contentStyle={{ width: "min-content", height: "min-content" }} />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique : Statut des projets */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* DataGrid affichant toutes les tâches de l'utilisateur */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Your Tasks</h3>
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
