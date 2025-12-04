const AdminPage = () => {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Admin Panel</h1>
        </header>
  
        <main className="dashboard-container">
          <div className="card">
            <h2>Admin View</h2>
            <p>
              This page is for farm-level configuration, user management, sensor
              setup, etc. We’ll protect it by role later.
            </p>
          </div>
        </main>
      </div>
    );
  };
  
  export default AdminPage;
  