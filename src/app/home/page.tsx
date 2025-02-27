"use client";
import React, { ReactNode } from 'react';
import { useAppSelector } from "@/app/(components)/redux";
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
  status: string;
  priority: string;
  startDate: Date;
  dueDate: Date;
  comments: string | string[];
  tags: string;
  attachments: Attachment[];
  points: number;
  description: ReactNode;
  assignee?: User;
  author?: User;
};

type Project = {
  id: number;
  name: string;
  endDate?: Date;
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
    attachments: [{ fileURL: "/i2.jpg", fileName: "Image de démonstration" }],
    points: 0,
    description: "Task Description",
    assignee: { userId: 101, profilePictureUrl: "p1.jpeg", username: "Alice" },
    author: { userId: 201, profilePictureUrl: "p2.jpeg", username: "Bob" },
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
    priority: "Urgent",
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

const initialProjects: Project[] = [
  { id: 1, name: "Project 1", endDate: new Date("2025-12-31") },
  { id: 2, name: "Project 2" },
  { id: 3, name: "Project 3", endDate: new Date("2025-12-31") },
  { id: 4, name: "Project 4" },  
  { id: 5, name: "Project 5" },
  { id: 6, name: "Project 6" },
];

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

const priorityCount = initialTasks.reduce((acc: Record<string, number>, task: Task) => {
  acc[task.priority] = (acc[task.priority] || 0) + 1;
  return acc;
}, {});

const taskDistribution = Object.keys(priorityCount).map((key) => ({
  name: key,
  count: priorityCount[key],
}));

const statusCount = initialProjects.reduce((acc: Record<string, number>, project: Project) => {
  const status = project.endDate ? "Completed" : "Active";
  acc[status] = (acc[status] || 0) + 1;
  return acc;
}, {});

const projectStatus = Object.keys(statusCount).map((key) => ({
  name: key,
  count: statusCount[key],
}));


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function HomePage() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const tasksLoading = false;

  const chartColors = isDarkMode
    ? { bar: "#8884d8", barGrid: "#303030", pieFill: "#4A90E2", text: "#FFFFFF" }
    : { bar: "#8884d8", barGrid: "#E0E0E0", pieFill: "#82ca9d", text: "#000000" };

  return (
    <div className="container h-full w-full bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Project Status</h3>
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
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Your Tasks</h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={initialTasks}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
