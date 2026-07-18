// js/ui.js
// UI module - handles DOM updates and rendering

import { getWeatherInfo } from './weather.js';

import { openFlightradar } from './aircraft.js';

export function showLoading() {
  const container = document.getElementById('weather-container');
  container.innerHTML = `
    <div class="weather-card rounded-3xl p-6 flex flex-col items-center justify-center h-[260px]">
      <i class="fa-solid fa-spinner fa-spin text-3xl text-blue-500"></i>
      <p class="mt-3 text-sm text-zinc-400">Fetching weather...</p>
    </div>
  `;
  container.classList.remove('hidden');
}

export function hideStates() {
  document.getElementById('weather-container').classList.add('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('error-state').classList.add('hidden');
}

export function showError(msg) {
  hideStates();
  document.getElementById('error-state').classList.remove('hidden');
  document.getElementById('error-message').textContent = msg;
}

export function renderWeather(data, cityName, region, country, lat, lon) {
  const container = document.getElementById('weather-container');
  const info = getWeatherInfo(data.weather_code);

  container.innerHTML = `
    <div class="weather-card rounded-3xl p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="text-2xl font-semibold text-white">${cityName}</div>
          <div class="text-sm text-zinc-400">${region && country ? `${region}, ${country}` : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`}</div>
        </div>
        <div class="text-5xl">${info.icon}</div>
      </div>

      <div class="flex items-baseline gap-x-1 mb-6">
        <span class="text-[4.5rem] leading-none font-semibold text-white">${Math.round(data.temperature_2m)}</span>
        <span class="text-3xl text-zinc-500">°C</span>
      </div>

      <div class="text-lg font-medium text-zinc-200 mb-5">${info.desc}</div>

      <div class="grid grid-cols-3 gap-3">
        <div class="metric-card rounded-2xl p-3 text-center">
          <div class="text-xs text-zinc-500 mb-1">FEELS LIKE</div>
          <div class="font-semibold text-xl text-white">${Math.round(data.apparent_temperature)}°</div>
        </div>
        <div class="metric-card rounded-2xl p-3 text-center">
          <div class="text-xs text-zinc-500 mb-1">HUMIDITY</div>
          <div class="font-semibold text-xl text-white">${data.relative_humidity_2m}%</div>
        </div>
        <div class="metric-card rounded-2xl p-3 text-center">
          <div class="text-xs text-zinc-500 mb-1">WIND</div>
          <div class="font-semibold text-xl text-white">${Math.round(data.wind_speed_10m)} km/h</div>
        </div>
      </div>

      <!-- Aircraft Section -->
      <div class="mt-6 pt-5 border-t border-zinc-800">
        <div class="flex items-center gap-x-2 mb-3">
          <i class="fa-solid fa-plane text-blue-400"></i>
          <span class="font-semibold text-white">Aircraft nearby</span>
        </div>
        <p class="text-sm text-zinc-400 mb-4">See live planes and airport traffic for this location.</p>

        <button id="flightradar-btn"
                class="w-full flex items-center justify-center gap-x-3 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-2xl text-white font-medium transition-colors">
          <i class="fa-solid fa-plane-departure text-blue-400"></i>
          <span>View live aircraft on Flightradar24</span>
        </button>
      </div>

      <div class="mt-4 pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between">
        <div>Updated ${new Date(data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div>Live data</div>
      </div>
    </div>
  `;

  // Attach Flightradar button
  document.getElementById('flightradar-btn').addEventListener('click', openFlightradar);
}
