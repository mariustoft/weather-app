// js/ui.js
// UI Module - Clean and well-aligned rendering

import { getWeatherInfo } from './weather.js';
import { fetchNearbyAircraft } from './aircraft.js';

export function showLoading() {
  const container = document.getElementById('weather-container');
  container.innerHTML = `
    <div class="weather-card p-8 flex flex-col items-center justify-center min-h-[260px]">
      <div class="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-5"></div>
      <p class="text-zinc-400 text-sm">Loading weather...</p>
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

export async function renderWeather(data, cityName, region, country, lat, lon) {
  const container = document.getElementById('weather-container');
  const info = getWeatherInfo(data.weather_code);

  const locationText = region && country 
    ? `${region}, ${country}` 
    : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  // Aircraft section
  let aircraftHTML = '';
  try {
    const planes = await fetchNearbyAircraft(lat, lon);

    if (planes.length > 0) {
      const items = planes.map(p => {
        const alt = p.altitude ? p.altitude + 'm' : '—';
        const spd = p.speed ? p.speed + ' km/h' : '—';
        return `
          <div class="flex justify-between text-sm py-1.5 border-b border-zinc-700 last:border-none">
            <span class="font-mono text-blue-400">${p.callsign}</span>
            <span class="text-zinc-400 text-xs">${alt} • ${spd}</span>
          </div>
        `;
      }).join('');

      aircraftHTML = `
        <div class="mt-6 pt-5 border-t border-zinc-700">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-sm">${planes.length} aircraft nearby</span>
            <button onclick="window.open('https://www.flightradar24.com/${lat.toFixed(4)},${lon.toFixed(4)}/8','_blank')" 
                    class="text-[10px] px-2.5 py-0.5 bg-zinc-800 rounded text-zinc-400">Map</button>
          </div>
          <div class="text-xs">${items}</div>
        </div>
      `;
    }
  } catch(e) {}

  container.innerHTML = `
    <div class="weather-card p-7">
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <div class="text-3xl font-semibold tracking-tight">${cityName}</div>
          <div class="text-sm text-zinc-400 mt-0.5">${locationText}</div>
        </div>
        <div class="text-right">
          <div class="text-6xl font-semibold tracking-tighter leading-none">${Math.round(data.temperature_2m)}</div>
          <div class="text-xl text-zinc-400 -mt-1">°C</div>
        </div>
      </div>

      <!-- Condition -->
      <div class="flex items-center gap-3 mb-7">
        <span class="text-5xl">${info.icon}</span>
        <span class="text-xl">${info.desc}</span>
      </div>

      <!-- Metrics -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 text-center">
          <div class="text-[10px] text-zinc-500 mb-1">FEELS LIKE</div>
          <div class="text-2xl font-semibold">${Math.round(data.apparent_temperature)}°</div>
        </div>
        <div class="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 text-center">
          <div class="text-[10px] text-zinc-500 mb-1">HUMIDITY</div>
          <div class="text-2xl font-semibold">${data.relative_humidity_2m}%</div>
        </div>
        <div class="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 text-center">
          <div class="text-[10px] text-zinc-500 mb-1">WIND</div>
          <div class="text-2xl font-semibold">${Math.round(data.wind_speed_10m)} km/h</div>
        </div>
      </div>

      ${aircraftHTML}
    </div>
  `;

  hideAllStates();
}
