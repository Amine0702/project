"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
    }
  }, [isLoaded, user, router]);

  // Afficher un indicateur de chargement tant que Clerk n'a pas chargé l'utilisateur
  if (!isLoaded || !user) {
    return <p>Loading...</p>;
  }

  // Vérifier que l'email de l'utilisateur correspond à celui de l'invitation
  const userEmail = user.emailAddresses?.[0]?.emailAddress;
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
