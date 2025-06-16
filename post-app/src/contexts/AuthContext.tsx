import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { authService } from "@/services/FirebaseAuthService";
import { useNavigate } from "react-router";
import type {
  AuthContextValue,
  AuthState,
  SocialProvider,
  User,
} from "@/types/auth.types";

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    resolutionMessage: null,
  });

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const user = authService.getCurrentUser();
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
            resolutionMessage: "User signed in successfully",
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
            resolutionMessage: null,
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const setLoading = (isLoading: boolean) => {
    setAuthState((prev) => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setAuthState((prev) => ({ ...prev, error, isLoading: false }));
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    clearError();

    try {
      const user = await authService.registerWithEmail(name, email, password);
      if (user) {
        setUser(user);
      } else {
        setNullUser();
      }
    } catch (error) {
      setNullUser();
      setError(error instanceof Error ? error.message : "Cannot register");
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    clearError();

    try {
      const user = await authService.loginWithEmail(email, password);
      if (user) {
        setUser(user);
      } else {
        setNullUser();
      }
    } catch (error) {
      setNullUser();
      setError(
        error instanceof Error ? error.message : "Error while logging in"
      );
    }
  };

  const setUser = (user: User) => {
    setAuthState((prev) => ({
      ...prev,
      user,
      isAuthenticated: true,
      isLoading: false,
      resolutionMessage: "User signed in successfully",
    }));
    navigate("/");
  };

  const setNullUser = () => {
    setAuthState((prev) => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      resolutionMessage: null,
    }));
  };

  const loginWithProvider = async (provider: SocialProvider) => {
    setLoading(true);
    clearError();

    try {
      const user = await authService.loginWithProvider(provider);
      if (user) {
        setUser(user);
      } else {
        setNullUser();
      }
    } catch (error) {
      setNullUser();
      setError(
        error instanceof Error
          ? error.message
          : `Error while logging in with ${provider}`
      );
    }
  };

  const linkProvider = async (provider: SocialProvider) => {
    setLoading(true);
    clearError();

    try {
      const user = await authService.linkProvider(provider);
      if (user) {
        setUser(user);
      } else {
        setNullUser();
      }
    } catch (error) {
      setNullUser();
      setError(
        error instanceof Error ? error.message : `Error while linking ${provider}`
      );
    }
  };

  const unlinkProvider = async (provider: SocialProvider) => {
    clearError();

    try {
      const user = await authService.unlinkProvider(provider);
      if (user) {
        setUser(user);
      } else {
        setNullUser();
      }
    } catch (error) {
      setNullUser();
      setError(
        error instanceof Error
          ? error.message
          : `Error while unlinking ${provider}`
      );
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error while logging out"
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        register,
        login,
        loginWithProvider,
        linkProvider,
        unlinkProvider,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
