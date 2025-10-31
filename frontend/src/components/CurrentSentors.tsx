import Card from "./Card";
import "./Card.css";

export default function CurrentSensors() {
  return (
    <Card title="Current Sensors">
      <div className="sensor-grid">
        <div><p>Soil Moisture</p><h4>34%</h4></div>
        <div><p>Air Temp</p><h4>22.4°C</h4></div>
        <div><p>Humidity</p><h4>58%</h4></div>
        <div><p>Light</p><h4>812 lux</h4></div>
      </div>
    </Card>
  );
}
