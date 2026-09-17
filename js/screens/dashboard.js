/**
 * PravahAi Screen: Overview Dashboard (dashboard.js)
 * Risk gauge, 30-120min horizon forecast chart, fleet status strip, live alerts feed
 */

import { sim } from '../sim.js';
import { RiskGaugeComponent } from '../components/riskGauge.js';
import { AlertFeedComponent } from '../components/alertFeed.js';

let chartInstance = null;
let gaugeComponent = null;
let alertFeedComponent = null;
let unsubscribeTick = null;

export function renderDashboard(container) {
  container.innerHTML = `
    <!-- Mobile Sticky Risk Mini-Bar -->
    <div class="mobile-sticky-risk-bar">
      <div class="sticky-risk-left">
        <span class="live-beacon-dot"></span>
        <span>METRO BASIN NOWCAST:</span>
        <span id="mobile-sticky-risk-score" class="sticky-risk-score">--%</span>
      </div>
      <span id="mobile-sticky-status-pill" class="status-pill status-pill-safe">SAFE</span>
    </div>

    <!-- Section Header -->
    <div class="section-header">
      <div>
        <h1 class="section-title">Overview Dashboard</h1>
        <p class="section-subtitle">Real-time edge telemetry and 30–120 minute flood risk nowcasting</p>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span class="live-beacon">
          <span class="live-beacon-dot"></span>
          EDGE MESH LIVE (4s TICK)
        </span>
      </div>
    </div>

    <!-- Top Grid: Risk Gauge & Horizon Forecast Chart -->
    <div class="dashboard-top-grid">
      <!-- Risk Gauge -->
      <div id="risk-gauge-container" class="glass-panel gauge-card">
        <!-- Injected by RiskGaugeComponent -->
      </div>

      <!-- Horizon Forecast Chart -->
      <div class="glass-panel horizon-chart-card">
        <div class="chart-header">
          <div>
            <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--text-main);">
              Nowcast Risk Projection by Horizon
            </h3>
            <p style="font-size: var(--text-xs); color: var(--text-muted);">
              Hydrological edge-surrogate model prediction (30 / 60 / 90 / 120 minutes)
            </p>
          </div>
          <span class="status-pill status-pill-safe" id="forecast-trend-tag">TREND: STABLE</span>
        </div>

        <div class="chart-container-box">
          <canvas id="horizon-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- Fleet / Node Status Strip -->
    <div class="fleet-section">
      <div class="chart-header" style="margin-bottom: 10px;">
        <h3 style="font-size: var(--text-base); font-weight: 800; color: var(--text-main);">
          Edge Monitoring Fleet Status
        </h3>
        <span style="font-size: var(--text-xs); color: var(--text-muted);">
          6 Active Distributed Nodes • Click node for deep diagnostics
        </span>
      </div>

      <div id="fleet-nodes-mount" class="fleet-scroll-container">
        <!-- Rendered dynamically from sim.nodes -->
      </div>
    </div>

    <!-- Active Alerts Feed -->
    <div id="alerts-feed-mount">
      <!-- Injected by AlertFeedComponent -->
    </div>
  `;

  // Initialize Components
  const gaugeMount = container.querySelector('#risk-gauge-container');
  gaugeComponent = new RiskGaugeComponent(gaugeMount);

  const alertsMount = container.querySelector('#alerts-feed-mount');
  alertFeedComponent = new AlertFeedComponent(alertsMount);
  alertFeedComponent.update(sim.alerts);

  // Initialize Horizon Chart using Chart.js
  initHorizonChart(container.querySelector('#horizon-chart'));

  // Render initial fleet
  renderFleetStrip(container.querySelector('#fleet-nodes-mount'));

  // Update initial gauge
  const initialRisk = sim.getOverallSystemRisk();
  gaugeComponent.update(initialRisk);
  updateMobileStickyBar(initialRisk);

  // Subscribe to sim ticks
  if (unsubscribeTick) unsubscribeTick();
  unsubscribeTick = sim.on('tick', ({ nodes, systemRisk }) => {
    gaugeComponent?.update(systemRisk);
    updateMobileStickyBar(systemRisk);
    renderFleetStrip(container.querySelector('#fleet-nodes-mount'));
    alertFeedComponent?.update(sim.alerts);
    updateHorizonChart(systemRisk);
  });
}

