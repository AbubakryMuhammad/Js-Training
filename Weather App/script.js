"use strict";

const PRIMARY   = { id: "lagos", name: "Lagos", latitude: 6.5244, longitude: 3.3792 };
const SECONDARY = { id: "abuja", name: "Abuja", latitude: 9.0765, longitude: 7.3986 };

const STORAGE_KEY = "weather.lastReading";
const KM_H_PER_KNOT = 1.852;
const SVG_NS = "http://www.w3.org/2000/svg";


const CONDITIONS = [
  { max: 0,   label: "Clear sky",     emoji: "\u2600\uFE0F",       cover: 0,   wash: "rgba(240,180,41,.07)"  },
  { max: 3,   label: "Partly cloudy", emoji: "\u26C5",             cover: 0.5, wash: "rgba(123,163,196,.06)" },
  { max: 48,  label: "Foggy",         emoji: "\uD83C\uDF2B\uFE0F", cover: 1,   wash: "rgba(150,165,180,.09)" },
  { max: 67,  label: "Rainy",         emoji: "\uD83C\uDF27\uFE0F", cover: 1,   wash: "rgba(40,90,150,.16)"   },
  { max: 77,  label: "Snowy",         emoji: "\uD83C\uDF28\uFE0F", cover: 1,   wash: "rgba(200,220,240,.10)" },
  { max: 82,  label: "Showers",       emoji: "\uD83C\uDF26\uFE0F", cover: 1,   wash: "rgba(40,90,150,.13)"   },
  { max: 999, label: "Thunderstorm",  emoji: "\u26C8\uFE0F",       cover: 1,   wash: "rgba(90,60,140,.18)"   }
];

const UNKNOWN_CONDITION = {
  label: "Not reported", emoji: "\u2754", cover: 0, wash: "transparent"
};

function describeCode(code) {
  const n = Number(code);

  if (!isFinite(n)) return UNKNOWN_CONDITION;
  return CONDITIONS.find(c => n <= c.max) || CONDITIONS[CONDITIONS.length - 1];
}


const statusEl  = document.getElementById("status");
const refreshEl = document.getElementById("refresh");

function field(name) {
  return document.querySelector('[data-f="' + name + '"]');
}

function setText(name, value) {
  const el = field(name);
  if (el) el.textContent = value;
}

function setHTML(name, value) {
  const el = field(name);
  if (el) el.innerHTML = value;
}

function setStatus(message, state) {
  statusEl.textContent = message;
  statusEl.className = state ? "is-" + state : "";
}

function svg(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const key in attrs) el.setAttribute(key, attrs[key]);
  return el;
}


function formatClock(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  if (isNaN(d)) return "\u2014";
  return d.toLocaleString("en-GB", {
    weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
  });
}

