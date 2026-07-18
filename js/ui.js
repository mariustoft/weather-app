// js/ui.js
// UI Module - Improved rendering with better feedback

import { getWeatherInfo } from './weather.js';
import { fetchNearbyAircraft } from './aircraft.js';

export function showLoading() {
  const container = document.getElementById('weather-container');
  container.innerHTML = `
    <div class="weather-card">
      <div style="display:flex; flex-direction:column; align-items:center; padding:50px 20px; text-align:center;">
        <div class="loading-spinner" style="margin-bottom:20px;"></div>
        <p style="color:#a1a1aa; font-size:14px;">Fetching weather data...</p>
      </div>
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

  let aircraftHTML = '';
  try {
    const planes = await fetchNearbyAircraft(lat, lon);

    if (planes.length > 0) {
      const items = planes.map(p => `
        <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #3f3f46; font-size:13px;">
          <span style="font-family:monospace; color:#60a5fa;">${p.callsign}</span>
          <span style="color:#a1a1aa;">${p.altitude || '—'}m • ${p.speed || '—'} km/h</span>
        </div>
      `).join('');

      aircraftHTML = `
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid #3f3f46;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="font-size:14px;">${planes.length} aircraft nearby</strong>
            <button onclick="window.open('https://www.flightradar24.com/${lat.toFixed(4)},${lon.toFixed(4)}/8','_blank')" 
                    style="font-size:11px; padding:3px 10px; background:#27251f; border:1px solid #3f3f46; border-radius:999px; color:#a1a1aa; cursor:pointer;">
              View map
            </button>
          </div>
          <div>${items}</div>
        </div>
      `;
    }
  } catch(e) {}

  container.innerHTML = `
    <div class="weather-card fade-in">
      <div style="display:flex; justify-content:space-between; margin-bottom:24px;">
        <div>
          <div style="font-size:28px; font-weight:600; letter-spacing:-0.5px;">${cityName}</div>
          <div style="color:#a1a1aa; font-size:14px; margin-top:4px;">${locationText}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:56px; line-height:1; font-weight:700; letter-spacing:-2px;">${Math.round(data.temperature_2m)}</div>
          <div style="font-size:20px; color:#a1a1aa; margin-top:-6px;">°C</div>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:12px; margin-bottom:28px;">
        <span style="font-size:42px;">${info.icon}</span>
        <span style="font-size:20px;">${info.desc}</span>
      </div>

      <div class="metrics">
        <div class="metric">
          <div class="metric-label">FEELS LIKE</div>
          <div class="metric-value">${Math.round(data.apparent_temperature)}°</div>
        </div>
        <div class="metric">
          <div class="metric-label">HUMIDITY</div>
          <div class="metric-value">${data.relative_humidity_2m}%</div>
        </div>
        <div class="metric">
          <div class="metric-label">WIND</div>
          <div class="metric-value">${Math.round(data.wind_speed_10m)} km/h</div>
        </div>
      </div>

      ${aircraftHTML}
    </div>
  `;

  hideAllStates();
}
