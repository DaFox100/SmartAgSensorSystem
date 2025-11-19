import Card from "./Card";

export default function SystemStatus() {
  return (
    <Card title="System Status">
      <ul>
        <li>MQTT: <span style={{ color: "#21e6b6" }}>connected</span></li>
        <li>Pi Server: <span style={{ color: "#21e6b6" }}>healthy</span></li>
        <li>Arduino Feed: <span style={{ color: "#facc15" }}>intermittent</span></li>
      </ul>
    </Card>
  );
}
