/**
 * PravahAi Screen: Interactive Basin Map View (map.js)
 * Leaflet.js map with custom SVG pins, mobile bottom sheet, and dynamic flood rerouting
 */

import { sim } from '../sim.js';
import { BottomSheetComponent } from '../components/bottomSheet.js';

let leafletMap = null;
let markersMap = new Map();
let directRouteLine = null;
let safeRouteLine = null;
let bottomSheet = null;
let unsubscribeTick = null;
let unsubscribeScenario = null;
let heatmapCircleGroup = null;
let heatmapVisible = true;

export function renderMap(container) {
  container.innerHTML = `
    <div class="map-page-container">
      <!-- Leaflet Canvas Mount -->
      <div id="leaflet-map"></div>

      <!-- Top Floating HUD -->
      <div class="map-hud-top">
        <div class="map-hud-controls">
          <div class="map-hud-pill">
            <span class="live-beacon-dot"></span>
            <span>HYPERLOCAL BASIN MESH</span>
          </div>
          <div id="route-advisory-pill" class="map-hud-pill status-pill-safe" style="border-radius: var(--radius-sm);">
            ✓ RECOMMENDED: Lowland Causeway (Direct)
          </div>
        </div>

        <!-- Mobile Action Bar (Toggle Legend / Heatmap) -->
        <div class="map-mobile-action-bar">
          <button id="mobile-toggle-legend" class="map-tool-icon-btn" title="Toggle Legend" aria-label="Legend">
            🗺
          </button>
          <button id="mobile-toggle-heat" class="map-tool-icon-btn" title="Toggle Risk Heatmap" aria-label="Risk Overlay">
            🌡
          </button>
        </div>
      </div>

      <!-- Desktop Floating Node Inspector (Side Card) -->
      <div id="desktop-node-panel" class="glass-panel-elevated desktop-node-inspect-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 id="inspect-node-title" style="font-size: var(--text-sm); font-weight: 800; color: var(--text-main);">
              Node Inspection
            </h4>
            <span id="inspect-node-loc" style="font-size: var(--text-xs); color: var(--text-muted);">
              Click a basin pin to inspect
            </span>
          </div>
          <span id="inspect-node-status" class="status-pill status-pill-safe">SAFE</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px;">
          <div style="background: rgba(230,243,250,0.6); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 600;">WATER DEPTH</div>
            <div id="inspect-water-val" style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">--</div>
          </div>
          <div style="background: rgba(230,243,250,0.6); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.68rem; color: var(--text-muted); font-weight: 600;">RISE RATE</div>
            <div id="inspect-rise-val" style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">--</div>
          </div>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;" id="inspect-node-impact">
          Select any monitoring node to view telemetry stream and edge camera status.
        </div>

        <a id="inspect-detail-btn" href="#node-detail?id=node-03" class="btn btn-primary btn-sm" style="width: 100%; text-align: center;">
          Full Sensor Analytics →
        </a>
      </div>

      <!-- Legend (Floating glass box on desktop, popover on mobile) -->
      <div id="map-legend" class="glass-panel map-legend-card">
        <div style="font-weight: 800; font-size: var(--text-xs); text-transform: uppercase; color: var(--accent-deep); letter-spacing: 0.04em;">
          Network Status & Routes
        </div>
        <div class="legend-item">
          <span class="status-dot status-dot-safe"></span>
          <span>Normal Drainage (&lt;50% Risk)</span>
        </div>
        <div class="legend-item">
          <span class="status-dot status-dot-risk"></span>
          <span>At Risk (Advisory Slowdown)</span>
        </div>
        <div class="legend-item">
          <span class="status-dot status-dot-unsafe"></span>
          <span>Unsafe / Impassable Overtopping</span>
        </div>
        <div style="border-top: 1px solid rgba(10,110,168,0.1); margin: 2px 0;"></div>
        <div class="legend-item">
          <div class="legend-line-sample" style="background: var(--status-safe);"></div>
          <span>Active Safe Route (Ridge Bypass)</span>
        </div>
        <div class="legend-item">
          <div class="legend-line-sample" style="background: var(--status-unsafe); border-top: 2px dashed #fff;"></div>
          <span>Flooded Segment (Lowland Blvd)</span>
        </div>
      </div>
    </div>
  `;

  // Initialize Bottom Sheet component for mobile
  bottomSheet = new BottomSheetComponent();

  // Mobile Legend Toggle
  const mobLegendBtn = container.querySelector('#mobile-toggle-legend');
  const legendCard = container.querySelector('#map-legend');
  mobLegendBtn?.addEventListener('click', () => {
    legendCard?.classList.toggle('mobile-open');
  });

  // Mobile Heatmap Toggle
  const mobHeatBtn = container.querySelector('#mobile-toggle-heat');
  mobHeatBtn?.addEventListener('click', () => {
    toggleHeatmap();
  });

  // Leaflet map initialization
  initLeaflet();

  // Subscriptions
  if (unsubscribeTick) unsubscribeTick();
  unsubscribeTick = sim.on('tick', () => {
    updateMarkerStates();
    updateRouteStates();
  });

  if (unsubscribeScenario) unsubscribeScenario();
  unsubscribeScenario = sim.on('floodScenarioTriggered', () => {
    updateMarkerStates();
    updateRouteStates();
  });
}

