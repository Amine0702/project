import { EllipsisVertical, MessageSquareMore, Plus, Trash } from "lucide-react";
import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import Image from "next/image";
import { useGetTasksQuery, useUpdateTaskStatusMutation,useDeleteTaskMutation } from "@/app/state/api";
import { Task as TaskType } from "@/app/state/api";
import ModalNewTask from "@/app/(components)/ModalNewTask"; // Assure-toi d'importer le modal

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const BoardView = ({ id }: BoardProps) => {
  // Initialisation des statuts avec une valeur par défaut
  const [statuses, setStatuses] = useState<string[]>([
    "To Do",
    "Work In Progress",
    "Under Review",
    "Completed",
  ]);


  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const addStatus = () => {
    const newStatus = prompt("Nom du nouveau statut :");
    if (newStatus && !statuses.includes(newStatus)) {
      setStatuses([...statuses, newStatus]);
    }
  };

  // Fonction pour supprimer un statut (colonne)
  const deleteStatus = (statusToDelete: string) => {
    if (confirm(`Voulez-vous supprimer le statut "${statusToDelete}" ?`)) {
      setStatuses(statuses.filter((status) => status !== statusToDelete));
    }
  };

  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  // Fonction de réordonnancement des colonnes
  const moveColumn = (draggedStatus: string, hoveredStatus: string) => {
    const draggedIndex = statuses.indexOf(draggedStatus);
    const hoveredIndex = statuses.indexOf(hoveredStatus);
    if (draggedIndex < 0 || hoveredIndex < 0 || draggedIndex === hoveredIndex) return;
    const updatedStatuses = [...statuses];
    updatedStatuses.splice(draggedIndex, 1);
    updatedStatuses.splice(hoveredIndex, 0, draggedStatus);
    setStatuses(updatedStatuses);
  };
  
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-full w-full">
          <div className="flex-1 flex items-start gap-4 p-4 overflow-x-auto">
            {statuses.map((status) => (
              <DraggableColumn
                key={status}
                status={status}
                tasks={tasks || []}
                moveTask={moveTask}
                setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                deleteStatus={deleteStatus}
                moveColumn={moveColumn} deleteTask={function (taskId: number): void {
                  throw new Error("Function not implemented.");
                } }              />
            ))}
            <div className="min-w-[50px] flex-shrink-0">
              <div className="rounded-lg bg-white dark:bg-dark-secondary shadow p-2 h-full flex items-center justify-center">
                <button
                  onClick={addStatus}
                  className="flex items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                  <Plus size={16} /> Add status
                </button>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
      
      {/* Modal pour créer une nouvelle tâche */}
      {isModalNewTaskOpen && (
        <ModalNewTask
          isOpen={isModalNewTaskOpen}
          onClose={() => setIsModalNewTaskOpen(false)}
          statuses={statuses} // On transmet les statuts du projet
          id={id} // id du projet
        />
      )}
    </>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  deleteTask: (taskId: number) => void; // Fonction deleteTask existante
  deleteStatus: (status: string) => void; // Fonction pour supprimer le statut (colonne)
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
  deleteTask,
  deleteStatus,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: any = {
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
      <div className="mb-4 flex items-center">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] || "#cccccc" }}
        />
        <div className="flex-1 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">{status} </h3>
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
            <button
              className="text-gray-600 hover:text-red-800"
              onClick={() => deleteStatus(status)}
            >
              <Trash size={20} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} deleteTask={deleteTask} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
  deleteTask: (taskId: number) => void;
};

const Task = ({ task, deleteTask }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
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

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`rounded-md bg-white dark:bg-dark-secondary shadow p-4 transition-opacity ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}

      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-wrap items-center gap-2">
          {task.priority && <PriorityTag priority={task.priority} />}
          {taskTagsSplit.map((tag) => (
            <div key={tag} className="rounded-full bg-blue-100 px-2 py-1 text-xs">
              {tag}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
        <button className="text-gray-600 hover:text-red-800" onClick={() => deleteTask(task.id)}>
        <Trash size={20} />
      </button>
          <button className="text-gray-400 hover:text-gray-600 dark:text-neutral-500">
            <EllipsisVertical size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-1">
        <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
        {typeof task.points === "number" && (
          <div className="text-xs font-semibold dark:text-white">
            {task.points} pts
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-neutral-400 mb-2">
        {formattedStartDate && <span>{formattedStartDate} - </span>}
        {formattedDueDate && <span>{formattedDueDate}</span>}
      </div>

      <p className="text-sm text-gray-600 dark:text-neutral-300 mb-3">
        {task.description}
      </p>

      <hr className="mb-3 border-gray-200 dark:border-stroke-dark" />

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {task.assignee && (
            <Image
              key={task.assignee.userId}
              src={`/${task.assignee.profilePictureUrl!}`}
              alt={task.assignee.username}
              width={30}
              height={30}
              className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
            />
          )}
          {task.author && (
            <Image
              key={task.author.userId}
              src={`/${task.author.profilePictureUrl!}`}
              alt={task.author.username}
              width={30}
              height={30}
              className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
            />
          )}
        </div>

        <div className="flex items-center text-gray-500 dark:text-neutral-400">
          <MessageSquareMore size={18} />
          <span className="ml-1 text-sm">{numberOfComments}</span>
        </div>
      </div>
    </div>
  );
};

type DraggableColumnProps = TaskColumnProps & {
  moveColumn: (draggedStatus: string, hoveredStatus: string) => void;
};

const DraggableColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,

  deleteStatus,
  moveColumn,
}: DraggableColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COLUMN",
    item: { status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover(item: { status: string }) {
      if (!ref.current) return;
      if (item.status !== status) {
        moveColumn(item.status, status);
      }
    },
  });
  const [deleteTask] = useDeleteTaskMutation();

  const handleDeleteTask = async (taskId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error("Erreur lors de la suppression de la tâche :", error);
      }
    }
  };

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <TaskColumn
  status={status}
  tasks={tasks}
  moveTask={moveTask}
  setIsModalNewTaskOpen={setIsModalNewTaskOpen}
  deleteTask={handleDeleteTask } // Passer la fonction ici
  deleteStatus={deleteStatus}
/>
    </div>
  );
};

export default BoardView;
