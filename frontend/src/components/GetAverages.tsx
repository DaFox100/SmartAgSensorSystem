import React, { useState } from "react";
import Card from "./Card";
import { Calendar as CalendarIcon } from "lucide-react"; // calendar icon
import "./GetAverages.css";

interface AveragesData {
  avg_temp: number;
  avg_humidity: number;
  avg_soil: number;
  count: number;
}

export default function GetAverages() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<AveragesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAverages = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8081/average?start=${startDate}&end=${endDate}`
      );

      if (!res.ok) throw new Error("Failed to fetch averages");

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Average Sensor Readings">
      <div className="averages-grid">
        <div className="date-section">
          <div className="input-row">
            <label>Start Date</label>
            <div className="input-with-icon">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="input-row">
            <label>End Date</label>
            <div className="input-with-icon">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <button onClick={fetchAverages} disabled={loading}>
            {loading ? "Loading..." : "Get Averages"}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {data && (
          <div className="results">
            <div>
              <div className="label">Soil Moisture</div>
              <div className="value">{data.avg_soil}%</div>
            </div>
            <div>
              <div className="label">Air Temp</div>
              <div className="value">{data.avg_temp}°C</div>
            </div>
            <div>
              <div className="label">Humidity</div>
              <div className="value">{data.avg_humidity}%</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