function initLeaflet() {
  const mapMount = document.getElementById('leaflet-map');
  if (!mapMount || typeof L === 'undefined') return;

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  // Metro basin center
  leafletMap = L.map('leaflet-map', {
    center: [18.527, 73.848],
    zoom: 13,
    zoomControl: false
  });

  // Zoom control positioned in bottom right on desktop
  L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

  // CartoDB Positron clean light tiles (complements glassmorphic light blue palette)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap contributors',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(leafletMap);

  // Add Route Polylines
  initPolylines();

  // Add Risk Heatmap Circles
  initRiskHeatmap();

  // Add Edge Node Markers
  initNodeMarkers();

  // Open default inspection on Node 03
  const targetNode = sim.getNodeById('node-03');
  if (targetNode) {
    updateInspectionPanel(targetNode);
  }
}

function initPolylines() {
  if (!sim.routes || !leafletMap) return;

  // Direct Route (Lowland Blvd)
  directRouteLine = L.polyline(sim.routes.direct_route.segments, {
    color: '#d9383e',
    weight: 6,
    opacity: 0.85,
    dashArray: '10, 8'
  }).addTo(leafletMap);

  // Recommended Safe Route (Ridge Bypass)
  safeRouteLine = L.polyline(sim.routes.safe_route.segments, {
    color: '#22a760',
    weight: 6,
    opacity: 0.95
  }).addTo(leafletMap);

  // Route labels / markers for Origin & Destination
  const startIcon = L.divIcon({
    className: 'route-origin-pin',
    html: `<div style="background: #0a6ea8; color: #fff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">A</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });

  const endIcon = L.divIcon({
    className: 'route-dest-pin',
    html: `<div style="background: #22a760; color: #fff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">B</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });

  L.marker([sim.routes.origin.lat, sim.routes.origin.lng], { icon: startIcon }).addTo(leafletMap)
    .bindTooltip(`Origin: ${sim.routes.origin.name}`, { direction: 'top' });

  L.marker([sim.routes.destination.lat, sim.routes.destination.lng], { icon: endIcon }).addTo(leafletMap)
    .bindTooltip(`Destination: ${sim.routes.destination.name}`, { direction: 'top' });
}

function initRiskHeatmap() {
  heatmapCircleGroup = L.layerGroup().addTo(leafletMap);
  sim.nodes.forEach(node => {
    const color = node.status === 'UNSAFE' ? '#d9383e' : node.status === 'AT_RISK' ? '#e08b00' : '#1ea7db';
    const radius = 350 + (node.risk_pct * 4);

    L.circle([node.lat, node.lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.15,
      weight: 1,
      radius: radius
    }).addTo(heatmapCircleGroup);
  });
}

function toggleHeatmap() {
  if (!leafletMap || !heatmapCircleGroup) return;
  heatmapVisible = !heatmapVisible;
  if (heatmapVisible) {
    leafletMap.addLayer(heatmapCircleGroup);
  } else {
    leafletMap.removeLayer(heatmapCircleGroup);
  }
}

