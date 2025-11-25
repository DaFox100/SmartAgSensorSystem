import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { useDateRange } from "../context/DataRangeContext.tsx";

export function DataGraph() {
  interface SensorData {
    timestamp: string;
    temperature: number;
    humidity: number;
    soil_moisture: number;
  }

  const [data, setData] = useState<SensorData[]>([]);

  // 🔥 Read start/end from the global date range card
  const { startDate, endDate } = useDateRange();

  // Dynamically build query string
  const buildEndpoint = () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start", startDate);
    if (endDate) params.append("end", endDate);

    const qs = params.toString();
    return qs ? `/graph-data?${qs}` : `/graph-data`;
  };

  useEffect(() => {
    const endpoint = buildEndpoint();

    fetch(`http://localhost:8081${endpoint}`)
      .then((res) => res.json())
      .then(setData);
  }, [startDate, endDate]); // 🔁 Refetch whenever dates change

  return (
    <div className="card full-width" style={{ height: "500px", width: "700px" }}>
      <h2>Sensor Data Graph</h2>

      <Plot
        data={[
          {
            x: data.map((p) => p.timestamp),
            y: data.map((p) => p.temperature),
            type: "scatter",
            mode: "lines",
            name: "Temperature",
          },
          {
            x: data.map((p) => p.timestamp),
            y: data.map((p) => p.humidity),
            type: "scatter",
            mode: "lines",
            name: "Humidity",
          },
          {
            x: data.map((p) => p.timestamp),
            y: data.map((p) => p.soil_moisture),
            type: "scatter",
            mode: "lines",
            name: "Soil Moisture",
          },
        ]}
        layout={{
          autosize: true,
          height: 300,
          margin: { l: 40, r: 20, t: 20, b: 40 },
        }}
        style={{ height: "100%", width: "100%" }}
        useResizeHandler
      />
    </div>
  );
}
