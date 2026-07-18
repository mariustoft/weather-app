// js/ui.js
// UI Module - Premium rendering with live aircraft support

import { getWeatherInfo } from './weather.js';
import { openFlightradar, fetchNearbyAircraft, getAircraftData } from './aircraft.js';

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

export async function renderWeather(data, cityName, region, country, lat, lon) {
  const container = document.getElementById('weather-container');
  const info = getWeatherInfo(data.weather_code);

  const locationText = region && country 
    ? `${region}, ${country}` 
    : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  // Try to fetch aircraft
  let aircraftHTML = '';
  try {
    const planes = await fetchNearbyAircraft(lat, lon);

    if (planes.length > 0) {
      const planeItems = planes.map(p => {
        const alt = p.altitude ? `${p.altitude} m` : '—';
        const spd = p.speed ? `${p.speed} km/h` : '—';
        const status = p.onGround ? 'On ground' : 'Airborne';
        return `
          <div class="flex justify-between items-center py-2 border-b border-zinc-700 last:border-b-0 text-sm">
            <div class="font-mono text-blue-400">${p.callsign}</div>
            <div class="text-right text-xs text-zinc-400">
              ${alt} • ${spd}<br>
              <span class="text-[10px]">${status}</span>
            </div>
          </div>
        `;
      }).join('');

      aircraftHTML = `
        <div class="pt-6 border-t border-zinc-700 mt-6">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-x-2">
              <i class="fa-solid fa-plane text-blue-400"></i>
              <span class="font-semibold text-white">${planes.length} aircraft nearby</span>
            </div>
            <button onclick="window.open('https://www.flightradar24.com/${lat.toFixed(4)},${lon.toFixed(4)}/8', '_blank')" 
                    class="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 transition-colors">
              View on map
            </button>
          </div>
          <div class="max-h-[160px] overflow-auto pr-1 text-sm">
            ${planeItems}
          </div>
        </div>
      `;
    } else {
      aircraftHTML = `
        <div class="pt-6 border-t border-zinc-700 mt-6">
          <div class="flex items-center gap-x-2 mb-3">
            <i class="fa-solid fa-plane text-blue-400"></i>
            <span class="font-semibold text-white">Aircraft nearby</span>
          </div>
          <p class="text-sm text-zinc-400 mb-3">No aircraft detected in this area right now.</p>
          <button onclick="window.open('https://www.flightradar24.com/${lat.toFixed(4)},${lon.toFixed(4)}/8', '_blank')" 
                  class="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-3xl text-sm font-medium transition-colors">
            Open Flightradar24
          </button>
        </div>
      `;
    }
  } catch (e) {
    aircraftHTML = `
      <div class="pt-6 border-t border-zinc-700 mt-6">
        <button onclick="window.open('https://www.flightradar24.com/${lat.toFixed(4)},${lon.toFixed(4)}/8', '_blank')" 
                class="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-3xl text-sm font-medium transition-colors">
          View live aircraft on Flightradar24
        </button>
      </div>
    `;
  }

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

      ${aircraftHTML}
    </div>
  `;

  hideAllStates();
}
