// js/ui.js
// UI Module - Robust premium rendering

import { getWeatherInfo } from './weather.js';
import { openFlightradar } from './aircraft.js';

export function showLoading() {
  const container = document.getElementById('weather-container');
  container.innerHTML = `
    <div class="weather-card p-8 flex flex-col items-center justify-center min-h-[280px]">
      <div class="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
      <p class="text-zinc-400">Fetching latest weather data...</p>
    </div>
  `;
  container.classList.remove('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('error-state').classList.add('hidden');
}

export function hideAllStates() {
  document.getElementById('weather-container').classList.remove('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('error-state').classList.add('hidden');
}

export function showError(msg) {
  document.getElementById('weather-container').classList.add('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  const errorEl = document.getElementById('error-state');
  document.getElementById('error-message').textContent = msg;
  errorEl.classList.remove('hidden');
}

export function renderWeather(data, cityName, region, country, lat, lon) {
  const container = document.getElementById('weather-container');
  const info = getWeatherInfo(data.weather_code);

  const locationText = region && country 
    ? `${region}, ${country}` 
    : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  container.innerHTML = `
    <div class="weather-card p-8">
      <div class="flex items-start justify-between mb-8">
        <div>
          <div class="text-4xl font-semibold tracking-tighter text-white">${cityName}</div>
          <div class="text-zinc-400 mt-1 flex items-center gap-x-2 text-sm">
            <i class="fa-solid fa-map-marker-alt"></i>
            <span>${locationText}</span>
          </div>
        </div>
        
        <div class="text-right">
          <div class="text-[68px] leading-none font-semibold tracking-tighter text-white">${Math.round(data.temperature_2m)}</div>
          <div class="text-2xl text-zinc-400 -mt-2">°C</div>
        </div>
      </div>

      <div class="flex items-center gap-x-4 mb-8">
        <div class="text-6xl">${info.icon}</div>
        <div class="text-2xl font-medium text-white">${info.desc}</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="metric-card p-5">
          <div class="text-xs text-zinc-500 mb-1">FEELS LIKE</div>
          <div class="text-3xl font-semibold text-white tracking-tighter">${Math.round(data.apparent_temperature)}°</div>
        </div>
        <div class="metric-card p-5">
          <div class="text-xs text-zinc-500 mb-1">HUMIDITY</div>
          <div class="text-3xl font-semibold text-white tracking-tighter">${data.relative_humidity_2m}<span class="text-xl font-normal text-zinc-400">%</span></div>
        </div>
        <div class="metric-card p-5">
          <div class="text-xs text-zinc-500 mb-1">WIND</div>
          <div class="text-3xl font-semibold text-white tracking-tighter">${Math.round(data.wind_speed_10m)} <span class="text-xl font-normal text-zinc-400">km/h</span></div>
        </div>
      </div>

      <!-- Aircraft -->
      <div class="pt-6 border-t border-zinc-700">
        <div class="flex items-center gap-x-3 mb-4">
          <div class="w-9 h-9 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <i class="fa-solid fa-plane text-blue-400"></i>
          </div>
          <div>
            <div class="font-semibold">Aircraft nearby</div>
            <div class="text-xs text-zinc-500">Live air traffic & airport activity</div>
          </div>
        </div>

        <button id="flightradar-btn" 
                class="w-full py-4 bg-zinc-900 hover:bg-zinc-800 active:bg-black border border-zinc-700 rounded-3xl flex items-center justify-center gap-x-3 text-sm font-medium transition-all">
          <i class="fa-solid fa-plane-departure text-blue-400"></i>
          <span>View live aircraft on Flightradar24</span>
        </button>
      </div>
    </div>
  `;

  // Attach Flightradar button safely
  setTimeout(() => {
    const btn = document.getElementById('flightradar-btn');
    if (btn) {
      btn.onclick = openFlightradar;
    }
  }, 30);

  hideAllStates();
}
