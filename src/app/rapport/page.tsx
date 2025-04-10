"use client";

import React, { useState } from "react";
import Header from "@/app/(components)/Header";

const AutomatedReport = () => {
  const [project, setProject] = useState("Tous les projets");
  const [period, setPeriod] = useState("Dernier mois");
  const [reportType, setReportType] = useState("Synthèse");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de génération de rapport
    alert("Rapport généré avec succès !");
  };

  return (
    <div className="container mx-auto p-6">
      <Header
        name="Automated Report Generator"
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400"
      />
      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h4 className="text-xl font-semibold mb-4">Paramètres du Rapport</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Projet</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option>Tous les projets</option>
              <option>Projet Alpha</option>
              <option>Projet Beta</option>
              <option>Projet Gamma</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Période</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option>Dernier mois</option>
              <option>Dernier trimestre</option>
              <option>Dernière année</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Type de Rapport</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option>Synthèse</option>
              <option>Détail</option>
            </select>
          </div>
        </div>
        <button type="submit" className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition">
          Générer le Rapport
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h4 className="text-2xl font-bold mb-4">Aperçu du Rapport</h4>
        <p className="text-gray-700">
          Rapport généré pour <strong>{project}</strong> durant <strong>{period}</strong> sous forme de <strong>{reportType}</strong>.  
          <br />
          Ce rapport inclut les indicateurs clés du projet, les statistiques de performance et une analyse détaillée des tâches.
        </p>
      </div>
    </div>
  );
};

export default AutomatedReport;
