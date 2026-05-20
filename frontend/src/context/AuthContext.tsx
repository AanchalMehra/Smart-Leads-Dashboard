import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"
import type { Role } from "../types/auth.types";
import type { User } from "../types/auth.types";


type AuthContextType = {
  user:User|null;
  token:string|null;
  loading:boolean;
  login:(email: string, password: string, role: Role) => Promise<User>;
  logout:()=>void;
  refreshSession:()=> Promise<void>;
};

type Props = {
  children: React.ReactNode;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* PROVIDER COMPONENT*/

export function AuthProvider({ children }: Props){
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState<boolean>(true);

/* REFRESH SESSION (AUTO LOGIN ON REFRESH)*/

  const refreshSession = async (): Promise<void> => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken){
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try{
      const { data } = await api.get<{ user: User }>("/auth/session");
      setUser(data.user);
    } 
    catch{
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } 
    finally{
      setLoading(false);
    }
  }

/* RUN ON APP LOAD*/

  useEffect(() => {refreshSession()}, []);

/* LOGIN FUNCTION*/

  const login= async (
    email:string,
    password:string,
    role:Role
  ): Promise<User> => {
    const {data}= await api.post<{
      token: string;
      user: User;
    }>("/auth/login", {
      email,
      password,
      role,
    });

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

/* LOGOUT FUNCTION
 */

  const logout = (): void => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

/* CONTEXT VALUE*/

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* CUSTOM HOOK (SAFE ACCESS)*/

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);

  if (!ctx){
    throw new Error("USEAUTH MUST BE USED INSIDE AUTHPROVIDER");
  }

  return ctx;
}