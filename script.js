/* ===========================================================
   AquaSense — shared script
   Handles: live clock, mobile nav, conic-gradient gauges,
   sparkline / trend / bar charts (Chart.js).
   =========================================================== */

(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  });

  /* ---------- live clock ---------- */
  function pad(n) { return n.toString().padStart(2, "0"); }

  function formatClock(d) {
    let h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
  }

  function formatDateClock(d) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}, ${formatClock(d)}`;
  }

  function tickClocks() {
    const now = new Date();
    document.querySelectorAll("[data-clock]").forEach((el) => {
      el.textContent = formatClock(now);
    });
    document.querySelectorAll("[data-datetime-clock]").forEach((el) => {
      el.textContent = formatDateClock(now);
    });
  }

  tickClocks();
  setInterval(tickClocks, 1000);

  /* ---------- shared chart theme ---------- */
  window.AQ_COLORS = {
    cyan: "#28d9f0",
    teal: "#2ee6b8",
    purple: "#b18cf7",
    amber: "#f0a830",
    red: "#f0566a",
    blue: "#5b9bf2",
    muted: "#5d6b80",
    grid: "rgba(255,255,255,0.05)",
  };

  function withAlpha(hex, alpha) {
    const v = hex.replace("#", "");
    const r = parseInt(v.substring(0, 2), 16);
    const g = parseInt(v.substring(2, 4), 16);
    const b = parseInt(v.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  window.AQ_alpha = withAlpha;

  /* ---------- radial gauge (SVG conic ring) ---------- */
  function renderGauge(el) {
    const value = parseFloat(el.dataset.value || "0");
    const max = parseFloat(el.dataset.max || "100");
    const color = el.dataset.color || window.AQ_COLORS.cyan;
    const size = 92;
    const stroke = 9;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(1, value / max));
    const offset = c * (1 - pct);

    el.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none"
          stroke="rgba(255,255,255,0.08)" stroke-width="${stroke}" />
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none"
          stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}" />
      </svg>
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-gauge]").forEach(renderGauge);
  });

  /* ---------- chart defaults ---------- */
  function applyChartDefaults() {
    if (typeof Chart === "undefined") return;
    Chart.defaults.font.family = "'JetBrains Mono', monospace";
    Chart.defaults.font.size = 10;
    Chart.defaults.color = window.AQ_COLORS.muted;
  }

  document.addEventListener("DOMContentLoaded", applyChartDefaults);
})();
