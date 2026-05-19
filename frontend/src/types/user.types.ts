export type UserRole = "admin" | "sales";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
export interface UsersResponse {
  data: User[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}