function formatTime(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  if (isNaN(d)) return "\u2014";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDay(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  if (isNaN(d)) return "\u2014";
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}

function cardinal(degrees) {
  const points = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const n = Number(degrees);
  if (!isFinite(n)) return "\u2014";
  return points[Math.round(((n % 360) / 22.5)) % 16];
}

function knotsFrom(kmh) {
  return Number(kmh) / KM_H_PER_KNOT;
}



function buildPlot(windKmh, windDirection, condition, scale) {
  const s = scale || 1;
  const cx = 60, cy = 60;
  const r = 17 * s;
  const staffLength = 36 * s;

  const root = svg("svg", { viewBox: "0 0 120 120" });

  
  if (condition.cover > 0) {
    const clipId = "clip-" + Math.random().toString(36).slice(2, 9);
    const clip = svg("clipPath", { id: clipId });
    clip.appendChild(svg("circle", { cx: cx, cy: cy, r: r }));
    root.appendChild(clip);
    root.appendChild(svg("rect", {
      x: cx - r, y: cy - r,
      width: r * 2 * condition.cover, height: r * 2,
      fill: "#E8EEF4", "clip-path": "url(#" + clipId + ")"
    }));
  }

  root.appendChild(svg("circle", {
    cx: cx, cy: cy, r: r, fill: "none", stroke: "#E8EEF4", "stroke-width": 2 * s
  }));

  const knots = knotsFrom(windKmh);


  if (!isFinite(knots) || knots < 2.5) {
    root.appendChild(svg("circle", {
      cx: cx, cy: cy, r: r + 5 * s, fill: "none", stroke: "#7BA3C4", "stroke-width": 1.5 * s
    }));
    return root;
  }


  const theta = (Number(windDirection) || 0) * Math.PI / 180;
  const dx = Math.sin(theta);
  const dy = -Math.cos(theta);

  const end = { x: cx + dx * (r + staffLength), y: cy + dy * (r + staffLength) };

  root.appendChild(svg("line", {
    x1: cx + dx * r, y1: cy + dy * r, x2: end.x, y2: end.y,
    stroke: "#F0B429", "stroke-width": 2 * s, "stroke-linecap": "round"
  }));

  
  let remaining = Math.round(knots / 5) * 5;
  const perp = { x: dy, y: -dx };
  let offset = 0;

  function addBarb(length, isPennant) {
    const L = length * s;
    const base = { x: end.x - dx * offset, y: end.y - dy * offset };
    const tip  = {
      x: base.x + perp.x * L - dx * L * 0.35,
      y: base.y + perp.y * L - dy * L * 0.35
    };

    if (isPennant) {
      const back = { x: base.x - dx * 8 * s, y: base.y - dy * 8 * s };
      root.appendChild(svg("polygon", {
        points: base.x + "," + base.y + " " + tip.x + "," + tip.y + " " + back.x + "," + back.y,
        fill: "#F0B429"
      }));
      offset += 11 * s;
    } else {
      root.appendChild(svg("line", {
        x1: base.x, y1: base.y, x2: tip.x, y2: tip.y,
        stroke: "#F0B429", "stroke-width": 2 * s, "stroke-linecap": "round"
      }));
      offset += 7 * s;
    }
  }

  while (remaining >= 50) { addBarb(15, true);  remaining -= 50; }
  while (remaining >= 10) { addBarb(14, false); remaining -= 10; }
  if    (remaining >= 5)  { addBarb(7,  false); }

  return root;
}


function buildSunArc(sunrise, sunset, now) {
  const root = svg("svg", { viewBox: "0 0 200 60" });
  const rise = new Date(sunrise).getTime();
  const set  = new Date(sunset).getTime();
  const t    = new Date(now).getTime();

  root.appendChild(svg("path", {
    d: "M 10 52 Q 100 -14 190 52",
    fill: "none", stroke: "#1E4260", "stroke-width": 2
  }));

 
  if (!sunrise || !sunset || !isFinite(rise) || !isFinite(set) || set <= rise) return root;

  
  const progress = Math.max(0, Math.min(1, (t - rise) / (set - rise)));

  
  const p0 = { x: 10, y: 52 }, p1 = { x: 100, y: -14 }, p2 = { x: 190, y: 52 };
  const u = 1 - progress;
  const px = u * u * p0.x + 2 * u * progress * p1.x + progress * progress * p2.x;
  const py = u * u * p0.y + 2 * u * progress * p1.y + progress * progress * p2.y;

  const isDaylight = t >= rise && t <= set;

  root.appendChild(svg("circle", {
    cx: px, cy: py, r: 6,
    fill: isDaylight ? "#F0B429" : "#1E4260",
    stroke: "#0D2233", "stroke-width": 2
  }));

  return root;
}


function buildCurve(times, temps) {
  const W = 600, H = 120, padY = 18;
  const root = svg("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "none" });

  if (!times || !temps || temps.length < 2) return root;

  const min = Math.min.apply(null, temps);
  const max = Math.max.apply(null, temps);
  const span = (max - min) || 1;

  const xAt = i => (i / (temps.length - 1)) * W;
  const yAt = v => padY + (1 - (v - min) / span) * (H - padY * 2);

  
  [min, max].forEach(v => {
    root.appendChild(svg("line", {
      x1: 0, y1: yAt(v), x2: W, y2: yAt(v),
      stroke: "#1E4260", "stroke-width": 1, "stroke-dasharray": "3 5"
    }));
  });

  const points = temps.map((v, i) => xAt(i) + "," + yAt(v)).join(" ");

 
  root.appendChild(svg("polygon", {
    points: "0," + H + " " + points + " " + W + "," + H,
    fill: "rgba(240,180,41,.10)"
  }));

  root.appendChild(svg("polyline", {
    points: points, fill: "none", stroke: "#F0B429",
    "stroke-width": 2.5, "stroke-linejoin": "round", "stroke-linecap": "round",
    "vector-effect": "non-scaling-stroke"
  }));

  
  const hotIndex = temps.indexOf(max);
  root.appendChild(svg("circle", {
    cx: xAt(hotIndex), cy: yAt(max), r: 4, fill: "#E8EEF4"
  }));

  const labelX = Math.min(Math.max(xAt(hotIndex), 30), W - 30);
  const label = svg("text", {
    x: labelX, y: yAt(max) - 12,
    fill: "#E8EEF4", "font-size": 13, "font-family": "IBM Plex Mono, monospace",
    "text-anchor": "middle"
  });
  label.textContent = Math.round(max) + "\u00B0";
  root.appendChild(label);

  return root;
}



function renderPrimary(reading) {
  if (!reading) return;
  const condition = describeCode(0);

  setHTML("temp", Math.round(reading.temperature) + "<span>\u00B0C</span>");
  setText("cond", condition.emoji + "  " + condition.label);
  setText("obs", "Observed " + formatClock(reading.time));

  setHTML("wind", reading.windspeed.toFixed(1) + "<small> km/h</small>");
  setText("winddir", "From " + cardinal(reading.winddirection)
                   + " \u00B7 " + Math.round(reading.winddirection) + "\u00B0");

  const plot = field("plot");
  if (plot) plot.replaceChildren(
    buildPlot(reading.windspeed, reading.winddirection, condition, 1)
  );

 
  if (reading.humidity === null || reading.humidity === undefined) {
    setHTML("humidity", "\u2014<small>%</small>");
  } else {
    setHTML("humidity", Math.round(reading.humidity) + "<small>%</small>");
    const bar = field("humidity-bar");
    if (bar) bar.style.width = Math.round(Math.max(0, Math.min(100, reading.humidity))) + "%";
  }

  
  if (reading.feelsLike === null || reading.feelsLike === undefined) {
    setHTML("feels", "\u2014<small>\u00B0C</small>");
    setText("feels-note", "Not reported");
  } else {
    const diff = reading.feelsLike - reading.temperature;
    setHTML("feels", Math.round(reading.feelsLike) + "<small>\u00B0C</small>");
    setText("feels-note",
      Math.abs(diff) < 0.5 ? "Matches the air temperature"
        : (diff > 0 ? Math.abs(Math.round(diff)) + "\u00B0 warmer than the air"
                    : Math.abs(Math.round(diff)) + "\u00B0 cooler than the air"));
  }


  setText("sunrise", formatTime(reading.sunrise));
  setText("sunset", formatTime(reading.sunset));
  const arc = field("sunarc");
  if (arc) arc.replaceChildren(buildSunArc(reading.sunrise, reading.sunset, reading.time));

  
  const strip = field("week");
  if (strip && reading.daily) {
    strip.replaceChildren();
    reading.daily.time.forEach((day, i) => {
      const c = describeCode(reading.daily.code[i]);
      const cell = document.createElement("div");
      cell.className = "day" + (i === 0 ? " is-today" : "");
      cell.innerHTML =
        '<span class="day-name">' + (i === 0 ? "Today" : formatDay(day)) + '</span>' +
        '<span class="day-icon">' + c.emoji + '</span>' +
        '<span class="day-max">' + Math.round(reading.daily.max[i]) + '\u00B0</span>' +
        '<span class="day-min">' + Math.round(reading.daily.min[i]) + '\u00B0</span>';
      strip.appendChild(cell);
    });
  }

  
  const curve = field("curve");
  if (curve && reading.hourly) {
    curve.replaceChildren(buildCurve(reading.hourly.time, reading.hourly.temp));
    const t = reading.hourly.time;
    setText("curve-start", formatTime(t[0]));
    setText("curve-mid",   formatTime(t[Math.floor(t.length / 2)]));
    setText("curve-end",   formatTime(t[t.length - 1]));
  }

  
  document.documentElement.style.setProperty("--wash", condition.wash);
}

function renderSecondary(reading) {
  if (!reading) return;
  const condition = describeCode(reading.weathercode);

  setHTML("abuja-temp", Math.round(reading.temperature) + "<small>\u00B0C</small>");
  setText("abuja-cond", condition.emoji + "  " + condition.label);
  setHTML("abuja-wind", reading.windspeed.toFixed(1) + "<small> km/h</small>");

  const mini = field("abuja-plot");
  if (mini) mini.replaceChildren(
    buildPlot(reading.windspeed, reading.winddirection, condition, 1)
  );
}

function renderAll(readings, isStale) {
  renderPrimary(readings[PRIMARY.id]);
  renderSecondary(readings[SECONDARY.id]);
  document.querySelectorAll("[data-card]").forEach(card => {
    card.classList.toggle("is-stale", Boolean(isStale));
  });
}



function saveReading(readings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      savedAt: new Date().toISOString(),
      readings: readings
    }));
  } catch (error) {
    
    setStatus("Showing live data \u2014 could not cache it locally", "live");
  }
}

