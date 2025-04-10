"use client";

import React from "react";
import Header from "@/app/(components)/Header";

type Risk = {
  id: number;
  title: string;
  severity: "Faible" | "Moyen" | "Élevé";
  probability: number; // en pourcentage
  mitigation: string;
};

const mockRisks: Risk[] = [
  {
    id: 1,
    title: "Retard de livraison",
    severity: "Élevé",
    probability: 70,
    mitigation: "Planifier des marges de sécurité et des réunions de suivi régulières.",
  },
  {
    id: 2,
    title: "Problèmes techniques",
    severity: "Moyen",
    probability: 50,
    mitigation: "Prévoir des ressources de dépannage et des tests fréquents.",
  },
  {
    id: 3,
    title: "Dépendance fournisseur",
    severity: "Faible",
    probability: 30,
    mitigation: "Diversifier les fournisseurs et négocier des contrats flexibles.",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Élevé":
      return "bg-red-500";
    case "Moyen":
      return "bg-yellow-500";
    case "Faible":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const RiskManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <Header
        name="Risk Management Dashboard"
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500"
      />
      <div className="space-y-4">
        {mockRisks.map((risk) => (
          <div key={risk.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">{risk.title}</h4>
              <span
                className={`px-3 py-1 text-sm font-medium text-white rounded-full ${getSeverityColor(
                  risk.severity
                )}`}
              >
                {risk.severity}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-gray-700">
                <span className="font-medium">Probabilité :</span>{" "}
                {risk.probability}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${risk.probability}%` }}
                ></div>
              </div>
            </div>
            <p className="mt-3 text-gray-600">
              <span className="font-medium">Mitigation :</span>{" "}
              {risk.mitigation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskManagement;
