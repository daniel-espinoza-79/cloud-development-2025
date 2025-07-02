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
import UserProfilePage from "./pages/profile/UserProfilePage.tsx";
import PostsPage from "./pages/posts/PostsPage.tsx";
import { RefreshPostProvider } from "./contexts/RefeshPostContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>

        <RefreshPostProvider>
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
            <Route index element={<PostsPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
          </Route>
        </Routes>
        </RefreshPostProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
