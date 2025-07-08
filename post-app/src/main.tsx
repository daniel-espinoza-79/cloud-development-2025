import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import LoginPage from "./pages/login/LoginPage.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import { StrictMode } from "react";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import GenrePage from "./pages/genres/GenrePage.tsx";
import ArtistPage from "./pages/artists.tsx/ArtistPage.tsx";
import SongsPage from "./pages/songs/SongsPage.tsx";
import { Toaster } from "react-hot-toast";
import UserRolePage from "./pages/user-roles/UserRolePage.tsx";
import UserProfile from "./components/auth/UserProfile.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
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
            <Route index element={<GenrePage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/genres/:id" element={<ArtistPage />} />
            <Route
              path="/genres/:genreId/artists/:artistId"
              element={<SongsPage />}
            />
            <Route path="user-roles" element={<UserRolePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
