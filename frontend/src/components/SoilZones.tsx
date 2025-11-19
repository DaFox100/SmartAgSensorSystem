import Card from "./Card";

export default function SoilZones() {
  const zones = [
    { name: "Bed A", value: 35 },
    { name: "Bed B", value: 31 },
    { name: "Bed C", value: 28 },
    { name: "Bed D", value: 36 },
  ];

  return (
    <Card title="Soil Zones">
      <div className="grid-two">
        {zones.map((z) => (
          <div key={z.name} className="zone-item">
            <span>{z.name}</span>
            <span>{z.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
