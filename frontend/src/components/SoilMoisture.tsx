import Card from "./Card";

export default function SoilMoisture() {
  return (
    <Card title="Soil Moisture Trend">
      <div className="trend-chart">
        <p>Mean: 32.1%</p>
        <p>Std: 4.2</p>
        <p>Last: 34%</p>
      </div>
    </Card>
  );
}
