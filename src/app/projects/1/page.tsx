"use client";
import React, { useState } from 'react'
import ProjectHeader from '../ProjectHeader'
import Board from '../BoardView'
import List from '../ListView'
import TimeLineView from '../TimeLineView'
import TableView from '../TableView'
import ModalNewTask from '../../(components)/ModalNewTask'

type Props = {
  params: { id: string };
};

const Project = ({ params }: Props) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === "Board" && (
          <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === "List" && (
          <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === "Timeline" && (
          <TimeLineView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === "Table" && (
          <TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
      </main>
    </div>
  )
}

export default Project;
