import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const NavBar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/loginPage");
  };

  return (
    <nav className="nav-shell">
      <Link to="/home" className="nav-logo">SmartAg</Link>

      <div className="nav-links">
        <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>Home</Link>
        <Link to="/workerPage" className={location.pathname === "/workerPage" ? "active" : ""}>Worker</Link>
        {user?.role === "admin" && (
          <Link to="/adminPage" className={location.pathname === "/adminPage" ? "active" : ""}>Admin</Link>
        )}
        {user ? (
          <>
            <span className="nav-username">👤 {user.username}</span>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/loginPage" className={location.pathname === "/loginPage" ? "active" : ""}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
