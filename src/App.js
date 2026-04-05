//By: Harishan Thilakanathan

// src/App.js
import React, { useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
//import {useMap} from "react-leaflet";

//importing the MLS stadiums dataset
import mlsData from "./dataMLS.json";

//importing the CPL stadiums dataset
import cplData from "./dataCPL.json";

//importing the 2026 World Cup dataset
import fifaData from "./dataWorldCup.json";

//importing leaflet, basically for the map
import L from "leaflet";

import "./App.css";

import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.js";



//Icon marer from Awesome Markers, one for each league
const leagueIcons = {

  CPL: L.AwesomeMarkers.icon({ icon: "futbol", prefix: "fa", markerColor: "red" }),

  MLS: L.AwesomeMarkers.icon({ icon: "futbol", prefix: "fa", markerColor: "cadetblue" }),

  FIFA: L.AwesomeMarkers.icon({icon: "futbol", prefix: "fa", markerColor: "orange"}),
  
};


const BASE_MAPS = [

  { id: "osm",         label: "Street",    icon: "", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '&copy; OpenStreetMap' },
  { id: "carto-dark",  label: "Dark",      icon: "", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attribution: '&copy; CARTO' },
  { id: "carto-light", label: "Light",     icon: "", url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", attribution: '&copy; CARTO' },
  { id: "satellite",   label: "Satellite", icon: "", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: '&copy; Esri' },



]

const SIDEBAR_WIDTH = 300;


function MapSwitcher({ activeMap, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const active = BASE_MAPS.find((m) => m.id === activeMap);
  return (
    <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 1000, fontFamily: "'DM Sans', sans-serif" }}>
      {!expanded ? (
        <button onClick={() => setExpanded(true)} style={{
          display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
          backgroundColor: "rgba(15,17,23,0.85)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.10)", borderRadius: "100px",
          color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        }}>
          <span>{active.icon}</span>
          <span style={{ color: "rgba(255,255,255,0.75)" }}>{active.label}</span>
          <svg width="10" height="10" viewBox="0 0 10 10"><path fill="rgba(255,255,255,0.4)" d="M5 7L1 3h8z"/></svg>
        </button>
      ) : (
        <div style={{
          backgroundColor: "rgba(15,17,23,0.92)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
          padding: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.45)", minWidth: "200px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}></span>
            <button onClick={() => setExpanded(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "16px" }}>×</button>
          </div>
          {BASE_MAPS.map((bm) => (
            <button key={bm.id} onClick={() => { onChange(bm.id); setExpanded(false); }} style={{
              display: "flex", alignItems: "center", gap: "10px", width: "100%",
              padding: "9px 11px", borderRadius: "10px", marginBottom: "3px",
              border: activeMap === bm.id ? "1px solid rgba(62,207,142,0.4)" : "1px solid transparent",
              backgroundColor: activeMap === bm.id ? "rgba(62,207,142,0.08)" : "rgba(255,255,255,0.03)",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>
              <span style={{ fontSize: "16px" }}>{bm.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: activeMap === bm.id ? "#3ecf8e" : "rgba(255,255,255,0.75)" }}>{bm.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function App() {

    //data holds all the stadium data
    const [data, setStadiums] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedLeague, setSelectedLeague] = useState("");

    const [aboutOpen, setAboutOpen] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const[sortBy] = useState("");

    const [minCapacity, setCapacityRange] = useState(0);

    const [activeMap, setActiveMap] = useState("osm");

    useEffect(() => {
    
        const combined = [

            ...Object.values(mlsData),
            ...Object.values(cplData),
            ...Object.values(fifaData),

    ];

    setStadiums(combined);

    }, []);


    const filteredStadiums = data


        .filter(
            (s) =>
            (s.Team?.toLowerCase().includes(search.toLowerCase()) ||
            s.City.toLowerCase().includes(search.toLowerCase())) &&
            (selectedLeague === "" || s.League === selectedLeague) &&
            s.Capacity >= minCapacity
        )
    .sort((a, b) => {
      if (sortBy === "capacity_desc") return b.Capacity - a.Capacity;
      if (sortBy === "capacity_asc") return a.Capacity - b.Capacity;
      if (sortBy === "name_asc") return a.Stadium_Name.localeCompare(b.Stadium_Name);
      if (sortBy === "name_desc") return b.Stadium_Name.localeCompare(a.Stadium_Name);
      return 0; // default — no sort
    });

    return (

        <>

        <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>

        {/* ══════════════════════════ SIDEBAR ══════════════════════════ */}
        <div
          className="sidebar sidebar-wrap"
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: `${SIDEBAR_WIDTH}px`,
            height: "100vh",
            backgroundColor: "#0f1117",
            zIndex: 1000,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            transform: sidebarOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
          }}
        >
          {/* Header */}
          <div style={{ padding: "28px 24px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              
              <div>

                <h2 style={{ margin: 0, fontSize: "25px", fontWeight: "700", color: "#fff", letterSpacing: "-0.2px" }}>
                  FootyMap
                </h2>
               
              </div>

            </div>

          </div>

          {/* Filters */}
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>

            {/* League */}
            <div>
              <label style={{
                display: "block", fontSize: "10px", fontWeight: "600",
                letterSpacing: "1px", textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)", marginBottom: "8px",
              }}>League</label>
              <select
                className="filter-select"
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.08)", fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif", color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.05)", outline: "none",
                  appearance: "none", cursor: "pointer",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                <option value="">All Leagues</option>
                <option value="MLS">MLS</option>
                <option value="CPL">CPL</option>
                <option value="FIFA">2026 FIFA World Cup</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label style={{
                display: "block", fontSize: "10px", fontWeight: "600",
                letterSpacing: "1px", textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)", marginBottom: "8px",
              }}>Search</label>

              <input
                className="filter-input"
                type="text"
                placeholder="Team or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.08)", fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif", color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.05)", outline: "none",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              />
            </div>


            {/* Capacity Filter */}
            <div>

                <label style={{
                display: "block", fontSize: "10px", fontWeight: "600",
                letterSpacing: "1px", textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)", marginBottom: "8px",
            }}>Min Capacity — {minCapacity.toLocaleString()}</label>

            <input
                type="range"
                min={0}
                max={100000}
                step={1000}
                value={minCapacity}
                onChange={(e) => setCapacityRange(Number(e.target.value))}
                style={{ width: "100%" }}
            />
            
            </div>
                    

            {/* Count pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              backgroundColor: "rgba(62,207,142,0.1)", borderRadius: "8px",
              padding: "8px 14px", alignSelf: "flex-start",
            }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#3ecf8e" }}>
                {filteredStadiums.length}
              </span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: "400" }}>
                stadium{filteredStadiums.length !== 1 ? "s" : ""} found
              </span>
            </div>

          </div>

        

          
          {/* About Us — collapsible */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={() => setAboutOpen((o) => !o)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "space-between", padding: "18px 24px",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              
                <span style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>About</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12"
                style={{ transform: aboutOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0 }}
              >
                <path fill="rgba(255,255,255,0.3)" d="M6 8L1 3h10z" />
              </svg>
            </button>
            <div style={{ maxHeight: aboutOpen ? "400px" : "0px", overflow: "hidden", transition: "max-height 0.35s ease" }}>
              <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.5)" }}>
                  <em>Welcome to FootyMap!</em>
                </p>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.5)" }}>
                  <em>This application was built to showcase major soccer stadiums in North America's top soccer leagues. Soon to be expanded!</em> 
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                  <p style={{ margin: 0, fontSize: "11px", color: "rgba(255, 255, 255, 0.2)" }}>
                    Built by <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>Harishan</span> · 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════ SIDEBAR TAB ══════════════════════════ */}
        <button
          className="sidebar-tab"
          onClick={() => setSidebarOpen((o) => !o)}
          style={{ left: sidebarOpen ? `${SIDEBAR_WIDTH}px` : "0px" }}
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <svg
            width="10" height="14" viewBox="0 0 10 14"
            style={{ transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)" }}
          >
            <path fill="rgba(255,255,255,0.5)" d="M7 1L2 7l5 6" strokeWidth="0" />
          </svg>
        </button>

        {/* ══════════════════════════ FLOATING TITLE ══════════════════════════ */}
        <div style={{
          position: "absolute",
          top: "20px",
          left: `calc(${sidebarOpen ? SIDEBAR_WIDTH : 0}px + (100vw - ${sidebarOpen ? SIDEBAR_WIDTH : 0}px) / 2)`,
          transform: "translateX(-50%)",
          transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: "10px 22px",
          backgroundColor: "rgba(15,17,23,0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
          borderRadius: "100px",
          zIndex: 999,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
       
          <span style={{
            fontSize: "18px", fontWeight: "600",
            color: "rgba(255,255,255,0.88)", letterSpacing: "0.1px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Soccer Stadiums in North America
          </span>
        </div>

        {/* ══════════════════════════ MAP ══════════════════════════ */}
        <div style={{
          position: "absolute", top: 0,
          left: sidebarOpen ? `${SIDEBAR_WIDTH}px` : "0px",
          right: 0, bottom: 0,
          transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          <MapSwitcher activeMap={activeMap} onChange={setActiveMap} />
          <MapContainer
            center={[47, -95]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
          >
            {/* CartoDB Positron — clean, minimal, modern */}
            <TileLayer
              key={activeMap}
              url={BASE_MAPS.find(m => m.id === activeMap).url}
              attribution={BASE_MAPS.find(m => m.id === activeMap).attribution}
              maxZoom={19}
            />


            {filteredStadiums.map((s, idx) => (
              <Marker
                key={idx}
                position={[s.Latitude, s.Longitude]}
                icon={leagueIcons[s.League] || leagueIcons.CPL}
              >
                <Popup minWidth={270} maxWidth={270}>

                  <div style={{ fontFamily: "'DM Sans', sans-serif", width: "370px" }}>

                    {/* Image with league badge overlay */}
                    <div style={{ position: "relative" }}>
                      <img
                        src={s.Image_URL}
                        alt={s.Stadium_Name}
                        style={{
                          width: "100%", height: "260px", objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div style={{
                        position: "absolute", bottom: "10px", left: "12px",
                        fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        color: "#fff",
                        backgroundColor: s.League === "MLS" ? "#2196a6" : "#c0392b",
                        borderRadius: "6px", padding: "3px 8px",
                      }}>{s.League}</div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "14px 16px 16px" }}>
                      <h4 style={{ margin: "0 0 3px", fontSize: "15px", fontWeight: "700", color: "#111", letterSpacing: "-0.3px" }}>
                        {s.Stadium_Name}
                      </h4>
                      <p style={{ margin: "0 0 2px", fontSize: "13px", color: "#555", fontWeight: "500" }}>
                        {s.Team}
                      </p>
                      <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#aaa" }}>
                        {s.City}, {s.Country}
                      </p>

                      {/* Stats row */}
                      <div style={{
                        display: "flex", borderTop: "1px solid #f2f2f2", paddingTop: "12px",
                      }}>
                        {[
                          { label: "Capacity", value: s.Capacity.toLocaleString() },
                          { label: "Surface", value: s.Surface },
                        ].map(({ label, value }, i, arr) => (
                          <div key={label} style={{
                            flex: 1, textAlign: "center",
                            borderRight: i < arr.length - 1 ? "1px solid #f2f2f2" : "none",
                          }}>
                            <p style={{ margin: "0 0 3px", fontSize: "9px", color: "#ccc", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: "600" }}>
                              {label}
                            </p>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#111" }}>
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </>
  );
}

export default App;