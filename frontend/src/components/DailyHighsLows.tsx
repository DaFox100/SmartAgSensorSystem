import { useEffect, useState } from "react";
import Card from "./Card";

export default function DailyHighsLows() {

  const [sensorData, setSensorData] = useState({

    "high_temp": "--",
    "low_temp": "--",
    "high_humidity":"--",
    "low_humidity": "--",
    "high_soil": "--",
    "low_soil": "--",
  });
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  }); // en-CA gives YYYY-MM-DD
  
  useEffect(() => {
    async function fetchDailyHighsLows() {
      try {
        const res = await fetch(`http://localhost:8081/highs_lows?date=${today}`);
        const data = await res.json();

        setSensorData({
          high_temp: data.high_temp ?? "--",
          low_temp: data.low_temp ?? "--",
          high_humidity: data.high_humidity ?? "--",
          low_humidity:data.low_humidity ?? "--",
          high_soil: data.high_soil ?? "--",
          low_soil: data.low_soil ?? "--",
        });
      } catch (err) {
        console.error("Error fetching latest:", err);
      }
    }

    fetchDailyHighsLows();
    const interval = setInterval(fetchDailyHighsLows, 10000);
    return () => clearInterval(interval);
  }, []);


  return (
    <Card title="Daily Highs / Lows">
  <div className="daily-range-grid">
    {/* High Column */}
    <div className="daily-range-column">
      <div className="high-badge">
        <span className="arrow">▲</span>
        High
      </div>

      <ul className="range-list sensor-high">
        <li>
          <span className="label">Temp </span>
          <span className="value">{sensorData.high_temp}°F</span>
        </li>
        <li>
          <span className="label">Humidity </span>
          <span className="value">{sensorData.high_humidity}%</span>
        </li>
        <li>
          <span className="label">Moisture </span>
          <span className="value">{sensorData.high_soil}</span>
        </li>
      </ul>
    </div>

    {/* Low Column */}
    <div className="daily-range-column">
      <div className="low-badge">
        <span className="arrow">▼</span>
        Low
      </div>

      <ul className="range-list sensor-low">
        <li>
          <span className="label">Temp </span>
          <span className="value">{sensorData.low_temp}°F</span>
        </li>
        <li>
          <span className="label">Humidity </span>
          <span className="value">{sensorData.low_humidity}%</span>
        </li>
        <li>
          <span className="label">Moisture </span>
          <span className="value">{sensorData.low_soil}</span>
        </li>
      </ul>
    </div>
  </div>
</Card>

  );
}
