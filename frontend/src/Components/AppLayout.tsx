import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle"; 
import type { JSX } from "react";

function AppLayout(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-main transition-colors duration-200">

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="flex-1 p-4 bg-canvas">
        <Outlet />
      </main>

      <ThemeToggle />

    </div>
  );
}

export default AppLayout;