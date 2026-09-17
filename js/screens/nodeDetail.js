/**
 * PravahAi Screen: Node Deep Diagnostics (nodeDetail.js)
 * Live water-level time series, edge-AI camera vision canvas, rolling rainfall, and hardware telemetry
 */

import { sim } from '../sim.js';
import { CameraFeedComponent } from '../components/cameraFeed.js';

let telemetryChart = null;
let cameraFeed = null;
let currentNodeId = 'node-03';
let unsubscribeTick = null;
let chartTimeLabels = [];
let chartWaterHistory = [];

export function renderNodeDetail(container, params) {
  if (params && params.id) {
    currentNodeId = params.id;
  }

  const node = sim.getNodeById(currentNodeId);
  const isUnsafe = node.status === 'UNSAFE';
  const isRisk = node.status === 'AT_RISK';
  const pillClass = isUnsafe ? 'status-pill-unsafe' : isRisk ? 'status-pill-risk' : 'status-pill-safe';

  container.innerHTML = `
    <!-- Node Picker Bar -->
    <div class="node-picker-bar">
      ${sim.nodes.map(n => `
        <button class="node-picker-chip ${n.id === currentNodeId ? 'active' : ''}" data-id="${n.id}">
          <span class="status-dot ${n.status === 'UNSAFE' ? 'status-dot-unsafe' : n.status === 'AT_RISK' ? 'status-dot-risk' : 'status-dot-safe'}"></span>
          ${n.id.toUpperCase()}: ${n.name.split('(')[0].trim()}
        </button>
      `).join('')}
    </div>

    <!-- Section Header -->
    <div class="section-header">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <h1 class="section-title" id="node-title">${node.name}</h1>
          <span id="node-status-pill" class="status-pill ${pillClass}">${node.status.replace('_', ' ')}</span>
        </div>
        <p class="section-subtitle" id="node-subtitle">${node.location} • Elevation ${node.elevation_m}m ASL</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <span class="prototype-disclaimer" style="margin: 0;">
          Hardware: <strong>${node.edge_device}</strong>
        </span>
      </div>
    </div>

    <!-- Main Grid: Telemetry Chart (Left) & Camera Vision Canvas (Right) -->
    <div class="node-detail-grid">
      <!-- Water Level Time-Series Chart -->
      <div class="glass-panel telemetry-chart-card">
        <div class="chart-header">
          <div>
            <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--text-main);">
              Live Ultrasonic Water Depth vs. Critical Clearance
            </h3>
            <p style="font-size: var(--text-xs); color: var(--text-muted);">
              Sampling frequency: 2s • Ultrasonic dual-transducer with Kalman noise filtering
            </p>
          </div>
          <div class="live-beacon">
            <span class="live-beacon-dot"></span>
            TICKING
          </div>
        </div>

        <div class="telemetry-chart-box">
          <canvas id="node-telemetry-chart"></canvas>
        </div>

        <!-- 4-Stat Sub-Grid -->
        <div class="metrics-quad-grid">
          <div class="metric-quad-box">
            <div class="metric-quad-label">Current Water Level</div>
            <div id="stat-water-level" class="metric-quad-value" style="color: ${isUnsafe ? 'var(--status-unsafe)' : isRisk ? 'var(--status-risk)' : 'var(--accent-deep)'};">
              ${node.water_level}m
            </div>
            <div class="metric-quad-sub">Critical: ${node.critical_threshold}m</div>
          </div>

          <div class="metric-quad-box">
            <div class="metric-quad-label">Instantaneous Rise</div>
            <div id="stat-rate-rise" class="metric-quad-value">
              ${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} <span style="font-size: 0.8rem;">cm/h</span>
            </div>
            <div class="metric-quad-sub" id="stat-rate-trend">${node.rate_of_rise > 4 ? '⚠ Accelerating' : '✓ Normal'}</div>
          </div>

          <div class="metric-quad-box">
            <div class="metric-quad-label">Rolling Rain (15m)</div>
            <div id="stat-rain-15" class="metric-quad-value">${node.rainfall_15m} <span style="font-size: 0.8rem;">mm</span></div>
            <div class="metric-quad-sub">60m: ${node.rainfall_60m}mm</div>
          </div>

          <div class="metric-quad-box">
            <div class="metric-quad-label">Nowcast Risk</div>
            <div id="stat-risk-score" class="metric-quad-value">${node.risk_pct}%</div>
            <div class="metric-quad-sub">Fusion Confidence: 94%</div>
          </div>
        </div>
      </div>

      <!-- Edge Camera Vision Feed Simulator -->
      <div class="glass-panel camera-card">
        <div class="chart-header">
          <div>
            <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--text-main);">
              Roadside Edge Vision (CV)
            </h3>
            <p style="font-size: var(--text-xs); color: var(--text-muted);">
              Synthetic roadside optical stream with YOLOv8-nano puddle segmentation
            </p>
          </div>
          <span class="status-pill status-pill-safe" id="camera-status-pill">CAMERA ACTIVE</span>
        </div>

        <div class="camera-canvas-wrapper">
          <canvas id="edge-camera-canvas"></canvas>
          <div class="camera-osd-overlay">
            <div class="camera-osd-top">
              <span>● REC <span class="camera-rec-dot"></span></span>
              <span>PRAVAH-CAM-03 • 28.4 FPS</span>
            </div>
            <div class="camera-osd-bottom">
              <span class="camera-ai-tag" id="camera-ai-tag">CV: PONDING SEGMENTATION</span>
              <span>LATENCY: 38ms</span>
            </div>
          </div>
        </div>

        <!-- Sensor Diagnostics -->
        <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); padding: 8px 10px; background: rgba(230,243,250,0.5); border-radius: 8px;">
            <span>Battery Charge</span>
            <strong>${node.battery_pct}% (Solar Harvesting: ${node.solar_w}W)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); padding: 8px 10px; background: rgba(230,243,250,0.5); border-radius: 8px;">
            <span>LoRa Signal Strength (RSSI)</span>
            <strong>${node.lora_rssi} dBm (Mesh Link Peer-4)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); padding: 8px 10px; background: rgba(230,243,250,0.5); border-radius: 8px;">
            <span>Road Impact Assessment</span>
            <strong style="color: ${isUnsafe ? 'var(--status-unsafe)' : 'var(--text-main)'};">${node.road_impact}</strong>
          </div>
        </div>
      </div>
    </div>
  `;

  // Chip click handlers
  container.querySelectorAll('.node-picker-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const id = chip.getAttribute('data-id');
      window.location.hash = `#node-detail?id=${id}`;
    });
  });

  // Init Camera Canvas
  const canvas = container.querySelector('#edge-camera-canvas');
  cameraFeed = new CameraFeedComponent(canvas);
  cameraFeed.setState(node.status, node.water_level);

  // Init Telemetry Chart
  initTelemetryChart(container.querySelector('#node-telemetry-chart'), node);

  // Subscribe to sim updates
  if (unsubscribeTick) unsubscribeTick();
  unsubscribeTick = sim.on('tick', () => {
    const updated = sim.getNodeById(currentNodeId);
    if (!updated) return;

    cameraFeed?.setState(updated.status, updated.water_level);
    pushChartData(updated);
    updateMetricsDOM(updated);
  });
}

