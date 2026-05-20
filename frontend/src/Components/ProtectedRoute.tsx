import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const {user,loading } = useAuth();
  // LOADING 
  if (loading) {
    return <Loading fullScreen />;
  }
  // USER NOT LOGGED IN
  if (!user) {
    return (<Navigate to="/" replace/> )
  }
  return <Outlet />;
}

export default ProtectedRoute;