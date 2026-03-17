import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminPage.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

interface Worker {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

interface CreatedCredentials {
  username: string;
  temp_password: string;
}

const AdminPage = () => {
  const { user } = useAuth();

  // Create worker form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);

  // Workers list
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let pwd = "";
    for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setTempPassword(pwd);
  };

  const fetchWorkers = async () => {
    if (!user) return;
    setLoadingWorkers(true);
    try {
      const res = await fetch(`${API_URL}/admin/workers?admin_id=${user.id}`);
      const data = await res.json();
      setWorkers(data.workers ?? []);
    } catch {
      // silently fail — list stays empty
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [user]);

  const handleCreateWorker = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreatedCredentials(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/admin/create-worker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_id: user!.id,
          username,
          email,
          temp_password: tempPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "Failed to create worker");
      } else {
        setCreatedCredentials({ username: data.worker.username, temp_password: data.worker.temp_password });
        setUsername("");
        setEmail("");
        setTempPassword("");
        fetchWorkers();
      }
    } catch {
      setFormError("Could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Panel</h1>

      {/* CREATE WORKER */}
      <div className="admin-card">
        <h2>Create Worker Account</h2>
        <form onSubmit={handleCreateWorker} className="admin-form">
          <div className="admin-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="worker_username"
              disabled={isSubmitting}
            />
          </div>

          <div className="admin-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="worker@example.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="admin-field">
            <label>Temporary Password</label>
            <div className="password-row">
              <input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Min 8 characters"
                disabled={isSubmitting}
              />
              <button type="button" className="generate-btn" onClick={generatePassword}>
                Generate
              </button>
            </div>
          </div>

          {formError && <div className="admin-error">{formError}</div>}

          <button type="submit" className="admin-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create Worker"}
          </button>
        </form>

        {/* CREDENTIALS CARD */}
        {createdCredentials && (
          <div className="credentials-card">
            <p className="credentials-label">Worker account created — share these credentials:</p>
            <div className="credentials-row">
              <span className="cred-key">Username</span>
              <span className="cred-val">{createdCredentials.username}</span>
            </div>
            <div className="credentials-row">
              <span className="cred-key">Password</span>
              <span className="cred-val">{createdCredentials.temp_password}</span>
            </div>
            <p className="credentials-note">This password will not be shown again.</p>
          </div>
        )}
      </div>

      {/* WORKERS LIST */}
      <div className="admin-card">
        <h2>My Workers</h2>
        {loadingWorkers ? (
          <p className="admin-muted">Loading…</p>
        ) : workers.length === 0 ? (
          <p className="admin-muted">No workers yet.</p>
        ) : (
          <table className="workers-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id}>
                  <td>{w.username}</td>
                  <td>{w.email}</td>
                  <td>{w.created_at ? w.created_at.replace("T", " ") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
