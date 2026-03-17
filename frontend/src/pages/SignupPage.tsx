import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Signup failed");
      } else {
        setSuccess(`Account created! (${data.user.role}) — redirecting to login…`);
        setTimeout(() => navigate("/loginPage"), 1500);
      }
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>SmartAg Sensor System</h1>
          <p>Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              style={{
                background: "var(--bg-alt)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                color: "var(--text)",
                fontSize: "1rem",
                outline: "none",
              }}
            >
              <option value="admin">Admin</option>
              <option value="worker">Worker</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div
              className="error-message"
              style={{
                background: "rgba(33, 230, 182, 0.15)",
                borderColor: "rgba(33, 230, 182, 0.4)",
                color: "#a8eee0",
              }}
            >
              {success}
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/loginPage")}
              style={{ color: "var(--primary)", cursor: "pointer" }}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