function initTelemetryChart(canvasEl, node) {
  if (!canvasEl || typeof Chart === 'undefined') return;
  if (telemetryChart) {
    telemetryChart.destroy();
  }

  // Generate 8 seed history points
  chartTimeLabels = [];
  chartWaterHistory = [];
  const baseVal = node.water_level;
  for (let i = 7; i >= 0; i--) {
    chartTimeLabels.push(`-${i * 15}s`);
    const val = +(baseVal - (i * 0.04) + (Math.random() * 0.02)).toFixed(2);
    chartWaterHistory.push(Math.max(0.2, val));
  }

  const ctx = canvasEl.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 260);
  gradient.addColorStop(0, 'rgba(30, 167, 219, 0.45)');
  gradient.addColorStop(1, 'rgba(30, 167, 219, 0.02)');

  telemetryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartTimeLabels,
      datasets: [
        {
          label: 'Measured Water Level (m)',
          data: chartWaterHistory,
          borderColor: '#1ea7db',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#0a6ea8'
        },
        {
          label: 'Warning Level (1.6m)',
          data: chartTimeLabels.map(() => node.warning_threshold),
          borderColor: '#e08b00',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Critical Clearance (2.3m)',
          data: chartTimeLabels.map(() => node.critical_threshold),
          borderColor: '#d9383e',
          borderWidth: 2,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: +(node.critical_threshold * 1.35).toFixed(1),
          ticks: {
            stepSize: 0.5,
            callback: v => `${v}m`,
            color: '#48667c',
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 }
          },
          grid: { color: 'rgba(10, 110, 168, 0.08)' }
        },
        x: {
          ticks: {
            color: '#48667c',
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 }
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
            color: '#243e52'
          }
        }
      }
    }
  });
}

function pushChartData(node) {
  if (!telemetryChart) return;
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  chartTimeLabels.push(nowStr);
  chartWaterHistory.push(node.water_level);

  if (chartTimeLabels.length > 10) {
    chartTimeLabels.shift();
    chartWaterHistory.shift();
  }

  telemetryChart.data.labels = chartTimeLabels;
  telemetryChart.data.datasets[0].data = chartWaterHistory;
  telemetryChart.data.datasets[1].data = chartTimeLabels.map(() => node.warning_threshold);
  telemetryChart.data.datasets[2].data = chartTimeLabels.map(() => node.critical_threshold);

  if (node.status === 'UNSAFE') {
    telemetryChart.data.datasets[0].borderColor = '#d9383e';
  } else if (node.status === 'AT_RISK') {
    telemetryChart.data.datasets[0].borderColor = '#e08b00';
  } else {
    telemetryChart.data.datasets[0].borderColor = '#1ea7db';
  }

  telemetryChart.update('none');
}

function updateMetricsDOM(node) {
  const isUnsafe = node.status === 'UNSAFE';
  const isRisk = node.status === 'AT_RISK';
  const pillClass = isUnsafe ? 'status-pill-unsafe' : isRisk ? 'status-pill-risk' : 'status-pill-safe';

  const statusPill = document.getElementById('node-status-pill');
  if (statusPill) {
    statusPill.className = `status-pill ${pillClass}`;
    statusPill.textContent = node.status.replace('_', ' ');
  }

  const statWater = document.getElementById('stat-water-level');
  if (statWater) {
    statWater.textContent = `${node.water_level}m`;
    statWater.style.color = isUnsafe ? 'var(--status-unsafe)' : isRisk ? 'var(--status-risk)' : 'var(--accent-deep)';
  }

  const statRise = document.getElementById('stat-rate-rise');
  if (statRise) {
    statRise.innerHTML = `${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} <span style="font-size: 0.8rem;">cm/h</span>`;
  }

  const statRain = document.getElementById('stat-rain-15');
  if (statRain) {
    statRain.innerHTML = `${node.rainfall_15m} <span style="font-size: 0.8rem;">mm</span>`;
  }

  const statRisk = document.getElementById('stat-risk-score');
  if (statRisk) {
    statRisk.textContent = `${node.risk_pct}%`;
  }
}
