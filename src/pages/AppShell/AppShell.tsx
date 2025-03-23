import { useAuth } from "../../context/AuthContext";
import { AuthScreen } from "../AuthScreen";
import { Avatar, Button, Separator, Text } from "@radix-ui/themes";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { SideBar } from "../../components/SideBar";
import "./AppShell.css";
import { Home } from "../Home";
import { TasksPage } from "../Tasks";

export const AppShell = () => {
  const { user, logout, isAuthLoading, authError } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const route = useNavigate();
  if (isAuthLoading) {
    return (
      <div className="app-loading">
        <Text size="4">Loading session...</Text>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="auth-error">
        <Text color="red" size="3">
          {authError}
        </Text>
        <AuthScreen />
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  const handleSetSideBar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleClickHome = () => {
    route("/");
  };
  return (
    <div className="app-shell">
      <header className="app-header">
        <Text
          onClick={handleClickHome}
          size="7"
          weight="bold"
          className="header-title"
        >
          Tasky
        </Text>
        <div className="header-right">
          <Avatar fallback={user.name?.charAt(0).toUpperCase() || "?"} />
          <Button variant="ghost" onClick={logout} className="logout-button">
            Logout
          </Button>
        </div>
      </header>

      <Separator size="4" />

      <div className="app-body">
        <SideBar
          sidebarOpen={sidebarOpen}
          handleSetSideBar={handleSetSideBar}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
