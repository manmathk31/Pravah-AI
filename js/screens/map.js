/**
 * PravahAi Screen: Interactive Basin Map View (map.js)
 * Clean Leaflet map with vector controls, mobile bottom sheet, and dynamic flood rerouting
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
let currentBasemapMode = 'slate';
let activeTileLayers = [];

export function renderMap(container) {
  container.innerHTML = `
    <div class="map-page-container">
      <div id="leaflet-map" class="view-slate"></div>

      <!-- Top Floating HUD -->
      <div class="map-hud-top">
        <div class="map-hud-controls">
          <div class="map-hud-row">
            <div class="map-hud-pill">
              <span class="live-beacon-dot"></span>
              <span>LIVE FLOOD STATIONS</span>
            </div>

            <!-- Lightweight Basemap Mode Switcher (Zero extra libraries) -->
            <div class="map-view-switcher" role="group" aria-label="Map Basemap Style">
              <button type="button" class="map-view-btn active" data-view-mode="slate" title="Slate Gray Basemap (Default)">
                <span class="view-icon">🗺️</span>
                <span>Slate</span>
              </button>
              <button type="button" class="map-view-btn" data-view-mode="satellite" title="Satellite Imagery">
                <span class="view-icon">🛰️</span>
                <span>Satellite</span>
              </button>
              <button type="button" class="map-view-btn" data-view-mode="contrast" title="High Contrast Tactical View">
                <span class="view-icon">⚡</span>
                <span>High Contrast</span>
              </button>
            </div>
          </div>

          <div id="route-advisory-pill" class="map-hud-pill status-pill-safe" style="border-radius: var(--radius-sm);">
            NORMAL ROUTE: Lowland Causeway is Clear & Dry
          </div>
        </div>

        <div class="map-mobile-action-bar">
          <button id="mobile-toggle-view" class="map-tool-icon-btn" title="Cycle Basemap Style">
            VIEW
          </button>
          <button id="mobile-toggle-legend" class="map-tool-icon-btn" title="Toggle Legend">
            MAP
          </button>
          <button id="mobile-toggle-heat" class="map-tool-icon-btn" title="Toggle Risk Overlay">
            HEAT
          </button>
        </div>
      </div>

      <!-- Desktop Floating Node Inspector -->
      <div id="desktop-node-panel" class="glass-panel-elevated desktop-node-inspect-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 id="inspect-node-title" style="font-size: 0.95rem; font-weight: 800; color: #ffffff;">
              Station Details
            </h4>
            <span id="inspect-node-loc" style="font-size: 0.72rem; color: var(--text-muted);">
              Click any map pin to see water levels
            </span>
          </div>
          <span id="inspect-node-status" class="status-pill status-pill-safe">SAFE</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div style="background: rgba(14, 28, 46, 0.85); border: 1px solid rgba(255, 255, 255, 0.06); padding: 10px; border-radius: var(--radius-xs);">
            <div style="font-size: 0.65rem; color: var(--accent-cyan); font-weight: 800; font-family: var(--font-family-mono);">WATER DEPTH</div>
            <div id="inspect-water-val" style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-top: 2px;">--</div>
          </div>
          <div style="background: rgba(14, 28, 46, 0.85); border: 1px solid rgba(255, 255, 255, 0.06); padding: 10px; border-radius: var(--radius-xs);">
            <div style="font-size: 0.65rem; color: var(--accent-cyan); font-weight: 800; font-family: var(--font-family-mono);">RISING SPEED</div>
            <div id="inspect-rise-val" style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-top: 2px;">--</div>
          </div>
        </div>

        <div style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.5;" id="inspect-node-impact">
          Click any station pin on the map to see real-time water levels, camera status, and warnings.
        </div>

        <a id="inspect-detail-btn" href="#node-detail?id=node-03" class="btn btn-primary btn-sm" style="width: 100%; text-align: center;">
          View Full Station Details →
        </a>
      </div>

      <!-- Legend -->
      <div id="map-legend" class="glass-panel map-legend-card">
        <div style="font-weight: 800; font-size: 0.72rem; text-transform: uppercase; color: var(--accent-cyan); letter-spacing: 0.06em; font-family: var(--font-family-mono);">
          Road Status & Routes
        </div>
        <div class="legend-item">
          <span class="status-dot status-dot-safe"></span>
          <span>Safe & Clear</span>
        </div>
        <div class="legend-item">
          <span class="status-dot status-dot-risk"></span>
          <span>Caution / Slow Down</span>
        </div>
        <div class="legend-item">
          <span class="status-dot status-dot-unsafe"></span>
          <span>Flooded / Closed</span>
        </div>
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 4px 0;"></div>
        <div class="legend-item">
          <div class="legend-line-sample" style="background: var(--status-safe); box-shadow: 0 0 8px #10b981;"></div>
          <span>Safe Detour (Ridge Highway)</span>
        </div>
        <div class="legend-item">
          <div class="legend-line-sample" style="background: var(--status-unsafe); border-top: 1px dashed #fff; box-shadow: 0 0 8px #ef4444;"></div>
          <span>Flooded Road (Lowland Blvd)</span>
        </div>
      </div>
    </div>
  `;

  bottomSheet = new BottomSheetComponent();

  // Desktop Basemap Switcher buttons
  container.querySelectorAll('.map-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.currentTarget.dataset.viewMode;
      if (mode) setBasemapMode(mode);
    });
  });

  // Mobile Basemap cycle button
  const mobViewBtn = container.querySelector('#mobile-toggle-view');
  mobViewBtn?.addEventListener('click', () => {
    const modes = ['slate', 'satellite', 'contrast'];
    const nextIdx = (modes.indexOf(currentBasemapMode) + 1) % modes.length;
    setBasemapMode(modes[nextIdx]);
  });

  const mobLegendBtn = container.querySelector('#mobile-toggle-legend');
  const legendCard = container.querySelector('#map-legend');
  mobLegendBtn?.addEventListener('click', () => {
    legendCard?.classList.toggle('mobile-open');
  });

  const mobHeatBtn = container.querySelector('#mobile-toggle-heat');
  mobHeatBtn?.addEventListener('click', () => {
    toggleHeatmap();
  });

  initLeaflet();

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

function setBasemapMode(mode) {
  if (!leafletMap) return;
  currentBasemapMode = mode;

  // 1. Clean up existing tile layers
  activeTileLayers.forEach(layer => {
    try { leafletMap.removeLayer(layer); } catch (e) {}
  });
  activeTileLayers = [];

  // 2. Toggle visual mode classes on map container
  const mapContainer = document.getElementById('leaflet-map');
  if (mapContainer) {
    mapContainer.classList.remove('view-slate', 'view-satellite', 'view-contrast');
    mapContainer.classList.add(`view-${mode}`);
  }

  // 3. Load on-demand lightweight basemap tiles
  if (mode === 'satellite') {
    // Esri High-Resolution World Imagery (100% Free, no watermark, fast worldwide CDN)
    const satBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri, Maxar, Earthstar Geographics',
      maxNativeZoom: 18,
      maxZoom: 19
    });
    const satLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      attribution: '',
      maxNativeZoom: 18,
      maxZoom: 19,
      opacity: 0.95
    });
    satBase.addTo(leafletMap);
    satLabels.addTo(leafletMap);
    activeTileLayers.push(satBase, satLabels);
  } else if (mode === 'contrast') {
    // High Contrast Tactical View: Crisp OSM road vectors with high-contrast tactical styling
    const contrastBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    });
    contrastBase.addTo(leafletMap);
    activeTileLayers.push(contrastBase);
  } else {
    // Default Slate Gray: Esri ArcGIS World Dark Gray Base & Reference (Free, watermark-free, slate-grey)
    const cartoApiKey = window.PRAVAH_CARTO_KEY || localStorage.getItem('carto_api_key');
    if (cartoApiKey) {
      const cartoLayer = L.tileLayer(`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${encodeURIComponent(cartoApiKey)}`, {
        attribution: '&copy; CARTO, OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19
      });
      cartoLayer.addTo(leafletMap);
      activeTileLayers.push(cartoLayer);
    } else {
      const grayBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a>, HERE, Garmin, &copy; OpenStreetMap',
        maxNativeZoom: 16,
        maxZoom: 19
      });
      const grayRef = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxNativeZoom: 16,
        maxZoom: 19,
        opacity: 0.95
      });
      grayBase.addTo(leafletMap);
      grayRef.addTo(leafletMap);
      activeTileLayers.push(grayBase, grayRef);
    }
  }

  // 4. Ensure routes and pins are stacked cleanly above tiles
  if (directRouteLine) directRouteLine.bringToFront();
  if (safeRouteLine) safeRouteLine.bringToFront();

  // 5. Update UI active button indicators
  document.querySelectorAll('.map-view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.viewMode === mode);
  });

  const mobViewBtn = document.getElementById('mobile-toggle-view');
  if (mobViewBtn) {
    mobViewBtn.textContent = mode.toUpperCase().slice(0, 4);
  }
}

function initLeaflet() {
  const mapMount = document.getElementById('leaflet-map');
  if (!mapMount || typeof L === 'undefined') return;

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  leafletMap = L.map('leaflet-map', {
    center: [18.527, 73.848],
    zoom: 13,
    zoomControl: false
  });

  L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

  // Initialize selected basemap
  setBasemapMode(currentBasemapMode);

  // Global helper if the user wants to set a CARTO API key from the browser console
  window.setPravahCartoKey = (key) => {
    if (key) {
      localStorage.setItem('carto_api_key', key);
      window.PRAVAH_CARTO_KEY = key;
    } else {
      localStorage.removeItem('carto_api_key');
      delete window.PRAVAH_CARTO_KEY;
    }
    setBasemapMode(currentBasemapMode);
  };

  initPolylines();
  initRiskHeatmap();
  initNodeMarkers();

  const targetNode = sim.getNodeById('node-03');
  if (targetNode) {
    updateInspectionPanel(targetNode);
  }
}

function initPolylines() {
  if (!sim.routes || !leafletMap) return;

  directRouteLine = L.polyline(sim.routes.direct_route.segments, {
    color: '#ef4444',
    weight: 5,
    opacity: 0.9,
    dashArray: '8, 8'
  }).addTo(leafletMap);

  safeRouteLine = L.polyline(sim.routes.safe_route.segments, {
    color: '#10b981',
    weight: 5,
    opacity: 0.95
  }).addTo(leafletMap);

  const startIcon = L.divIcon({
    className: 'route-origin-pin',
    html: `<div style="background: #0284c7; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.25);">A</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

  const endIcon = L.divIcon({
    className: 'route-dest-pin',
    html: `<div style="background: #059669; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.25);">B</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

  L.marker([sim.routes.origin.lat, sim.routes.origin.lng], { icon: startIcon }).addTo(leafletMap);
  L.marker([sim.routes.destination.lat, sim.routes.destination.lng], { icon: endIcon }).addTo(leafletMap);
}

function initRiskHeatmap() {
  heatmapCircleGroup = L.layerGroup().addTo(leafletMap);
  sim.nodes.forEach(node => {
    const color = node.status === 'UNSAFE' ? '#dc2626' : node.status === 'AT_RISK' ? '#d97706' : '#0284c7';
    const radius = 300 + (node.risk_pct * 3.5);

    L.circle([node.lat, node.lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.12,
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
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([node.lat, node.lng], { icon: customIcon }).addTo(leafletMap);

    marker.on('click', () => {
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

    marker.setIcon(L.divIcon({
      className: 'pravah-marker',
      html: `<div class="pravah-marker-pin ${pinClass}">${node.id.replace('node-0', 'N')}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    }));
  });
}

function updateRouteStates() {
  const node3 = sim.getNodeById('node-03');
  const advisoryPill = document.getElementById('route-advisory-pill');

  if (node3 && node3.status === 'UNSAFE') {
    if (advisoryPill) {
      advisoryPill.className = 'map-hud-pill status-pill-unsafe';
      advisoryPill.innerHTML = 'DETOUR ACTIVE: Causeway Flooded — Use Ridge Highway (+7 min)';
    }

    directRouteLine?.setStyle({
      color: '#dc2626',
      weight: 6,
      dashArray: '6, 6',
      opacity: 0.95
    });

    safeRouteLine?.setStyle({
      color: '#059669',
      weight: 6,
      opacity: 1
    });
  } else {
    if (advisoryPill) {
      advisoryPill.className = 'map-hud-pill status-pill-safe';
      advisoryPill.innerHTML = 'NORMAL ROUTE: Lowland Causeway is Clear & Dry';
    }

    directRouteLine?.setStyle({
      color: '#0284c7',
      weight: 4,
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
  panel.querySelector('#inspect-water-val').style.color = isUnsafe ? 'var(--status-unsafe)' : isRisk ? 'var(--status-risk)' : 'var(--text-primary)';

  panel.querySelector('#inspect-rise-val').textContent = `${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} cm/h`;
  panel.querySelector('#inspect-node-impact').textContent = node.road_impact;
  panel.querySelector('#inspect-detail-btn').href = `#node-detail?id=${node.id}`;
}
