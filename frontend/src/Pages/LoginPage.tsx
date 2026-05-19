import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import Loading from "../Components/Loading";
import type{ Role } from "../types/auth.types";

function LoginPage() {
  const { role } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(()=>setLoading(false), 300); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading fullScreen />;

  const typedRole: Role | undefined =
    role === "admin" || role === "sales" ? role : undefined;

  if (!typedRole) {
    return <Navigate to="/" replace />;
  }

  const config = {
    admin: {
      title: "Admin Portal",
      subtitle: "Manage system, users and leads",
    },
    sales: {
      title: "Sales Portal",
      subtitle: "Manage your assigned leads",
    },
  };

  return (
    <LoginForm
      role={typedRole}
      title={config[typedRole].title}
      subtitle={config[typedRole].subtitle}
    />
  );
}

export default LoginPage;