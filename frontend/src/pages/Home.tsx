import React from "react";
import "./Home.css";

import CurrentSentors from "../components/CurrentSentors";
import SoilMoisture from "../components/SoilMoisture";
import DailyHighsLows from "../components/DailyHighsLows";
import IrrigationActions from "../components/IrrigationActions";
import SoilZones from "../components/SoilZones";
import SystemStatus from "../components/SystemStatus";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Smart Agriculture Dashboard</h1>
     

      <div className="home-grid">
        <CurrentSentors />
        <SoilMoisture />
        <DailyHighsLows />
        <IrrigationActions />
        <SoilZones />
        <SystemStatus />
      </div>
    </div>
  );
}
