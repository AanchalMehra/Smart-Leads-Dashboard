import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import Loading from "../Components/Loading";
import type { Role } from "../types/auth.types";

const VALID_ROLES: Role[] = ["admin", "sales"];

const config = {
  admin: { title: "Admin Portal", subtitle: "Manage system, users and leads" },
  sales: { title: "Sales Portal", subtitle: "Manage your assigned leads" },
};

function LoginPage() {
  const { role } = useParams<{ role: string }>();
  const { user, loading } = useAuth();

  if (loading) return <Loading fullScreen />;

  // Already logged in → go to dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  // Invalid role in URL → back to landing
  if (!role || !VALID_ROLES.includes(role as Role)) {
    return <Navigate to="/" replace />;
  }

  const typedRole = role as Role;

  return (
    <LoginForm
      role={typedRole}
      title={config[typedRole].title}
      subtitle={config[typedRole].subtitle}
    />
  );
}

export default LoginPage;