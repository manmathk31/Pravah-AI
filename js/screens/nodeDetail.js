/**
 * PravahAi Screen: Node Deep Diagnostics (nodeDetail.js)
 * Clean water-level time series, edge camera vision, and hardware telemetry without emojis
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

  const node = sim.getNodeById(currentNodeId) || {
    id: 'node-03',
    name: 'Station #03 (Lowland Causeway)',
    location: 'Sector 4 Lowlands',
    status: 'AT_RISK',
    water_level: 1.76,
    critical_threshold: 1.85,
    rate_of_rise: 8.4,
    rainfall_15m: 19.2,
    rainfall_60m: 48.0,
    battery_pct: 91,
    solar_w: 4.1,
    edge_device: 'Station Computer #03',
    elevation_m: 536.8
  };
  const isUnsafe = node.status === 'UNSAFE';
  const isRisk = node.status === 'AT_RISK';
  const pillClass = isUnsafe ? 'status-pill-unsafe' : isRisk ? 'status-pill-risk' : 'status-pill-safe';
  const nodesList = (sim.nodes && sim.nodes.length > 0) ? sim.nodes : [node];

  container.innerHTML = `
    <!-- Node Picker Chips -->
    <div class="node-picker-bar">
      ${nodesList.map(n => `
        <button class="node-picker-chip ${n.id === currentNodeId ? 'active' : ''}" data-id="${n.id}">
          <span class="status-dot ${n.status === 'UNSAFE' ? 'status-dot-unsafe' : n.status === 'AT_RISK' ? 'status-dot-risk' : 'status-dot-safe'}"></span>
          ${n.id.toUpperCase()}: ${(n.name || '').split('(')[0].trim()}
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
      <div class="prototype-disclaimer" style="margin: 0;">
        Hardware: ${node.edge_device}
      </div>
    </div>

    <!-- Main Grid -->
    <div class="node-detail-grid">
      <!-- Water Level Time-Series Chart -->
      <div class="glass-panel telemetry-chart-card">
        <div class="section-header" style="margin-bottom: 12px;">
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">
              Water Depth vs. Danger Level
            </h3>
            <p style="font-size: 0.72rem; color: var(--text-muted);">
              Live water level readings compared against the flood danger line
            </p>
          </div>
          <div class="live-beacon">
            <span class="live-beacon-dot"></span>
            LIVE
          </div>
        </div>

        <div class="telemetry-chart-box">
          <canvas id="node-telemetry-chart"></canvas>
        </div>

        <!-- 4-Stat Sub-Grid -->
        <div class="metrics-quad-grid">
          <div class="metric-quad-box">
            <div class="metric-quad-label">Current Water Depth</div>
            <div id="stat-water-level" class="metric-quad-value" style="color: ${isUnsafe ? 'var(--status-unsafe)' : isRisk ? 'var(--status-risk)' : 'var(--primary-700)'};">
              ${node.water_level}m
            </div>
            <div class="metric-quad-sub">Danger Level: ${node.critical_threshold}m</div>
          </div>

          <div class="metric-quad-box">
            <div class="metric-quad-label">Rising Speed</div>
            <div id="stat-rate-rise" class="metric-quad-value">
              ${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} <span style="font-size: 0.75rem;">cm/h</span>
            </div>
            <div class="metric-quad-sub" id="stat-rate-trend">${node.rate_of_rise > 4 ? 'Rising Fast' : 'Steady'}</div>
          </div>

          <div class="metric-quad-box">
            <div class="metric-quad-label">Rainfall (15 min)</div>
            <div id="stat-rain-15" class="metric-quad-value">${node.rainfall_15m} <span style="font-size: 0.75rem;">mm</span></div>
            <div class="metric-quad-sub">Past hour: ${node.rainfall_60m}mm</div>
          </div>

          <div class="metric-quad-box">
            <div class="metric-quad-label">Flood Risk</div>
            <div id="stat-risk-score" class="metric-quad-value">${node.risk_pct}%</div>
            <div class="metric-quad-sub">Confidence: 94%</div>
          </div>
        </div>
      </div>

      <!-- Edge Camera Vision Feed -->
      <div class="glass-panel camera-card">
        <div class="section-header" style="margin-bottom: 8px;">
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">
              Live Street Safety Camera
            </h3>
            <p style="font-size: 0.72rem; color: var(--text-muted);">
              Real-time street camera detecting standing water and flooded curbs
            </p>
          </div>
          <span class="status-pill status-pill-safe">CAMERA LIVE</span>
        </div>

        <div class="camera-canvas-wrapper">
          <canvas id="edge-camera-canvas"></canvas>
          <div class="camera-osd-overlay">
            <div class="camera-osd-top">
              <span>LIVE <span class="camera-rec-dot"></span></span>
              <span>STREET-CAM-03 • 30 FPS</span>
            </div>
            <div class="camera-osd-bottom">
              <span class="camera-ai-tag">AI: DETECTING WATER</span>
              <span>INSTANT ANALYSIS</span>
            </div>
          </div>
        </div>

        <!-- Diagnostics -->
        <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; padding: 8px 12px; background: rgba(14, 28, 46, 0.85); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px;">
            <span style="color: var(--text-muted);">Battery & Solar</span>
            <strong style="color: #34d399;">${node.battery_pct}% (${node.solar_w}W Solar)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; padding: 8px 12px; background: rgba(14, 28, 46, 0.85); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px;">
            <span style="color: var(--text-muted);">Radio Signal Strength</span>
            <strong style="color: var(--accent-cyan); font-family: var(--font-family-mono);">${node.lora_rssi} dBm (Strong)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; padding: 8px 12px; background: rgba(14, 28, 46, 0.85); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px;">
            <span style="color: var(--text-muted);">Street Status</span>
            <strong style="color: ${isUnsafe ? 'var(--status-unsafe)' : '#ffffff'};">${node.road_impact}</strong>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll('.node-picker-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const id = chip.getAttribute('data-id');
      window.location.hash = `#node-detail?id=${id}`;
    });
  });

  const canvas = container.querySelector('#edge-camera-canvas');
  cameraFeed = new CameraFeedComponent(canvas);
  cameraFeed.setState(node.status, node.water_level);

  initTelemetryChart(container.querySelector('#node-telemetry-chart'), node);

  if (unsubscribeTick) unsubscribeTick();
  unsubscribeTick = sim.on('tick', () => {
    const updated = sim.getNodeById(currentNodeId);
    if (!updated) return;

    const titleEl = container.querySelector('#node-title');
    const pillEl = container.querySelector('#node-status-pill');
    const waterEl = container.querySelector('#stat-water-level');
    const riseEl = container.querySelector('#stat-rate-rise');
    const trendEl = container.querySelector('#stat-rate-trend');
    const riskEl = container.querySelector('#stat-risk-score');

    const updatedUnsafe = updated.status === 'UNSAFE';
    const updatedRisk = updated.status === 'AT_RISK';
    const newPill = updatedUnsafe ? 'status-pill-unsafe' : updatedRisk ? 'status-pill-risk' : 'status-pill-safe';

    if (pillEl) {
      pillEl.className = `status-pill ${newPill}`;
      pillEl.textContent = updated.status.replace('_', ' ');
    }

    if (waterEl) {
      waterEl.textContent = `${updated.water_level}m`;
      waterEl.style.color = updatedUnsafe ? 'var(--status-unsafe)' : updatedRisk ? 'var(--status-risk)' : '#ffffff';
    }

    if (riseEl) {
      riseEl.innerHTML = `${updated.rate_of_rise > 0 ? '+' : ''}${updated.rate_of_rise} <span style="font-size: 0.75rem;">cm/h</span>`;
    }

    if (trendEl) {
      trendEl.textContent = updated.rate_of_rise > 4 ? 'Surging' : 'Normal';
    }

    if (riskEl) {
      riskEl.textContent = `${updated.risk_pct}%`;
    }

    if (cameraFeed) {
      cameraFeed.setState(updated.status, updated.water_level);
    }

    if (telemetryChart) {
      chartWaterHistory.shift();
      chartWaterHistory.push(updated.water_level);
      telemetryChart.data.datasets[0].data = chartWaterHistory;
      telemetryChart.update('none');
    }
  });
}

function initTelemetryChart(canvasEl, node) {
  if (!canvasEl || typeof Chart === 'undefined') return;

  if (telemetryChart) {
    telemetryChart.destroy();
  }

  chartTimeLabels = [];
  chartWaterHistory = [];
  const baseVal = node.water_level;
  for (let i = 7; i >= 0; i--) {
    chartTimeLabels.push(`-${i * 15}s`);
    const val = +(baseVal - (i * 0.04) + (Math.random() * 0.02)).toFixed(2);
    chartWaterHistory.push(Math.max(0.2, val));
  }

  const ctx = canvasEl.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
  gradient.addColorStop(1, 'rgba(2, 132, 199, 0.02)');

  telemetryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartTimeLabels,
      datasets: [
        {
          label: 'Water Depth (m)',
          data: chartWaterHistory,
          borderColor: '#38bdf8',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 3.5,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#38bdf8'
        },
        {
          label: `Warning (${node.warning_threshold}m)`,
          data: chartTimeLabels.map(() => node.warning_threshold),
          borderColor: '#f59e0b',
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        },
        {
          label: `Critical (${node.critical_threshold}m)`,
          data: chartTimeLabels.map(() => node.critical_threshold),
          borderColor: '#ef4444',
          borderWidth: 1.5,
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
            color: '#8295ab',
            font: { family: "'Inter', sans-serif", size: 10 }
          },
          grid: { color: 'rgba(255, 255, 255, 0.06)' }
        },
        x: {
          ticks: {
            color: '#8295ab',
            font: { family: "'Inter', sans-serif", size: 10 }
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            color: '#cbd5e1',
            font: { family: "'Inter', sans-serif", size: 11, weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(6, 13, 22, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#38bdf8',
          borderColor: 'rgba(56, 189, 248, 0.4)',
          borderWidth: 1,
          padding: 10,
          bodyFont: { family: "'Inter', sans-serif", weight: '700' }
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
    telemetryChart.data.datasets[0].borderColor = '#ef4444';
  } else if (node.status === 'AT_RISK') {
    telemetryChart.data.datasets[0].borderColor = '#f59e0b';
  } else {
    telemetryChart.data.datasets[0].borderColor = '#38bdf8';
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
    statWater.style.color = isUnsafe ? 'var(--status-unsafe)' : isRisk ? 'var(--status-risk)' : '#ffffff';
  }

  const statRise = document.getElementById('stat-rate-rise');
  if (statRise) {
    statRise.innerHTML = `${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} <span style="font-size: 0.75rem;">cm/h</span>`;
  }

  const statRain = document.getElementById('stat-rain-15');
  if (statRain) {
    statRain.innerHTML = `${node.rainfall_15m} <span style="font-size: 0.75rem;">mm</span>`;
  }

  const statRisk = document.getElementById('stat-risk-score');
  if (statRisk) {
    statRisk.textContent = `${node.risk_pct}%`;
  }
}
