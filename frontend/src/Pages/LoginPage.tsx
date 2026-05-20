import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import Loading from "../Components/Loading";
import type{ Role } from "../types/auth.types";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(()=>setLoading(false), 300); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading fullScreen />;

  const typedRole: Role | undefined =user?.role === "admin"||user?.role==="sales" 
     ? user?.role :undefined;

  if (!typedRole){return <Navigate to="/" replace />}

  const config= {
    admin: {
      title:"Admin Portal",
      subtitle:"Manage system, users and leads",
    },
    sales:{
      title:"Sales Portal",
      subtitle:"Manage your assigned leads",
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