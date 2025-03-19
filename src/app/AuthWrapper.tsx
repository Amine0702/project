"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useCreateUserMutation } from "./state/api";
import ConditionalDashboardWrapper from "./ConditionalDashboardWrapper";

const LoadingIndicator = () => (
  <div className="flex justify-center items-center min-h-screen">
    <span>Loading...</span>
  </div>
);

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [createUser, { error, isLoading: apiLoading }] = useCreateUserMutation();
  const [isUserCreated, setIsUserCreated] = useState(false);

  useEffect(() => {
    // Quand Clerk est chargé et l'utilisateur connecté, on synchronise avec Laravel si pas encore créé
    if (authLoaded && userLoaded && isSignedIn && user && !isUserCreated) {
      const userData = {
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName ?? "",
        clerkUserId: user.id,
        profilePictureUrl: user.imageUrl,
      };

      console.log("Envoi des données à l'API Laravel :", userData);

      createUser(userData)
        .unwrap()
        .then((response) => {
          console.log("Réponse de l'API Laravel :", response);
          setIsUserCreated(true);
        })
        .catch((err) => console.error("Erreur API Laravel :", err));
    }
  }, [authLoaded, userLoaded, isSignedIn, user, isUserCreated, createUser]);

  if (!authLoaded || !userLoaded || (isSignedIn && !isUserCreated && apiLoading)) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Erreur lors de la synchronisation utilisateur: {JSON.stringify(error)}</p>
      </div>
    );
  }

  return isSignedIn ? (
    <ConditionalDashboardWrapper>{children}</ConditionalDashboardWrapper>
  ) : (
    <>{children}</>
  );
}
