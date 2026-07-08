# Weatherly

A **very basic** weather app built with plain HTML + Tailwind + vanilla JS.

## Live Demo

**https://weatherly-ten-alpha.vercel.app**  ← this one works publicly

(The other Vercel URLs for the project may redirect to a login page right now because "Vercel Authentication" is enabled in project security settings.)

## Features
- Search weather by city name
- Use current browser location
- Clean modern UI
- No API keys required

## Data
Powered by the free [Open-Meteo](https://open-meteo.com) API (geocoding + forecast).

## Run locally
Open `index.html` in any browser.

## Deployed on Vercel + GitHub

- Vercel project: **weatherly**
- GitHub repo connected → pushes to `main` auto-deploy and update the alias
- Clean static deploy (no vercel.json needed)

### Source
https://github.com/mariustoft/weather-app

### Re-deploy / fork
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?repository-url=https%3A%2F%2Fgithub.com%2Fmariustoft%2Fweather-app)

## Tech stack
- Single file `index.html`
- Tailwind via CDN
- Font Awesome
- Open-Meteo APIs

Created for demo of GitHub + Vercel automation.