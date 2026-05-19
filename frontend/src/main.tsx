import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./Pages/LoginPage.tsx";
import Signup from "./Pages/Signup.tsx";
import LandingPage from "./Pages/LandingPage.tsx";

import ProtectedRoute from "./Components/ProtectedRoute.tsx";
import AppLayout from "./Components/AppLayout.tsx"

import Dashboard from "./Pages/Dashboard.tsx";
import LeadsPage from "./Pages/Lead.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import UsersPage from "./Pages/UserPage.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login/:role",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },


  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />, 
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/leads",
            element: <LeadsPage />,
          },
          {
            path: "/users",
            element: <UsersPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
       <ThemeProvider>
        <RouterProvider router={router} />
       </ThemeProvider>
  </AuthProvider>
      
      <Toaster />
      
   
  </StrictMode>
);