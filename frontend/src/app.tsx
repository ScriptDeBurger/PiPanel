import { useState } from "preact/hooks";
import { SpotifyControls } from "./pages/spotify";
import { Slideshow } from "./pages/slideshow";
import { HomeAssistantControls } from "./pages/lights";
import  CalendarPage  from "./pages/calendar";
import "./nav.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("spotify");

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Top Tab Bar */}
      <div className="top-nav">
        <button onClick={() => setActiveTab("spotify")} className={`tab-btn ${activeTab === "spotify" ? "active" : ""}`}>
          Spotify
        </button>
        <button onClick={() => setActiveTab("slideshow")} className={`tab-btn ${activeTab === "slideshow" ? "active" : ""}`}>
          Photos
        </button>
        <button onClick={() => setActiveTab("home")} className={`tab-btn ${activeTab === "home" ? "active" : ""}`}>
          Lights
        </button>
        <button onClick={() => setActiveTab("calendar")} className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`}>
          Calendar
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "spotify" && <SpotifyControls />}
        {activeTab === "slideshow" && <Slideshow />}
        {activeTab === "home" && <HomeAssistantControls />}
        {activeTab === "calendar" && <CalendarPage />}
      </div>
    </div>
  );
}
