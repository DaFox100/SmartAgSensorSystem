import { useState } from "react";
import "./WorkerPage.css";

interface Task {
  id: number;
  title: string;
  description: string;
  bedLocation: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
}

interface Bed {
  id: string;
  name: string;
  crop: string;
  plantedDate: string;
  expectedHarvest: string;
  moistureLevel: number;
  healthStatus: "excellent" | "good" | "fair" | "poor";
  lastWatered: string;
}

type SortField = "title" | "bedLocation" | "priority" | "status" | "dueDate";
type SortDirection = "asc" | "desc";

const WorkerPage = () => {
  // Mock task data (will be replaced with backend data later)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Water Bed A-12",
      description: "Moisture levels are below optimal range. Apply 5L of water.",
      bedLocation: "A-12",
      priority: "high",
      status: "pending",
      dueDate: "2026-01-13",
    },
    {
      id: 2,
      title: "Fertilize Bed B-05",
      description: "Apply nitrogen-rich fertilizer to bed B-05.",
      bedLocation: "B-05",
      priority: "medium",
      status: "pending",
      dueDate: "2026-01-14",
    },
    {
      id: 3,
      title: "Check Sensor C-08",
      description: "Sensor is reporting inconsistent readings. Verify and recalibrate.",
      bedLocation: "C-08",
      priority: "medium",
      status: "in-progress",
      dueDate: "2026-01-13",
    },
    {
      id: 4,
      title: "Harvest Bed D-03",
      description: "Crops are ready for harvest in bed D-03.",
      bedLocation: "D-03",
      priority: "high",
      status: "in-progress",
      dueDate: "2026-01-13",
    },
    {
      id: 5,
      title: "Inspect Bed E-15",
      description: "Routine inspection for pests and diseases.",
      bedLocation: "E-15",
      priority: "low",
      status: "completed",
      dueDate: "2026-01-12",
    },
  ]);

  // Mock beds data (will be replaced with backend data later)
  const [beds] = useState<Bed[]>([
    {
      id: "A-12",
      name: "Bed A-12",
      crop: "Tomatoes",
      plantedDate: "2025-12-01",
      expectedHarvest: "2026-02-15",
      moistureLevel: 45,
      healthStatus: "poor",
      lastWatered: "2026-01-11",
    },
    {
      id: "B-05",
      name: "Bed B-05",
      crop: "Lettuce",
      plantedDate: "2025-12-15",
      expectedHarvest: "2026-01-30",
      moistureLevel: 68,
      healthStatus: "good",
      lastWatered: "2026-01-13",
    },
    {
      id: "C-08",
      name: "Bed C-08",
      crop: "Carrots",
      plantedDate: "2025-11-20",
      expectedHarvest: "2026-02-01",
      moistureLevel: 72,
      healthStatus: "good",
      lastWatered: "2026-01-12",
    },
    {
      id: "D-03",
      name: "Bed D-03",
      crop: "Spinach",
      plantedDate: "2025-12-10",
      expectedHarvest: "2026-01-15",
      moistureLevel: 85,
      healthStatus: "excellent",
      lastWatered: "2026-01-13",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  const handleStatusChange = (taskId: number, newStatus: Task["status"]) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getPriorityValue = (priority: string): number => {
    const priorities = { high: 3, medium: 2, low: 1 };
    return priorities[priority as keyof typeof priorities] || 0;
  };

  const getStatusValue = (status: string): number => {
    const statuses = { pending: 1, "in-progress": 2, completed: 3 };
    return statuses[status as keyof typeof statuses] || 0;
  };

  const filteredTasks = filter === "all"
    ? tasks
    : tasks.filter(task => task.status === filter);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "priority":
        aValue = getPriorityValue(a.priority);
        bValue = getPriorityValue(b.priority);
        break;
      case "status":
        aValue = getStatusValue(a.status);
        bValue = getStatusValue(b.status);
        break;
      case "dueDate":
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
        break;
      default:
        aValue = a[sortField];
        bValue = b[sortField];
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getPriorityClass = (priority: string) => {
    return `priority-${priority}`;
  };

  const getStatusClass = (status: string) => {
    return `status-${status}`;
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getHealthStatusClass = (status: string) => {
    return `health-${status}`;
  };

  const getMoistureClass = (level: number) => {
    if (level < 50) return "moisture-low";
    if (level < 70) return "moisture-medium";
    return "moisture-high";
  };

  return (
    <div className="app-container">
      <header className="worker-header">
        <h1>Worker Dashboard</h1>
      </header>

      <div className="card info-card">
        <h2>Worker View</h2>
        <p>
          This page will show tasks, assigned beds, and quick actions for
          workers.
        </p>
      </div>

      {/* Assigned Beds Section */}
      <div className="card beds-card">
        <h2>Assigned Garden Beds</h2>
        <div className="beds-grid">
          {beds.map(bed => (
            <div
              key={bed.id}
              className="bed-card-compact"
              onClick={() => setSelectedBed(bed)}
            >
              <div className="bed-compact-header">
                <h3>{bed.name}</h3>
                <span className={`health-badge ${getHealthStatusClass(bed.healthStatus)}`}>
                  {bed.healthStatus}
                </span>
              </div>
              <div className="bed-compact-info">
                <span className="crop-name">{bed.crop}</span>
                <div className="moisture-compact">
                  <div className="moisture-bar-compact">
                    <div
                      className={`moisture-fill ${getMoistureClass(bed.moistureLevel)}`}
                      style={{ width: `${bed.moistureLevel}%` }}
                    ></div>
                  </div>
                  <span className={`moisture-value-compact ${getMoistureClass(bed.moistureLevel)}`}>
                    {bed.moistureLevel}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bed Detail Modal */}
      {selectedBed && (
        <div className="modal-overlay" onClick={() => setSelectedBed(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBed.name}</h2>
              <button className="modal-close" onClick={() => setSelectedBed(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="modal-status">
                  <span className={`health-badge ${getHealthStatusClass(selectedBed.healthStatus)}`}>
                    {selectedBed.healthStatus}
                  </span>
                </div>
              </div>

              <div className="modal-section">
                <h3>Crop Information</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-row">
                    <span className="modal-label">Crop:</span>
                    <span className="modal-value">{selectedBed.crop}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="modal-label">Planted:</span>
                    <span className="modal-value">{new Date(selectedBed.plantedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="modal-label">Expected Harvest:</span>
                    <span className="modal-value">{new Date(selectedBed.expectedHarvest).toLocaleDateString()}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="modal-label">Last Watered:</span>
                    <span className="modal-value">{new Date(selectedBed.lastWatered).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Moisture Status</h3>
                <div className="moisture-section-modal">
                  <div className="moisture-header">
                    <span className="moisture-label">Current Level</span>
                    <span className={`moisture-value ${getMoistureClass(selectedBed.moistureLevel)}`}>
                      {selectedBed.moistureLevel}%
                    </span>
                  </div>
                  <div className="moisture-bar-large">
                    <div
                      className={`moisture-fill ${getMoistureClass(selectedBed.moistureLevel)}`}
                      style={{ width: `${selectedBed.moistureLevel}%` }}
                    ></div>
                  </div>
                  <div className="moisture-description">
                    {selectedBed.moistureLevel < 50 && "Low moisture - watering needed soon"}
                    {selectedBed.moistureLevel >= 50 && selectedBed.moistureLevel < 70 && "Moderate moisture - monitor regularly"}
                    {selectedBed.moistureLevel >= 70 && "Good moisture level"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Section */}
      <div className="card tasks-card">
        <div className="tasks-header">
          <h2>Assigned Tasks</h2>
          <div className="task-filters">
            <button
              className={filter === "all" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("all")}
            >
              All ({tasks.length})
            </button>
            <button
              className={filter === "pending" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("pending")}
            >
              Pending ({tasks.filter(t => t.status === "pending").length})
            </button>
            <button
              className={filter === "in-progress" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("in-progress")}
            >
              In Progress ({tasks.filter(t => t.status === "in-progress").length})
            </button>
            <button
              className={filter === "completed" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("completed")}
            >
              Completed ({tasks.filter(t => t.status === "completed").length})
            </button>
          </div>
        </div>

        <div className="table-container">
          {sortedTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No {filter !== "all" ? filter : ""} tasks found</p>
            </div>
          ) : (
            <table className="tasks-table">
              <thead>
                <tr>
                  <th
                    className="sortable"
                    onClick={() => handleSort("title")}
                  >
                    Task {getSortIcon("title")}
                  </th>
                  <th>Description</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("bedLocation")}
                  >
                    Bed Location {getSortIcon("bedLocation")}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("priority")}
                  >
                    Priority {getSortIcon("priority")}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("dueDate")}
                  >
                    Due Date {getSortIcon("dueDate")}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map(task => (
                  <tr key={task.id} className={`task-row ${getPriorityClass(task.priority)}`}>
                    <td className="task-title">{task.title}</td>
                    <td className="task-description">{task.description}</td>
                    <td className="bed-location">{task.bedLocation}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(task.status)}`}>
                        {task.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="due-date">{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td className="task-actions">
                      {task.status === "pending" && (
                        <button
                          className="action-btn start-btn"
                          onClick={() => handleStatusChange(task.id, "in-progress")}
                        >
                          Start
                        </button>
                      )}
                      {task.status === "in-progress" && (
                        <>
                          <button
                            className="action-btn complete-btn"
                            onClick={() => handleStatusChange(task.id, "completed")}
                          >
                            Complete
                          </button>
                          <button
                            className="action-btn secondary-btn"
                            onClick={() => handleStatusChange(task.id, "pending")}
                          >
                            Pause
                          </button>
                        </>
                      )}
                      {task.status === "completed" && (
                        <button
                          className="action-btn reopen-btn"
                          onClick={() => handleStatusChange(task.id, "pending")}
                        >
                          Reopen
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerPage;
  