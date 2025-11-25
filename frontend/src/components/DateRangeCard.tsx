import { useEffect } from "react";
import { useDateRange } from "../context/DataRangeContext.tsx";

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function DateRangeCard() {
  const {
    rangeMode,
    setRangeMode,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useDateRange();

  // Whenever the mode changes (and it's not custom), compute dates
  useEffect(() => {
    const now = new Date();

    if (rangeMode === "24h") {
      const start = new Date(now);
      start.setDate(start.getDate() - 1); // last 24h ≈ previous day
      setStartDate(formatDate(start));
      setEndDate(formatDate(now));
    } else if (rangeMode === "week") {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      setStartDate(formatDate(start));
      setEndDate(formatDate(now));
    } else if (rangeMode === "month") {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      setStartDate(formatDate(start));
      setEndDate(formatDate(now));
    } else if (rangeMode === "custom") {
      // don't auto-change dates; user will set with inputs
      // if you want to initialize, you could do it here
    }
  }, [rangeMode, setStartDate, setEndDate]);

  const handleModeChange = (mode: "24h" | "week" | "month" | "custom") => {
    setRangeMode(mode);
  };

  const showCustomInputs = rangeMode === "custom";

  return (
    <div className="card">
      <h3>Date Range</h3>

      {/* Preset buttons or radios */}
      <div className="date-range-options">
        <button
          type="button"
          className={rangeMode === "24h" ? "active" : ""}
          onClick={() => handleModeChange("24h")}
        >
          24 hrs
        </button>
        <button
          type="button"
          className={rangeMode === "week" ? "active" : ""}
          onClick={() => handleModeChange("week")}
        >
          Week
        </button>
        <button
          type="button"
          className={rangeMode === "month" ? "active" : ""}
          onClick={() => handleModeChange("month")}
        >
          Month
        </button>
        <button
          type="button"
          className={rangeMode === "custom" ? "active" : ""}
          onClick={() => handleModeChange("custom")}
        >
          Custom
        </button>
      </div>

      {/* Custom date inputs (only when mode = custom) */}
      {showCustomInputs && (
        <div className="date-range-inputs">
          <div>
            <label htmlFor="start-date">Start</label>
            <input
              id="start-date"
              type="date"
              value={startDate ?? ""}
              onChange={(e) =>
                setStartDate(e.target.value || null)
              }
            />
          </div>

          <div>
            <label htmlFor="end-date">End</label>
            <input
              id="end-date"
              type="date"
              value={endDate ?? ""}
              onChange={(e) =>
                setEndDate(e.target.value || null)
              }
            />
          </div>
        </div>
      )}

      {/* Optional: display current effective range (for debugging / clarity) */}
      <div className="date-range-summary">
        <small>
          Active range:{" "}
          {startDate || endDate
            ? `${startDate ?? "?"} → ${endDate ?? "?"}`
            : "All data"}
        </small>
      </div>
    </div>
  );
}
