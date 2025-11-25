// src/components/DataGraph.tsx
import { useEffect, useState } from "react";
import Card from "./Card";
import "./Card.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SensorPoint {
  timestamp: string;
  [key: string]: number | string;
}

export function DataGraph() {
  // Define internally
  const title = "Sensor Trends (24h)";
  const endpoint = "get-graph";

  const [data, setData] = useState<SensorPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8081/${endpoint}`)
      .then((res) => res.json())
      .then((json) => {
        if (!Array.isArray(json) || json.length === 0) {
          setError(true);
        } else {
          setData(json);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const renderFallback = () => (
    <div className="fallback-info">
      <p>Data Unavailable</p>
      <p>Temp: --</p>
      <p>Humidity: --</p>
      <p>Soil Moisture: --</p>
    </div>
  );

  return (
    <Card title="DataGraph">
      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="card-content" style={{ height: 300 }}>
        {loading && <div>Loading…</div>}

        {!loading && error && renderFallback()}

        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString()
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleString()
                }
              />
              <Legend />

              {/* Auto-detect all metrics except timestamp */}
              {Object.keys(data[0])
                .filter((key) => key !== "timestamp")
                .map((metric) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    dot={false}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
