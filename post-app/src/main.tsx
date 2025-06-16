import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import LoginPage from "./pages/login/LoginPage.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import { StrictMode } from "react";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import EditProfilePage from "./components/auth/EditProfile.tsx";
import UserProfile from "./components/auth/UserProfile.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<UserProfile />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
