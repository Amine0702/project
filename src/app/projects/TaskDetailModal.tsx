import React from "react";
import { X } from "lucide-react";
import { Task as TaskType } from "@/app/state/api";

type TaskDetailModalProps = {
  task: TaskType;
  onClose: () => void;
};

const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-3">
          {task.title}
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {task.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <strong>Statut :</strong>
              </p>
              <p className="text-base text-gray-800 dark:text-gray-100">
                {task.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <strong>Date de début :</strong>
              </p>
              <p className="text-base text-gray-800 dark:text-gray-100">
                {task.startDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <strong>Date d'échéance :</strong>
              </p>
              <p className="text-base text-gray-800 dark:text-gray-100">
                {task.dueDate}
              </p>
            </div>
            {task.priority && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <strong>Priorité :</strong>
                </p>
                <p className="text-base text-gray-800 dark:text-gray-100">
                  {task.priority}
                </p>
              </div>
            )}
          </div>

          {task.assignee && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Assigné à
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={`/${task.assignee.profilePictureUrl}`}
                  alt={task.assignee.username}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                />
                <span className="text-base text-gray-800 dark:text-gray-100">
                  {task.assignee.username}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
