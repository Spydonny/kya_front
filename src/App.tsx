import { useState } from "react";
import AgentPage from "./components/AgentPage";
import Dashboard from "./components/Dashboard";
import Demo from "./components/Demo";
import Explorer from "./components/Explorer";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Register from "./components/Register";

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
    <div className="min-h-screen bg-[#eef3f0] text-gray-900">
      <Navbar currentPage={page} onNavigate={setPage} />
      {pageContent}
    </div>
  );
}
