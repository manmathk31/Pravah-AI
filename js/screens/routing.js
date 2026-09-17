/**
 * PravahAi Screen: Safe Routing Guidance View (routing.js)
 * Compares primary direct route vs. elevated flood-safe detour corridor.
 * Stacks vertically on mobile, side-by-side on desktop.
 */

import { sim } from '../sim.js';

let unsubscribeTick = null;
let unsubscribeScenario = null;

export function renderRouting(container) {
  container.innerHTML = `
    <div class="routing-page-container">
      <!-- Section Header -->
      <div class="section-header">
        <div>
          <h1 class="section-title">Hyperlocal Safe-Route Guidance</h1>
          <p class="section-subtitle">
            Dynamic road clearance audit: automatic detours around low-lying flooded culverts
          </p>
        </div>
        <span class="status-pill status-pill-safe">Dynamic Re-routing Enabled</span>
      </div>

      <!-- Route Selector Panel -->
      <div class="glass-panel route-query-card">
        <div class="route-inputs-grid">
          <div class="input-field-group">
            <label class="input-field-label">Origin (Current Location)</label>
            <select id="route-origin-select" class="form-select">
              <option value="tech-park" selected>📍 North Riverside Tech Park (Gate 1)</option>
              <option value="metro-stn">📍 Sector 4 Metro Station</option>
              <option value="industrial-hub">📍 East Industrial Corridor</option>
            </select>
          </div>

          <div class="input-field-group">
            <label class="input-field-label">Destination</label>
            <select id="route-dest-select" class="form-select">
              <option value="hospital" selected>🏥 Hillside District Medical Center</option>
              <option value="civic-center">🏛 City Administration Center</option>
              <option value="high-school">🏫 West Ridge Educational Campus</option>
            </select>
          </div>

          <button id="btn-recalc-route" class="btn btn-primary" style="height: 44px;">
            <svg style="width: 18px; height: 18px; fill: none; stroke: currentColor;" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Re-evaluate Paths
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
    <!-- Direct Lowland Route (Hazardous / Submerged) -->
    <div class="glass-panel route-card route-danger">
      <div class="route-card-header">
        <div class="route-badge-row">
          <span class="status-pill status-pill-unsafe">
            <span class="status-dot status-dot-unsafe"></span>
            ${isFloodActive ? 'ROAD CLOSED / SUBMERGED' : 'HIGH FLOOD RISK'}
          </span>
          <span class="detour-pill" style="background: rgba(217, 56, 62, 0.12); color: var(--status-unsafe);">
            Fastest Path (Blocked)
          </span>
        </div>
        <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 700;">ROUTE 1</span>
      </div>

      <div>
        <h3 class="route-title ${isFloodActive ? 'segment-crossout' : ''}">${direct.name}</h3>
        <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px;">
          ${direct.elevation_profile} • Traverses River Basin Culvert
        </p>
      </div>

      <div class="route-stat-triplet">
        <div class="route-stat-item">
          <span class="route-stat-val">${direct.distance_km} km</span>
          <span class="route-stat-lbl">Distance</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-val" style="color: var(--status-unsafe);">${direct.est_time_mins} min</span>
          <span class="route-stat-lbl">Transit Time</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-val" style="color: var(--status-unsafe);">${isFloodActive ? '98%' : '76%'}</span>
          <span class="route-stat-lbl">Inundation Risk</span>
        </div>
      </div>

      <div class="route-hazards-box hazard-unsafe">
        <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>⚠ HAZARD WARNING: Segment 3B Imminent Failure</span>
        </div>
        <div>
          ${direct.hazard_summary}
          Water level at Lowland Culvert is currently <strong>${node3 ? node3.water_level : 1.76}m</strong>.
          Curb height exceeded. Heavy risk of engine hydro-lock.
        </div>
      </div>

      <div style="margin-top: auto; display: flex; gap: 8px;">
        <button class="btn btn-glass btn-sm" style="flex: 1; color: var(--status-unsafe); opacity: 0.7; cursor: not-allowed;">
          ✕ Not Advised for Travel
        </button>
      </div>
    </div>

    <!-- Recommended Safe Route (Elevated Bypass Corridor) -->
    <div class="glass-panel-elevated route-card route-recommended">
      <div class="route-card-header">
        <div class="route-badge-row">
          <span class="status-pill status-pill-safe">
            <span class="status-dot status-dot-safe"></span>
            PRAVAHAI RECOMMENDED
          </span>
          <span class="detour-pill" style="background: rgba(34, 167, 96, 0.12); color: var(--status-safe);">
            ${safe.detour_time_diff}
          </span>
        </div>
        <span style="font-size: var(--text-xs); color: var(--status-safe); font-weight: 800;">SAFE CORRIDOR</span>
      </div>

      <div>
        <h3 class="route-title">${safe.name}</h3>
        <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px;">
          ${safe.elevation_profile} • 100% Above 100-Year Flood Plane
        </p>
      </div>

      <div class="route-stat-triplet">
        <div class="route-stat-item">
          <span class="route-stat-val">${safe.distance_km} km</span>
          <span class="route-stat-lbl">Distance (+1.8 km)</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-val" style="color: var(--status-safe);">${safe.est_time_mins} min</span>
          <span class="route-stat-lbl">Transit Time</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-val" style="color: var(--status-safe);">4%</span>
          <span class="route-stat-lbl">Hazard Score</span>
        </div>
      </div>

      <div class="route-hazards-box hazard-safe">
        <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>✓ VERIFIED CLEAR: 0 Flood Hazard Points</span>
        </div>
        <div>
          ${safe.hazard_summary}
          Node 06 retention weir upstream telemetry confirms zero runoff spillover.
          Continuous dry pavement verified by roadside vision nodes.
        </div>
      </div>

      <div style="margin-top: auto; display: flex; gap: 8px;">
        <a href="#map" class="btn btn-primary btn-sm" style="flex: 1; text-align: center;">
          View Route on Live Map →
        </a>
      </div>
    </div>
  `;
}
