// js/aircraft.js
// Aircraft module - fetches and displays live aircraft data

let currentLat = null;
let currentLon = null;

let aircraftData = [];

export function setCurrentLocation(lat, lon) {
  currentLat = lat;
  currentLon = lon;
}

export function getCurrentLocation() {
  return { lat: currentLat, lon: currentLon };
}

// Fetch live aircraft from OpenSky Network

export async function fetchNearbyAircraft(lat, lon) {
  if (!lat || !lon) return [];

  const delta = 1.1;
  const lamin = lat - delta;
  const lamax = lat + delta;
  const lomin = lon - delta;
  const lomax = lon + delta;

  try {
    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Aircraft service unavailable');

    const data = await res.json();
    const states = data.states || [];

    aircraftData = states.slice(0, 6).map(state => ({
      callsign: state[1] ? state[1].trim() || 'Unknown' : 'Unknown',
      altitude: state[7] ? Math.round(state[7]) : null,
      speed: state[9] ? Math.round(state[9] * 3.6) : null,
      onGround: !!state[8],
      country: state[2] || ''
    }));

    return aircraftData;
  } catch (err) {
    console.warn('[Aircraft] Fetch failed:', err.message);
    return [];
  }
}

export function getAircraftData() {
  return aircraftData;
}

export function openFlightradar() {
  if (currentLat && currentLon) {
    const url = `https://www.flightradar24.com/${currentLat.toFixed(4)},${currentLon.toFixed(4)}/8`;
    window.open(url, '_blank');
  } else {
    window.open('https://www.flightradar24.com', '_blank');
  }
}
