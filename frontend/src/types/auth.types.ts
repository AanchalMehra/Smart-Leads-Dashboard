
export type Role = "admin" | "sales";

/* =========================
   USER TYPE
========================= */

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

/* =========================
   LOGIN FORM TYPE
========================= */

export type LoginFormProps = {
  role: Role;
  title: string;
  subtitle: string;
};
/* =========================
   SIGNUP FORM TYPE
========================= */

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
};