function initNodeMarkers() {
  markersMap.clear();
  sim.nodes.forEach(node => {
    const isUnsafe = node.status === 'UNSAFE';
    const isRisk = node.status === 'AT_RISK';
    const pinClass = isUnsafe ? 'marker-unsafe' : isRisk ? 'marker-risk' : 'marker-safe';

    const customIcon = L.divIcon({
      className: 'pravah-marker',
      html: `
        <div class="pravah-marker-pin ${pinClass}">
          ${node.id.replace('node-0', 'N')}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([node.lat, node.lng], { icon: customIcon }).addTo(leafletMap);

    marker.on('click', () => {
      // If mobile (<768px), open bottom sheet; else open desktop card
      if (window.innerWidth < 768) {
        bottomSheet?.open(node);
      } else {
        updateInspectionPanel(node);
      }
    });

    markersMap.set(node.id, marker);
  });
}

function updateMarkerStates() {
  sim.nodes.forEach(node => {
    const marker = markersMap.get(node.id);
    if (!marker) return;

    const isUnsafe = node.status === 'UNSAFE';
    const isRisk = node.status === 'AT_RISK';
    const pinClass = isUnsafe ? 'marker-unsafe' : isRisk ? 'marker-risk' : 'marker-safe';

    const iconHtml = `
      <div class="pravah-marker-pin ${pinClass}">
        ${node.id.replace('node-0', 'N')}
      </div>
    `;

    marker.setIcon(L.divIcon({
      className: 'pravah-marker',
      html: iconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    }));
  });
}

function updateRouteStates() {
  const node3 = sim.getNodeById('node-03');
  const advisoryPill = document.getElementById('route-advisory-pill');

  if (node3 && node3.status === 'UNSAFE') {
    if (advisoryPill) {
      advisoryPill.className = 'map-hud-pill status-pill-unsafe';
      advisoryPill.innerHTML = '🚨 REROUTING: Causeway Submerged — Ridge Bypass Active (+7 min)';
    }

    // Direct route turns bold dashed red
    directRouteLine?.setStyle({
      color: '#d9383e',
      weight: 7,
      dashArray: '8, 8',
      opacity: 0.95
    });

    // Safe bypass highlighted green
    safeRouteLine?.setStyle({
      color: '#22a760',
      weight: 7,
      opacity: 1
    });
  } else {
    if (advisoryPill) {
      advisoryPill.className = 'map-hud-pill status-pill-safe';
      advisoryPill.innerHTML = '✓ RECOMMENDED: Lowland Causeway (Direct, Passable)';
    }

    directRouteLine?.setStyle({
      color: '#1ea7db',
      weight: 5,
      dashArray: null,
      opacity: 0.75
    });
  }
}

function updateInspectionPanel(node) {
  const panel = document.getElementById('desktop-node-panel');
  if (!panel) return;

  panel.classList.add('active');
  const isUnsafe = node.status === 'UNSAFE';
  const isRisk = node.status === 'AT_RISK';
  const pillClass = isUnsafe ? 'status-pill-unsafe' : isRisk ? 'status-pill-risk' : 'status-pill-safe';

  panel.querySelector('#inspect-node-title').textContent = node.name;
  panel.querySelector('#inspect-node-loc').textContent = node.location;

  const statusEl = panel.querySelector('#inspect-node-status');
  statusEl.className = `status-pill ${pillClass}`;
  statusEl.textContent = node.status.replace('_', ' ');

  panel.querySelector('#inspect-water-val').textContent = `${node.water_level}m`;
  panel.querySelector('#inspect-water-val').style.color = isUnsafe ? 'var(--status-unsafe)' : isRisk ? 'var(--status-risk)' : 'var(--text-main)';

  panel.querySelector('#inspect-rise-val').textContent = `${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} cm/h`;
  panel.querySelector('#inspect-node-impact').textContent = node.road_impact;
  panel.querySelector('#inspect-detail-btn').href = `#node-detail?id=${node.id}`;
}
