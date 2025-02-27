"use client";

import React, { ReactNode, useState } from "react";
import { useAppSelector } from "@/app/(components)/redux";
import Header from "@/app/(components)/Header";
import ModalNewTask from "@/app/(components)/ModalNewTask";
import TaskCard from "@/app/(components)/TaskCard";
import { dataGridClassNames, dataGridSxStyles } from "@/app/lib/utils";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// Définition du type Priority selon les valeurs possibles
type Priority = "Urgent" | "High" | "Medium" | "Low" | "Backlog";

type User = {
  userId: number;
  profilePictureUrl: string;
  username: string;
};

type Attachment = {
  fileURL: string;
  fileName: string;
};

type Task = {
  id: number;
  title: string;
  description: ReactNode;
  points: number;
  attachments: Attachment[];
  comments: string | string[];
  dueDate: Date;
  startDate: Date;
  status: string;
  tags: string;
  priority: string;
  // Propriétés optionnelles pour gérer les utilisateurs
  assignee?: User;
  author?: User;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Tâche 1",
    status: "To Do",
    priority: "Urgent",
    startDate: new Date("2025-08-20"),
    dueDate: new Date("2025-08-20"),
    comments: "very good",
    tags: "Network",
    attachments: [
      {
        fileURL: "/i2.jpg",
        fileName: "Image de démonstration",
      },
    ],
    points: 0,
    description: "Task Description",
    assignee: {
      userId: 101,
      profilePictureUrl: "p1.jpeg",
      username: "Alice",
    },
    author: {
      userId: 201,
      profilePictureUrl: "p2.jpeg",
      username: "Bob",
    },
  },
  {
    id: 2,
    title: "Tâche 2",
    status: "Work In Progress",
    priority: "High",
    startDate: new Date("2025-08-20"),
    dueDate: new Date("2025-08-20"),
    comments: "corrige them",
    tags: "Deploiment",
    attachments: [],
    points: 1,
    description: "Task Description",
    assignee: {
      userId: 101,
      profilePictureUrl: "p1.jpeg",
      username: "Alice",
    },
    author: {
      userId: 201,
      profilePictureUrl: "p3.jpeg",
      username: "Bob",
    },
  },
  {
    id: 3,
    title: "Tâche 3",
    status: "Under Review",
    priority: "Medium",
    startDate: new Date("2025-08-20"),
    dueDate: new Date("2025-08-20"),
    comments: "no its very bad",
    tags: "Network",
    attachments: [],
    points: 2,
    description: "Task Description",
    assignee: {
      userId: 101,
      profilePictureUrl: "p1.jpeg",
      username: "Alice",
    },
    author: {
      userId: 201,
      profilePictureUrl: "p4.jpeg",
      username: "Bob",
    },
  },
  {
    id: 4,
    title: "Tâche 4",
    status: "Completed",
    priority: "Low",
    startDate: new Date("2025-08-20"),
    dueDate: new Date("2025-08-20"),
    comments: "ok nice",
    tags: "development",
    attachments: [],
    points: 3,
    description: "Task Description",
    assignee: {
      userId: 101,
      profilePictureUrl: "p1.jpeg",
      username: "Alice",
    },
    author: {
      userId: 201,
      profilePictureUrl: "p5.jpeg",
      username: "Bob",
    },
  },
  {
    id: 5,
    title: "Tâche 5",
    status: "Completed",
    priority: "Backlog",
    startDate: new Date("2025-08-20"),
    dueDate: new Date("2025-08-20"),
    comments: "lets see it",
    tags: "Network , Network",
    attachments: [],
    points: 4,
    description: "Task Description",
    assignee: {
      userId: 101,
      profilePictureUrl: "p1.jpeg",
      username: "Alice",
    },
    author: {
      userId: 201,
      profilePictureUrl: "p6.jpeg",
      username: "Bob",
    },
  },
];

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value?.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState<"list" | "table">("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  // Utilisation des tâches locales sans appel au backend
  const tasks: Task[] = initialTasks;

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Filtrer les tâches selon la priorité passée en props
  const filteredTasks = tasks.filter(
    (task: Task) => task.priority === priority
  );

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${
            view === "list" ? "bg-gray-300" : "bg-white"
          } rounded-l`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${
            view === "table" ? "bg-gray-300" : "bg-white"
          } rounded-r`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {view === "list" ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="z-0 w-full">
          <DataGrid
            rows={filteredTasks}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.id}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      )}
    </div>
  );
};

export default ReusablePriorityPage;
