// js/main.js
// Main entry point - improved and cleaner

import { getCityCoordinates, getCurrentWeather } from './weather.js';
import { setCurrentLocation, fetchNearbyAircraft } from './aircraft.js';
import { showLoading, showError, renderWeather, hideAllStates } from './ui.js';
import { setState, setLoading, setError, setWeather } from './state.js';

async function handleCitySearch(city) {
  setLoading(true);
  showLoading();

  try {
    const place = await getCityCoordinates(city);
    const weather = await getCurrentWeather(place.latitude, place.longitude);

    setCurrentLocation(place.latitude, place.longitude);
    setWeather(weather, { lat: place.latitude, lon: place.longitude, name: place.name });

    await renderWeather(weather, place.name, place.admin1, place.country, place.latitude, place.longitude);
  } catch (err) {
    setError(err.message);
    showError(err.message || 'Failed to fetch weather. Please try again.');
  }
}

async function handleGeolocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }

  setLoading(true);
  showLoading();

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const weather = await getCurrentWeather(latitude, longitude);
      setCurrentLocation(latitude, longitude);
      setWeather(weather, { lat: latitude, lon: longitude, name: 'Current Location' });

      await renderWeather(weather, 'Current Location', '', '', latitude, longitude);
    } catch (err) {
      setError(err.message);
      showError('Could not fetch weather for your current location.');
    }
  }, () => {
    setError('Location permission denied');
    showError('Location permission denied. Please allow location access.');
  });
}

function setupEventListeners() {
  const searchBtn = document.getElementById('search-btn');
  const cityInput = document.getElementById('city-input');

  if (searchBtn && cityInput) {
    searchBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) handleCitySearch(city);
    });

    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) handleCitySearch(city);
      }
    });
  }

  const locationBtn = document.getElementById('location-btn');
  if (locationBtn) {
    locationBtn.addEventListener('click', handleGeolocation);
  }

  document.querySelectorAll('.quick-city').forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      if (cityInput) cityInput.value = city;
      handleCitySearch(city);
    });
  });
}

function init() {
  setupEventListeners();

  // Auto load Copenhagen on first visit
  setTimeout(() => {
    const input = document.getElementById('city-input');
    if (input && !input.value) {
      input.value = 'Copenhagen';
      handleCitySearch('Copenhagen');
    }
  }, 800);
}

window.onload = init;
