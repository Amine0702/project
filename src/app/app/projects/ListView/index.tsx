import Header from '@/app/app/(components)/Header';
import React, { ReactNode } from 'react'
import TaskCard from '@/app/app/(components)/TaskCard';


type Props = {
    id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
type User = {
    userId: number;
    profilePictureUrl: string;
    username: string;
  };
type Task = {
  description: ReactNode;
  points: number;
  attachments: any[];
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

function ListView({ id, setIsModalNewTaskOpen }: Props) {
    return (
        <div className="px-4 pb-8 xl:px-6">
          <div className="pt-5">
            <Header
              name="List"
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {initialTasks?.map((task: Task) => (
                <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      );
}

export default ListView