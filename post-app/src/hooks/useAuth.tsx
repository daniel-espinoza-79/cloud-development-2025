import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { AuthContextValue } from "@/types/auth.types";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};
