import { useAppSelector } from '../../(components)/redux';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { ReactNode, useMemo, useState } from "react";

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

type Props = {
    id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";


function TimeLineView({ id, setIsModalNewTaskOpen }: Props) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      initialTasks?.map((task) => ({
        start: new Date(task.startDate ),
        end: new Date(task.dueDate ),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [initialTasks]);

  {/* for change mounth week day changed to */}
  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
            barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
          />
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeLineView