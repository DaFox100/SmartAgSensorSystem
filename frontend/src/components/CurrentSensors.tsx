import { useEffect, useState } from "react";
import Card from "./Card";
import "./Card.css";
import "./CurrentSensors.css";

export default function CurrentSensors() {
  const [sensorData, setSensorData] = useState({
    soil_moisture: "--",
    temperature: "--",
    humidity: "--",
    timestamp: "--",
  });

  function formatTimestamp(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch("http://localhost:8081/latest");
        const data = await res.json();

        setSensorData({
          soil_moisture: data.soil_moisture ?? "--",
          temperature: data.temperature ?? "--",
          humidity: data.humidity ?? "--",
          timestamp: data.timestamp ? formatTimestamp(data.timestamp) : "--",
        });
      } catch (err) {
        console.error("Error fetching latest:", err);
      }
    }

    fetchLatest();
    const interval = setInterval(fetchLatest, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="Current Sensors">
      {/* LIVE badge */}
      <div className="live-badge">LIVE</div>

      {/* Sensor grid */}
      <div className="current-sensor-grid">
        <div>
          <p>Soil Moisture</p>
          <h4>{sensorData.soil_moisture}</h4>
        </div>

        <div>
          <p>Air Temp</p>
          <h4>{sensorData.temperature}°F</h4>
        </div>

        <div>
          <p>Humidity</p>
          <h4>{sensorData.humidity}%</h4>
        </div>
        <div>
          <p>TimeStamp</p>
          <h5>{sensorData.timestamp}</h5>
        </div>
      </div>
    </Card>
  );
}