function updateMobileStickyBar(risk) {
  const scoreEl = document.getElementById('mobile-sticky-risk-score');
  const pillEl = document.getElementById('mobile-sticky-status-pill');
  if (!scoreEl || !pillEl) return;

  scoreEl.textContent = `${risk}%`;
  if (risk >= 75) {
    pillEl.className = 'status-pill status-pill-unsafe';
    pillEl.textContent = 'UNSAFE';
  } else if (risk >= 45) {
    pillEl.className = 'status-pill status-pill-risk';
    pillEl.textContent = 'AT RISK';
  } else {
    pillEl.className = 'status-pill status-pill-safe';
    pillEl.textContent = 'SAFE';
  }
}

function renderFleetStrip(mountEl) {
  if (!mountEl) return;
  mountEl.innerHTML = sim.nodes.map(node => {
    const isUnsafe = node.status === 'UNSAFE';
    const isRisk = node.status === 'AT_RISK';
    const pillClass = isUnsafe ? 'status-pill-unsafe' : isRisk ? 'status-pill-risk' : 'status-pill-safe';

    return `
      <a href="#node-detail?id=${node.id}" class="glass-panel glass-card-interactive fleet-node-card" style="text-decoration: none;">
        <div class="fleet-node-header">
          <span class="fleet-node-name" title="${node.name}">${node.name}</span>
          <span class="status-pill ${pillClass}" style="padding: 2px 8px; font-size: 0.68rem;">
            ${node.status.replace('_', ' ')}
          </span>
        </div>

        <div class="fleet-metrics-row">
          <span>Water Depth</span>
          <span class="fleet-water-val" style="color: ${isUnsafe ? 'var(--status-unsafe)' : isRisk ? 'var(--status-risk)' : 'var(--accent-deep)'};">
            ${node.water_level}m
          </span>
        </div>

        <div class="fleet-metrics-row">
          <span>Rate of Rise</span>
          <span style="font-weight: 600;">${node.rate_of_rise > 0 ? '+' : ''}${node.rate_of_rise} cm/h</span>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); border-top: 1px solid rgba(10,110,168,0.08); padding-top: 6px;">
          <span>⚡ ${node.battery_pct}%</span>
          <span>📶 ${node.lora_rssi} dBm</span>
          <span>${node.last_ping}</span>
        </div>
      </a>
    `;
  }).join('');
}

function initHorizonChart(canvasEl) {
  if (!canvasEl || typeof Chart === 'undefined') return;
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = canvasEl.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, 'rgba(30, 167, 219, 0.45)');
  gradient.addColorStop(1, 'rgba(30, 167, 219, 0.02)');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Now (0m)', '+30 min', '+60 min', '+90 min', '+120 min'],
      datasets: [
        {
          label: 'Baseline Model Forecast',
          data: [28, 42, 65, 78, 85],
          borderColor: '#1ea7db',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#1ea7db',
          pointBorderWidth: 2.5,
          pointRadius: 4.5,
          pointHoverRadius: 7
        },
        {
          label: 'Critical Road Inundation Threshold',
          data: [75, 75, 75, 75, 75],
          borderColor: 'rgba(217, 56, 62, 0.65)',
          borderWidth: 2,
          borderDash: [6, 6],
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 14,
            usePointStyle: true,
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '600' },
            color: '#243e52'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(12, 31, 46, 0.9)',
          padding: 10,
          cornerRadius: 8,
          bodyFont: { size: 12 }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: v => `${v}%`,
            font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" },
            color: '#48667c'
          },
          grid: { color: 'rgba(10, 110, 168, 0.08)' }
        },
        x: {
          ticks: {
            font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
            color: '#48667c'
          },
          grid: { display: false }
        }
      }
    }
  });
}

function updateHorizonChart(systemRisk) {
  if (!chartInstance) return;
  const isSurge = systemRisk >= 65;

  const mult = isSurge ? 1.25 : 0.85;
  const data = [
    systemRisk,
    Math.min(99, Math.round(systemRisk * mult)),
    Math.min(99, Math.round(systemRisk * mult * 1.15)),
    Math.min(99, Math.round(systemRisk * mult * 1.25)),
    Math.min(99, Math.round(systemRisk * mult * 1.3))
  ];

  chartInstance.data.datasets[0].data = data;
  chartInstance.update('none');

  const trendTag = document.getElementById('forecast-trend-tag');
  if (trendTag) {
    if (systemRisk >= 75) {
      trendTag.className = 'status-pill status-pill-unsafe';
      trendTag.textContent = 'TREND: INUNDATION IMMINENT';
    } else if (systemRisk >= 45) {
      trendTag.className = 'status-pill status-pill-risk';
      trendTag.textContent = 'TREND: ACCELERATING';
    } else {
      trendTag.className = 'status-pill status-pill-safe';
      trendTag.textContent = 'TREND: STABLE';
    }
  }
}
