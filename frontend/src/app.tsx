import { h } from "preact";
import { useState } from "preact/hooks";
import { SpotifyControls } from "./pages/spotify";
import { Slideshow } from "./pages/slideshow";
import { HomeAssistantControls } from "./pages/lights";
import  CalendarPage  from "./pages/calendar";

export default function App() {
  const [activeTab, setActiveTab] = useState("spotify");

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Top Tab Bar */}
      <div className="flex justify-around bg-gray-800 text-white p-3">
        <button onClick={() => setActiveTab("spotify")} className={activeTab === "spotify" ? "font-bold" : ""}>
          Spotify
        </button>
        <button onClick={() => setActiveTab("slideshow")} className={activeTab === "slideshow" ? "font-bold" : ""}>
          Photos
        </button>
        <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "font-bold" : ""}>
          Lights
        </button>
        <button onClick={() => setActiveTab("calendar")} className={activeTab === "calendar" ? "font-bold" : ""}>
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