function loadReading() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch (error) {
    return null;   
  }
}



function endpointFor(station) {
  return "https://api.open-meteo.com/v1/forecast"
       + "?latitude=" + station.latitude
       + "&longitude=" + station.longitude
       + "&current_weather=true"
       + "&hourly=temperature_2m,relativehumidity_2m,apparent_temperature"
       + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset"
       + "&timezone=auto";
}


function shape(data) {
  const now = data.current_weather;
  const hourly = data.hourly;
  const daily = data.daily;

  const reading = {
    temperature: now.temperature,
    windspeed: now.windspeed,
    winddirection: now.winddirection,
    weathercode: now.weathercode,
    time: now.time,
    humidity: null,
    feelsLike: null,
    hourly: null,
    sunrise: null,
    sunset: null,
    daily: null
  };

  if (hourly && Array.isArray(hourly.time)) {
   
    let i = hourly.time.indexOf(now.time);
    if (i === -1) i = 0;

    if (Array.isArray(hourly.relativehumidity_2m)) {
      reading.humidity = hourly.relativehumidity_2m[i];
    }
    if (Array.isArray(hourly.apparent_temperature)) {
      reading.feelsLike = hourly.apparent_temperature[i];
    }
    if (Array.isArray(hourly.temperature_2m)) {
      reading.hourly = {
        time: hourly.time.slice(i, i + 24),
        temp: hourly.temperature_2m.slice(i, i + 24)
      };
    }
  }

  if (daily && Array.isArray(daily.time)) {
    if (Array.isArray(daily.sunrise)) reading.sunrise = daily.sunrise[0];
    if (Array.isArray(daily.sunset))  reading.sunset  = daily.sunset[0];

    if (Array.isArray(daily.temperature_2m_max)) {
      reading.daily = {
        time: daily.time.slice(0, 7),
        max:  daily.temperature_2m_max.slice(0, 7),
        min:  daily.temperature_2m_min.slice(0, 7),
        code: daily.weathercode.slice(0, 7)
      };
    }
  }

  return reading;
}

