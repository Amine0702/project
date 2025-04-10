"use client";

import React, { useState } from "react";
import Header from "@/app/(components)/Header";

type Idea = {
  id: number;
  content: string;
};

const InnovationHub = () => {
  const [ideas, setIdeas] = useState<Idea[]>([
    { id: 1, content: "Nouvelle fonctionnalité de collaboration en temps réel" },
    { id: 2, content: "Intégration d'un chatbot intelligent pour le support" },
  ]);
  const [newIdea, setNewIdea] = useState("");

  const addIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIdea.trim() === "") return;
    const idea: Idea = { id: Date.now(), content: newIdea };
    setIdeas((prev) => [idea, ...prev]);
    setNewIdea("");
  };

  return (
    <div className="container mx-auto p-6">
      <Header
        name="Innovation Hub"
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
      />
      <form onSubmit={addIdea} className="mb-6">
        <div className="flex">
          <input
            type="text"
            placeholder="Ajoutez une nouvelle idée..."
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r transition"
          >
            Ajouter
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-yellow-100 p-4 rounded shadow-lg transform hover:scale-105 transition duration-200"
          >
            <p className="text-gray-800">{idea.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InnovationHub;
