// js/state.js
// Simple but powerful state manager for Weatherly

const state = {
  currentLocation: null,      // { lat, lon, name }
  currentWeather: null,
  nearbyAircraft: [],
  isLoading: false,
  error: null,
  lastUpdated: null
};

// Listeners for state changes
const listeners = [];

export function subscribe(callback) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

function notify() {
  listeners.forEach(cb => cb({ ...state }));
}

export function getState() {
  return { ...state };
}

export function setState(newState) {
  Object.assign(state, newState);
  notify();
}

export function resetState() {
  state.currentLocation = null;
  state.currentWeather = null;
  state.nearbyAircraft = [];
  state.isLoading = false;
  state.error = null;
  state.lastUpdated = null;
  notify();
}

export function setLoading(isLoading) {
  state.isLoading = isLoading;
  notify();
}

export function setError(error) {
  state.error = error;
  state.isLoading = false;
  notify();
}

export function setWeather(weather, location) {
  state.currentWeather = weather;
  state.currentLocation = location;
  state.error = null;
  state.lastUpdated = new Date();
  notify();
}

export function setAircraft(aircraft) {
  state.nearbyAircraft = aircraft;
  notify();
}
