import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import WorkerPage from "./pages/WorkerPage";
import LoginPage from "./pages/LoginPage";

import { DateRangeProvider } from "./context/DataRangeContext";
import "./App.css";              // ✅ add this line


function App() {
  return (
    <DateRangeProvider>
       <Router>
        <Layout />
      </Router>
    </DateRangeProvider>
    );
}

function Layout() {
  const location = useLocation();

  // Hide navbar on login page if you want:
  const hideNavbar = location.pathname === "/loginPage";

  return (
    <>
      {!hideNavbar && <NavBar />}

      {/* Global layout wrapper */}
      <div className="app-container">
        <Routes>
          {/* Default path redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Your actual pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/workerPage" element={<WorkerPage />} />
          <Route path="/loginPage" element={<LoginPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
