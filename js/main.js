// js/main.js
// Main entry point - wires everything together

import { getCityCoordinates, getCurrentWeather } from './weather.js';
import { setCurrentLocation, openFlightradar } from './aircraft.js';
import { showLoading, hideStates, showError, renderWeather } from './ui.js';

function initTailwind() {
  // Tailwind is loaded via CDN
}

async function handleCitySearch(city) {
  showLoading();

  try {
    const place = await getCityCoordinates(city);
    const weather = await getCurrentWeather(place.latitude, place.longitude);

    setCurrentLocation(place.latitude, place.longitude);
    renderWeather(weather, place.name, place.admin1, place.country, place.latitude, place.longitude);

    hideStates();
  } catch (err) {
    showError(err.message || 'Failed to fetch weather');
  }
}

async function handleGeolocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported');
    return;
  }

  showLoading();

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const weather = await getCurrentWeather(latitude, longitude);
      setCurrentLocation(latitude, longitude);
      renderWeather(weather, 'Current Location', '', '', latitude, longitude);
      hideStates();
    } catch (err) {
      showError('Could not fetch weather for your location');
    }
  }, () => {
    showError('Location permission denied');
  });
}

function setupEventListeners() {
  // Search button
  const searchBtn = document.getElementById('search-btn');
  const cityInput = document.getElementById('city-input');

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

  // Geolocation button
  document.getElementById('location-btn').addEventListener('click', handleGeolocation);

  // Quick city buttons
  document.querySelectorAll('.quick-city').forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      cityInput.value = city;
      handleCitySearch(city);
    });
  });
}

function init() {
  initTailwind();
  setupEventListeners();

  // Auto load Copenhagen on first visit
  setTimeout(() => {
    const input = document.getElementById('city-input');
    if (input && !input.value) {
      input.value = 'Copenhagen';
      handleCitySearch('Copenhagen');
    }
  }, 600);
}

window.onload = init;
