import type { ReactNode } from "react";
import type { Role } from "./auth.types";

export type DashboardLayoutProps = {
  children: ReactNode;
};


export type DashboardStats = {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number; 
  qualifiedLeads: number;
  lostLeads: number; 
};

export type DashboardData = {
  role: Role;
  user: {
    name: string;
    email: string;
  };
  stats?: DashboardStats;
};

export type DashboardProps = {
  data: DashboardData;
};

export type StatCardProps = {
  title: string;
  value: number | string;
  color?: string;
};