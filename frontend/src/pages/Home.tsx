import "./Home.css";

import CurrentSentors from "../components/CurrentSensors";
import SoilMoisture from "../components/SoilMoisture";
import DailyHighsLows from "../components/DailyHighsLows";
import { DataGraph } from "../components/DataGraph";
import { DateRangeCard } from "../components/DateRangeCard";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Smart Agriculture Dashboard</h1>
     

      <div className="home-grid">
        <CurrentSentors />
        <SoilMoisture />
        <DailyHighsLows />
        <DateRangeCard/>
        <DataGraph/>
      </div>
    </div>
  );
}
