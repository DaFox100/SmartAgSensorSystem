import Card from "./Card";

export default function DailyHighsLows() {
  return (
    <Card title="Daily Highs / Lows">
      <div className="grid-two">
        <div>
          <h4>Highs</h4>
          <ul>
            <li>Temp: 27.1°C</li>
            <li>Humidity: 63%</li>
            <li>Moisture: 38%</li>
          </ul>
        </div>
        <div>
          <h4>Lows</h4>
          <ul>
            <li>Temp: 18.9°C</li>
            <li>Humidity: 49%</li>
            <li>Moisture: 29%</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
