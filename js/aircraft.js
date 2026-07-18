// js/aircraft.js
// Aircraft module - handles Flightradar24 integration

let currentLat = null;
let currentLon = null;

export function setCurrentLocation(lat, lon) {
  currentLat = lat;
  currentLon = lon;
}

export function openFlightradar() {
  if (currentLat && currentLon) {
    const url = `https://www.flightradar24.com/${currentLat.toFixed(4)},${currentLon.toFixed(4)}/8`;
    window.open(url, '_blank');
  } else {
    window.open('https://www.flightradar24.com', '_blank');
  }
}

export function getCurrentLocation() {
  return { lat: currentLat, lon: currentLon };
}
