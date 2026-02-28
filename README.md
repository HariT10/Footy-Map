# 🏟️ Footy Map (In - Progress)

> An interactive map to explore professional soccer stadiums across North America.

![Stadium Mapped Demo](./screenshots/demo.gif)
<!-- Replace the line above with an actual screenshot or GIF of your app -->

---

## 📸 Screenshots

| Full View | Stadium Popup |
|---|---|
| ![Map View](./screenshots/map.png) | ![Popup](./screenshots/popup.png) |

<!-- Add your own screenshots to a /screenshots folder in your repo -->

---

## Why I Built This

As a fan of both MLS and the Canadian Premier League, I wanted a simple, visual way to see where all the stadiums were across North America. 

This project was also my way of leveling up my React skills while also working with real data, integrating third-party libraries like Leaflet, and thinking through UI/UX decisions like sidebar layout and map interactions. A true learning experince for me. 

---

## Features

- Interactive map of MLS and CPL stadiums across North America
- Filter by league or search by team name and city
- Color-coded markers by league
- Stadium popup cards with image, capacity, surface, and league info

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) | UI framework |
| [React Leaflet](https://react-leaflet.js.org/) | Map rendering |
| [Leaflet.js](https://leafletjs.com/) | Core mapping engine |
| [Leaflet Awesome Markers](https://github.com/lennardv2/Leaflet.awesome-markers) | Custom colored map markers |
| [CartoDB Positron](https://carto.com/basemaps/) | Clean, minimal map tile layer |



---



---

## How I got the Data?

I collected stadium data using a custom Python web scraper built to pull information directly from Wikipedia.
The scraper gathered data for:

MLS — Major League Soccer
CPL — Canadian Premier League

Each stadium entry includes: name, team, city, country, coordinates, capacity, surface type, league, and an image URL.

---

## Planned Features

- [ ] Favourite stadiums (saved to localStorage)
- [ ] Stadium comparison side-by-side
- [ ] Show more than one picture for each stadium
- [ ] Add a select "none" feature

---