async function fetchStation(station) {
  const response = await fetch(endpointFor(station));

  
  if (!response.ok) {
    throw new Error(station.name + " returned " + response.status);
  }

  const data = await response.json();

  if (!data || !data.current_weather) {
    throw new Error("No current conditions for " + station.name);
  }

  return shape(data);
}

async function loadWeather() {
  refreshEl.disabled = true;
  setStatus("Fetching current conditions\u2026", "loading");

  try {
    const [primary, secondary] = await Promise.all([
      fetchStation(PRIMARY),
      fetchStation(SECONDARY)
    ]);

    const readings = {};
    readings[PRIMARY.id] = primary;
    readings[SECONDARY.id] = secondary;

    renderAll(readings, false);
    saveReading(readings);
    setStatus("Live \u00B7 updated " + formatClock(new Date().toISOString()), "live");
  } catch (error) {

    const offline = error && error.name === "TypeError";
    const cause = offline
      ? "No connection to the weather service"
      : "The weather service replied but the data was unusable";

    setStatus(loadReading()
      ? cause + " \u2014 showing the last saved reading"
      : cause + ". Press Refresh weather to try again.", "error");
  } finally {
    refreshEl.disabled = false;
  }
}


function init() {
  const cached = loadReading();

  if (cached && cached.readings) {
    renderAll(cached.readings, true);
    setStatus("Last saved " + formatClock(cached.savedAt) + " \u00B7 refreshing\u2026", "loading");
  }

  refreshEl.addEventListener("click", loadWeather);
  loadWeather();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
