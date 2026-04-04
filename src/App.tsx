import { useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import AgentPage from "./components/AgentPage";
import Demo from "./components/Demo";
import Explorer from "./components/Explorer";

export default function App() {
  const [page, setPage] = useState<string>("landing");

  const pageContent =
    page === "register" ? (
      <Register />
    ) : page === "dashboard" ? (
      <Dashboard onNavigate={setPage} />
    ) : page === "agent" ? (
      <AgentPage />
    ) : page === "demo" ? (
      <Demo />
    ) : page === "explorer" ? (
      <Explorer onNavigate={setPage} />
    ) : (
      <Landing onNavigate={setPage} />
    );

  return (
    <div className="min-h-screen bg-emerald-50 text-gray-900">
      <Navbar currentPage={page} onNavigate={setPage} />
      {pageContent}
    </div>
  );
}
