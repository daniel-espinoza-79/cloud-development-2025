import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import ScreenLoader from "../ui/ScreenLoader";

const ProtectedRoute = ({children}: {children: ReactNode}) => {
    const { authState: { user ,isLoading} } = useAuth();

    if (isLoading) return <ScreenLoader/>;

    if (!user) return <Navigate to="/login" />;

    return <>{children}</>;
};

export default ProtectedRoute;