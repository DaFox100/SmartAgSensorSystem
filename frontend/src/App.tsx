import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import WorkerPage from "./pages/WorkerPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import { DateRangeProvider } from "./context/DataRangeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function RequireRole({ role, children }: { role: string; children: React.ReactElement }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/loginPage" replace />;
  if (user.role !== role) return <Navigate to="/home" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <DateRangeProvider>
        <Router>
          <Layout />
        </Router>
      </DateRangeProvider>
    </AuthProvider>
  );
}

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/loginPage" || location.pathname === "/signupPage";

  return (
    <>
      {!hideNavbar && <NavBar />}

      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<Home />} />
          <Route path="/workerPage" element={<WorkerPage />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/signupPage" element={<SignupPage />} />

          <Route
            path="/adminPage"
            element={
              <RequireRole role="admin">
                <AdminPage />
              </RequireRole>
            }
          />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
