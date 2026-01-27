// src/App.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
//import stadiumsData from "./dataMLS.json"; // Make sure this exists in src/
//import stadiumsData from "./dataCPL.json";
import mlsData from "./dataMLS.json"; // Make sure this exists in src/
import cplData from "./dataCPL.json";
import L from "leaflet";
import "./App.css"; // Optional: your styles


import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.js";






const leagueIcons = {

  CPL: L.AwesomeMarkers.icon({

    icon: "futbol",
    prefix: "fa",
    markerColor: "red",


  }),

  MLS: L.AwesomeMarkers.icon({

    icon: "futbol",
    prefix: "fa",
    markerColor: "blue",


  })


};



// Fix default marker icon in React
/*
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

*/

function App() {

  const [data, setStadiums] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedLeague, setSelectedLeague] = useState("");


  useEffect(() => {

    const combined = [


      ...Object.values(mlsData),
      ...Object.values(cplData),

    ];


    setStadiums((combined));
    
  }, []);

  // Filter stadiums by team or city
  const filteredStadiums = data.filter(
    (s) =>
      (s.Team.toLowerCase().includes(search.toLowerCase()) ||
     s.City.toLowerCase().includes(search.toLowerCase())) &&
    (selectedLeague === "" || s.League === selectedLeague)
  );

  console.log(data)
  

  return (

    <div style={{ height: "200vh", width: "100%", postion: "relative" }}>




      <div
        style={{
         
          position: "absolute",
          top: "30px",       // distance from top
          left: "50%",      // distance from left
          width: "100%",       // responsive width
          transform: "translateX(-50%)",
          maxWidth: "490px",  // maximum width on big screens
          padding: "1px",
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          borderRadius: "10px",
          zIndex: 1000,

     
        }}
        
      >


<h3 style={{ textAlign: "center", margin: "50px 0", fontSize: "30px", fontFamily: "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif"}}>
        ⚽ Soccer Stadiums in MLS
      </h3>
      </div>

      
      <div
        style={{
         
          /*

            position: "absolute",
          top: "300px",       // distance from top
          left: "20px",      // distance from left
          width: "90%",       // responsive width
          maxWidth: "290px",  // maximum width on big screens
          padding: "15px",
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          borderRadius: "10px",
          zIndex: 1000,

          position: "fixed",
            
            
            */

            position: "fixed",
          
              top: "0",
              left: "0",

              width: "300px",
              height: "100vh",

              padding: "20px",
              backgroundColor: "white",
              boxShadow: "2px 0 12px rgba(0,0,0,0.25)",
              borderRadius: "0",          // optional: remove rounded edges
              zIndex: 1000,

              overflowY: "auto",          // scroll INSIDE sidebar only


        

     
        }}
        
      >


          {/* Search input */}
        <div style={{ textAlign: "left", marginBottom: "10px"}}>
          <h2 style={{textAlign: "center", fontFamily: "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif"}}>Filters</h2>
          <h3 style = {{fontFamily: "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif"}}>City</h3>
          <input
            type="text"
            placeholder=""
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "6px 10px", width: "250px" }}
          />
     
          
        </div>

        <div>
  <label style = {{fontFamily: "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif"}}>Capacity Range:</label>
  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <input type="range" min="0" max="50000" defaultValue="0" />
    <input type="range" min="0" max="50000" defaultValue="50000" />
  </div>



  <div style={{ marginBottom: "10px" }}>
  <h3>League</h3>
  <select
    value={selectedLeague}
    onChange={(e) => setSelectedLeague(e.target.value)}
    style={{ padding: "6px 10px", width: "250px" }}
  >
    <option value="">All Leagues</option>
    <option value="MLS">MLS</option>
    <option value="EPL">2026 World Cup</option>
    <option value="CPL">CPL</option>
    {/* Add more leagues as needed */}
  </select>
</div>







</div>

        


        {/* Capacity input */}
        <div style={{ textAlign: "left", marginBottom: "10px"}}>
         
          <h3 style={{fontFamily: "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif"}}>Capacity</h3>
          <input
            type="text"
            placeholder=""
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "6px 10px", width: "250px" }}
          />

          
        </div>



      </div>



        
      

      {/* Map */}
      <MapContainer
        center={[43.6532, -79.3832]}
        zoom={5}
        style={{ height: "80%", width: "100%" }}
      >

        
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {filteredStadiums.map((s, idx) => (
          
          

          
          <Marker key={idx} position={[s.Latitude, s.Longitude]} icon={leagueIcons[s.League] || leagueIcons.CPL}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <img
                  src={s.Image_URL}
                  alt={s.Stadium_Name}
                  style={{
                    width: "290px",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />
                <h4>{s.Stadium_Name}</h4>
                <p>{s.Team}</p>
                <p>
                  {s.City} {s.Country}
                </p>
                <p>Capacity: {s.Capacity.toLocaleString()}</p>

                <p>Surface: {s.Surface.toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
