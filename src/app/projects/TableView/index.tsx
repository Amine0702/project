import React, { ReactNode } from 'react'
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { useAppSelector } from "@/app/(components)/redux";
import { dataGridClassNames, dataGridSxStyles } from "@/app/lib/utils";



type User = {
  userId: number;
  profilePictureUrl: string;
  username: string;
};

type Task = {
  description: ReactNode;
  points: number;
  attachments: Attachment[];
  comments: string | string[];
  dueDate: Date;
  startDate: Date;
  id: number;
  title: string;
  status: string;
  tags: string;
  priority: string;
  // Propriétés optionnelles pour gérer les utilisateurs
  assignee?: User;
  author?: User;
};
type Attachment = {
  fileURL: string;
  fileName: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Tâche 1",
    status: "To Do",
    priority: "Urgent",
    startDate: new Date("2025-08-20"),
    dueDate: new Date("2025-09-20"),
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
    startDate: new Date("2025-08-26"),
    dueDate: new Date("2025-10-20"),
    comments: "corrige them",
    tags: "Deploiment",
    attachments: [],
    points: 1,
    description: "Task Description",
    assignee: {
      userId: 101,
      profilePictureUrl: "p1.jpeg",
      username: "jhon",
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
    startDate: new Date("2025-08-25"),
    dueDate: new Date("2025-09-20"),
    comments: "no its very bad",
    tags: "Network",
    attachments: [],
    points: 2,
    description: "Task Description",
    assignee: {
      userId: 101,
      profilePictureUrl: "p1.jpeg",
      username: "amine",
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
      username: "ahmed",
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
      username: "mohamed",
    },
    author: {
      userId: 201,
      profilePictureUrl: "p6.jpeg",
      username: "Bob",
    },
  },
];

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
    renderCell: (params) => {
      if (params.value === "To Do") {
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
            {params.value}
          </span>
        );
      } else if (params.value === "Work In Progress") {
        return (
          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
            {params.value}
          </span>
        );
      } else if (params.value === "Under Review") {
        return (
          <span className="inline-flex rounded-full bg-orange-100 px-2 text-xs font-semibold leading-5 text-orange-800">
            {params.value}
          </span>
        );
      } else if (params.value === "Completed") {
        return (
          <span className="inline-flex rounded-full bg-black-100 px-2 text-xs font-semibold leading-5 text-black-800">
            {params.value}
          </span>
        );
      }
      return <span>{params.value}</span>;
    },
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



type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

function TableView({ id, setIsModalNewTaskOpen }: Props) {
  
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <DataGrid
        rows={initialTasks || []}
        columns={columns}
        className={dataGridClassNames}
        sx={dataGridSxStyles(isDarkMode)}
      />
    </div>
  )
}

export default TableView