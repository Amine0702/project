"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios"; // Utilisation d'Axios pour l'appel API

import ProjectHeader from "../ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import TimeLineView from "../TimeLineView";
import TableView from "../TableView";
import ModalNewTask from "../../(components)/ModalNewTask";

type Props = {
  params: { id: string };
};

const Project = ({ params }: Props) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const invitedEmail = searchParams.get("email");

  const { user, isLoaded } = useUser();

  // Dès que Clerk a chargé et s'il n'y a pas d'utilisateur, rediriger vers la page de connexion.
  useEffect(() => {
    if (isLoaded && !user) {
      const redirectUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
      router.push(`/sign-in?redirect_url=${redirectUrl}`);
    }
  }, [isLoaded, user, router]);

  // Afficher un indicateur de chargement tant que Clerk n'a pas chargé l'utilisateur
  if (!isLoaded || !user) {
    return <p>Loading...</p>;
  }

  // Vérifier que l'email de l'utilisateur correspond à celui de l'invitation
  const userEmail = user.emailAddresses?.[0]?.emailAddress;

  // Mettre à jour le clerkUserId dans la base de données si l'email correspond
  useEffect(() => {
    if (invitedEmail && userEmail === invitedEmail) {
      axios
        .post(`http://127.0.0.1:8000/api/project-teams/update-clerk`, {
          email: invitedEmail,
          clerkUserId: user.id, // Le Clerk User ID
        })
        .then((response) => {
          console.log("Clerk UserId mis à jour", response.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour du Clerk UserId", error);
        });
    }
  }, [invitedEmail, userEmail, user]);

  if (invitedEmail && userEmail !== invitedEmail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-center">
          Vous êtes connecté(e) avec {userEmail}.<br />
          Cette invitation est destinée à {invitedEmail}.<br />
          Veuillez vous déconnecter et vous connecter avec le bon compte.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {invitedEmail && (
        <div className="bg-blue-100 text-blue-700 p-2 text-center">
          Bienvenue, {invitedEmail} !
        </div>
      )}

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
  );
};

export default Project;
