/**
 * PravahAi Screen: Safe Routing Guidance View (routing.js)
 * Clean comparison of primary direct route vs elevated flood-safe bypass corridor without emojis
 */

import { sim } from '../sim.js';

let unsubscribeTick = null;
let unsubscribeScenario = null;

export function renderRouting(container) {
  container.innerHTML = `
    <div class="routing-page-container">
      <div class="section-header">
        <div>
          <h1 class="section-title">Safe Detour Navigation</h1>
          <p class="section-subtitle">
            Find dry, open roads that avoid flooded underpasses and overflowing rivers in real time
          </p>
        </div>
        <span class="status-pill status-pill-safe">Automatic Detours Active</span>
      </div>

      <!-- Route Selector Panel -->
      <div class="glass-panel route-query-card">
        <div class="route-inputs-grid">
          <div class="input-field-group">
            <label class="input-field-label">Starting Point</label>
            <select id="route-origin-select" class="form-select">
              <option value="tech-park" selected>North Riverside Tech Park (Gate 1)</option>
              <option value="metro-stn">Sector 4 Metro Station</option>
              <option value="industrial-hub">East Industrial Corridor</option>
            </select>
          </div>

          <div class="input-field-group">
            <label class="input-field-label">Destination</label>
            <select id="route-dest-select" class="form-select">
              <option value="hospital" selected>Hillside District Medical Center</option>
              <option value="civic-center">City Administration Center</option>
              <option value="high-school">West Ridge Educational Campus</option>
            </select>
          </div>

          <button id="btn-recalc-route" class="btn btn-primary" style="height: 42px;">
            Check Road Safety
          </button>
        </div>
      </div>

      <!-- Side-by-Side (Desktop) vs Stacked (Mobile) Route Comparison -->
      <div id="routes-comparison-mount" class="route-comparison-grid">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  const mountEl = container.querySelector('#routes-comparison-mount');
  renderRouteComparison(mountEl);

  container.querySelector('#btn-recalc-route')?.addEventListener('click', () => {
    renderRouteComparison(mountEl);
  });

  if (unsubscribeTick) unsubscribeTick();
  unsubscribeTick = sim.on('tick', () => {
    renderRouteComparison(mountEl);
  });

  if (unsubscribeScenario) unsubscribeScenario();
  unsubscribeScenario = sim.on('floodScenarioTriggered', () => {
    renderRouteComparison(mountEl);
  });
}

function renderRouteComparison(mountEl) {
  if (!mountEl || !sim.routes) return;

  const node3 = sim.getNodeById('node-03');
  const isFloodActive = node3 && node3.status === 'UNSAFE';

  const direct = sim.routes.direct_route;
  const safe = sim.routes.safe_route;

  mountEl.innerHTML = `
    <!-- Direct Route (Hazardous) -->
    <div class="glass-panel route-card route-danger">
      <div class="route-card-header">
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span class="status-pill status-pill-unsafe">
            <span class="status-dot status-dot-unsafe"></span>
            ${isFloodActive ? 'ROAD CLOSED — FLOODED' : 'CAUTION — RISK OF FLOODING'}
          </span>
          <span class="detour-pill" style="background: rgba(239, 68, 68, 0.1); color: var(--status-unsafe);">
            Direct Route (Lowland Causeway)
          </span>
        </div>
        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">ROUTE 01</span>
      </div>

      <div>
        <h3 class="route-title ${isFloodActive ? 'segment-crossout' : ''}">${direct.name}</h3>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          ${direct.elevation_profile} • Low-elevation road crossing river canal
        </p>
      </div>

      <div class="route-stat-triplet">
        <div class="route-stat-item">
          <span class="route-stat-val">${direct.distance_km} km</span>
          <span class="route-stat-lbl">Distance</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-val" style="color: var(--status-unsafe);">${direct.est_time_mins} min</span>
          <span class="route-stat-lbl">Driving Time</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-val" style="color: var(--status-unsafe);">${isFloodActive ? '98%' : '76%'}</span>
          <span class="route-stat-lbl">Flood Danger</span>
        </div>
      </div>

      <div class="route-hazards-box hazard-unsafe">
        <div style="font-weight: 700; margin-bottom: 2px;">
          Flood Danger: Water Covering Road
        </div>
        <div>
          Water level at Lowland Causeway is <strong>${node3 ? node3.water_level : 1.76}m</strong>.
          Water is too deep for normal cars. High risk of engine stalling and getting trapped.
        </div>
      </div>

      <div style="margin-top: auto;">
        <button class="btn btn-glass btn-sm" style="width: 100%; color: var(--status-unsafe); opacity: 0.75; cursor: not-allowed;">
          Do Not Drive — Road Impassable
        </button>
      </div>
    </div>

    <!-- Recommended Safe Route (Bypass) -->
    <div class="glass-panel-elevated route-card route-recommended">
      <div class="route-card-header">
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span class="status-pill status-pill-safe">
            <span class="status-dot status-dot-safe"></span>
            RECOMMENDED
          </span>
          <span class="detour-pill" style="background: rgba(16, 185, 129, 0.1); color: var(--status-safe);">
            ${safe.detour_time_diff}
          </span>
        </div>
        <span style="font-size: 0.72rem; color: var(--status-safe); font-weight: 800;">SAFE DRY ROUTE</span>
      </div>

      <div>
        <h3 class="route-title">${safe.name}</h3>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          ${safe.elevation_profile} • Elevated High Ground • Completely Dry
        </p>
      </div>

      <div class="route-stat-triplet">
        <div class="route-stat-item">
          <span class="route-stat-val">${safe.distance_km} km</span>
          <span class="route-stat-lbl">Distance (+1.8 km)</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-val" style="color: var(--status-safe);">${safe.est_time_mins} min</span>
          <span class="route-stat-lbl">Driving Time</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-val" style="color: var(--status-safe);">4%</span>
          <span class="route-stat-lbl">Flood Danger</span>
        </div>
      </div>

      <div class="route-hazards-box hazard-safe">
        <div style="font-weight: 700; margin-bottom: 2px;">
          Verified Safe: Zero Water On Road
        </div>
        <div>
          Hillside weather station confirms zero flooding.
          Street cameras confirm completely dry pavement all the way to your destination.
        </div>
      </div>

      <div style="margin-top: auto;">
        <a href="#map" class="btn btn-primary btn-sm" style="width: 100%; text-align: center;">
          Open Safe Route on Map →
        </a>
      </div>
    </div>
  `;
}
