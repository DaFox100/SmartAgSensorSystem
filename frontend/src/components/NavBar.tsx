import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="nav-shell">
      <Link to="/home" className="nav-logo">SmartAg</Link>

      <div className="nav-links">
        <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>Home</Link>
        <Link to="/workerPage" className={location.pathname === "/workerPage" ? "active" : ""}>Worker</Link>
        <Link to="/adminPage" className={location.pathname === "/adminPage" ? "active" : ""}>Admin</Link>
        <Link to="/loginPage" className={location.pathname === "/loginPage" ? "active" : ""}>Login</Link>
      </div>
    </nav>
  );
};

export default NavBar;
