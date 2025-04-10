import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import Image from "next/image";
import {
  EllipsisVertical,
  MessageSquareMore,
  Plus,
  Trash,
} from "lucide-react";
import ModalNewTask from "@/app/(components)/ModalNewTask";
import TaskDetailModal from "@/app/projects/TaskDetailModal";
import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "@/app/state/api";
import { Task as TaskType } from "@/app/state/api";

type BoardProps = {
  id: string;
};

const BoardView = ({ id }: BoardProps) => {
  // Utilisation d'une clé unique basée sur l'ID du projet
  const localStorageKey = `statuses-${id}`;
  // Récupération des statuts depuis localStorage ou valeur par défaut
  const [statuses, setStatuses] = useState<string[]>(() => {
    const storedStatuses = localStorage.getItem(localStorageKey);
    return storedStatuses
      ? JSON.parse(storedStatuses)
      : ["To Do", "Work In Progress", "Under Review", "Completed"];
  });
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  useEffect(() => {
    // Sauvegarder les statuts dans localStorage pour ce projet uniquement
    localStorage.setItem(localStorageKey, JSON.stringify(statuses));
  }, [statuses, localStorageKey]);

  // Ajout d'un nouveau statut (colonne)
  const addStatus = () => {
    const newStatus = prompt("Nom du nouveau statut :");
    if (newStatus && !statuses.includes(newStatus)) {
      setStatuses([...statuses, newStatus]);
    }
  };

  // Suppression d'un statut (colonne)
  const deleteStatus = (statusToDelete: string) => {
    if (confirm(`Voulez-vous supprimer le statut "${statusToDelete}" ?`)) {
      setStatuses(statuses.filter((status) => status !== statusToDelete));
    }
  };

  const { data: tasks, isLoading, error } = useGetTasksQuery({
    projectId: Number(id),
  });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  // Déplacement d'une tâche d'une colonne à l'autre
  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  // Réordonnancement des colonnes
  const moveColumn = (draggedStatus: string, hoveredStatus: string) => {
    const draggedIndex = statuses.indexOf(draggedStatus);
    const hoveredIndex = statuses.indexOf(hoveredStatus);
    if (draggedIndex < 0 || hoveredIndex < 0 || draggedIndex === hoveredIndex)
      return;
    const updatedStatuses = [...statuses];
    updatedStatuses.splice(draggedIndex, 1);
    updatedStatuses.splice(hoveredIndex, 0, draggedStatus);
    setStatuses(updatedStatuses);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>Une erreur est survenue lors du chargement des tâches</div>
    );

  // Fonction appelée lors du clic sur une tâche pour ouvrir la modale de détails
  const handleSelectTask = (task: TaskType) => {
    setSelectedTask(task);
  };

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
                moveColumn={moveColumn}
                onSelectTask={handleSelectTask} // Passage de la fonction ici
              />
            ))}
            <div className="min-w-[50px] flex-shrink-0">
              <div className="rounded-lg bg-white dark:bg-dark-secondary shadow p-2 h-full flex items-center justify-center">
                <button
                  onClick={addStatus}
                  className="flex items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                  <Plus size={16} /> Ajouter statut
                </button>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>

      {isModalNewTaskOpen && (
        <ModalNewTask
          isOpen={isModalNewTaskOpen}
          onClose={() => setIsModalNewTaskOpen(false)}
          statuses={statuses}
          id={id}
        />
      )}

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </>
  );
};

export default BoardView;

//
// ----------- Composants internes -----------
//

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  deleteStatus: (status: string) => void;
  deleteTask: (taskId: number) => void;
  onSelectTask: (task: TaskType) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
  deleteStatus,
  deleteTask,
  onSelectTask,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;
  const normalizedStatus = status.toLowerCase();
  const statusColor: Record<string, string> = {
    "to do": "#2563EB",
    "work in progress": "#059669",
    "under review": "#D97706",
    "completed": "#000000",
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
          className="w-2 rounded-s-lg"
          style={{
            backgroundColor: statusColor[normalizedStatus] ?? "#cccccc",
          }}
        />
        <div className="flex-1 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">
            {status}
          </h3>
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
          <Task 
            key={task.id} 
            task={task} 
            deleteTask={deleteTask} 
            onSelect={onSelectTask} 
          />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
  deleteTask: (taskId: number) => void;
  onSelect: (task: TaskType) => void;
};

const Task = ({ task, deleteTask, onSelect }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
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

  const PriorityTag = ({
    priority,
  }: {
    priority: TaskType["priority"];
  }) => (
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
      onClick={() => onSelect(task)}
      style={{ cursor: "pointer" }}
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
          <button
            className="text-gray-600 hover:text-red-800"
            onClick={() => deleteTask(task.id)}
          >
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

type DraggableColumnProps = Omit<TaskColumnProps, "deleteTask"> & {
  moveColumn: (draggedStatus: string, hoveredStatus: string) => void;
  onSelectTask: (task: TaskType) => void;
};

const DraggableColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
  deleteStatus,
  moveColumn,
  onSelectTask,
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

  // Mutation pour supprimer une tâche
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const handleDeleteTask = async (taskId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await deleteTaskMutation(taskId);
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
        deleteStatus={deleteStatus}
        deleteTask={handleDeleteTask}
        onSelectTask={onSelectTask}
      />
    </div>
  );
};
