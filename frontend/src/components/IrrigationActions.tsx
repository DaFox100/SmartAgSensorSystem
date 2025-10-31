import Card from "./Card";

export default function IrrigationActions() {
  return (
    <Card title="Irrigation Actions">
      <div className="actions">
        <button className="btn primary">Log Watering</button>
        <button className="btn">Open Valve</button>
        <button className="btn">Close Valve</button>
      </div>
    </Card>
  );
}
