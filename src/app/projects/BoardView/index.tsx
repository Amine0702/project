import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import React, { useState, useRef, ReactNode } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import Image from "next/image";

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

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
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
    attachments: [],
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

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statuses, setStatuses] = useState<string[]>([
    "To Do",
    "Work In Progress",
    "Under Review",
    "Completed",
  ]);

  const moveTask = (taskId: number, toStatus: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: toStatus } : task
      )
    );
  };

  const addStatus = () => {
    const newStatus = prompt("Nom du nouveau statut :");
    if (newStatus && !statuses.includes(newStatus)) {
      setStatuses([...statuses, newStatus]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* On enveloppe le Board dans un conteneur flex-col avec une hauteur définie */}
      <div className="flex flex-col h-full w-full">
        {/* Zone scrollable horizontal qui prend tout l'espace restant */}
        <div className="flex-1 flex items-start gap-4 p-4 overflow-x-auto">
          {statuses.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              moveTask={moveTask}
              setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            />
          ))}

          {/* Colonne pour ajouter un nouveau statut */}
          <div className="min-w-[50px] flex-shrink-0">
            <div className="rounded-lg bg-white dark:bg-dark-secondary shadow p-2 h-full flex items-center justify-center">
              <button
                onClick={addStatus}
                className="flex items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};


type TaskColumnProps = {
  status: string;
  tasks: Task[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.length;

  const statusColor: { [key: string]: string } = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`min-w-[350px] flex-shrink-0 rounded-lg bg-white dark:bg-dark-secondary shadow p-3 transition-colors ${
        isOver ? "bg-blue-50 dark:bg-neutral-800" : ""
      }`}
    >
      {/* En-tête de la colonne */}
      <div className="mb-4 flex items-center">
        <div
          className="w-2 h-6 rounded mr-3"
          style={{ backgroundColor: statusColor[status] || "#cccccc" }}
        />
        <div className="flex-1 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">{status}</h3>
          <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs dark:bg-dark-tertiary dark:text-white">
            {tasksCount}
          </span>
          <div className="ml-2 flex items-center gap-1">
            <button className="text-gray-500 dark:text-neutral-400 hover:text-gray-700">
              <EllipsisVertical size={20} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskComponent key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

type TaskProps = {
  task: Task;
};

const TaskComponent = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags
    ? task.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: Task["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
          ? "bg-green-200 text-green-700"
          : priority === "Low"
          ? "bg-blue-200 text-blue-700"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`rounded-md bg-white dark:bg-dark-secondary shadow p-4 transition-opacity ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Image de la tâche (s'il y en a) */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-3">
          <Image
            src={task.attachments[0].fileURL}
            alt={task.attachments[0].fileName}
            width={400}
            height={200}
            className="w-full h-auto rounded"
          />
        </div>
      )}

      {/* Labels en haut (priorité, tags, etc.) */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-wrap items-center gap-2">
          {task.priority && <PriorityTag priority={task.priority} />}
          {taskTagsSplit.map((tag) => (
            <div
              key={tag}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
            >
              {tag}
            </div>
          ))}
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:text-neutral-500">
          <EllipsisVertical size={20} />
        </button>
      </div>

      {/* Titre et points */}
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
        {typeof task.points === "number" && (
          <div className="text-xs font-semibold dark:text-white">
            {task.points} pts
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="text-xs text-gray-500 dark:text-neutral-400 mb-2">
        {formattedStartDate && <span>{formattedStartDate} - </span>}
        {formattedDueDate && <span>{formattedDueDate}</span>}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-neutral-300 mb-3">
        {task.description}
      </p>

      <hr className="mb-3 border-gray-200 dark:border-stroke-dark" />

      {/* Assignee & Comments */}
      <div className="flex items-center justify-between">
        {/* Avatars */}
        <div className="flex -space-x-2">
          {task.assignee && (
            <Image
              key={task.assignee.userId}
              src={`/${task.assignee.profilePictureUrl}`}
              alt={task.assignee.username}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border-2 border-white dark:border-dark-secondary object-cover"
            />
          )}
          {task.author && (
            <Image
              key={task.author.userId}
              src={`/${task.author.profilePictureUrl}`}
              alt={task.author.username}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border-2 border-white dark:border-dark-secondary object-cover"
            />
          )}
        </div>

        {/* Nombre de commentaires */}
        <div className="flex items-center text-gray-500 dark:text-neutral-400">
          <MessageSquareMore size={18} />
          <span className="ml-1 text-sm">
            {numberOfComments}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
